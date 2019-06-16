import Marker from './dataclasses/marker';
import { Trip } from './dataclasses/trip';
import LatLng from './dataclasses/latlng';
import MapService from './services/map-service';
import GeoLocService from './services/geoloc-service';
import RouteService from './services/route-service';
import Utils from './misc/utils';
import Env from './misc/env';
import { InfoHeader, MapStyleToggleButton, Menu, SpeedChooser } from './components/components';
import UIBuilder from './misc/ui-builder';
import VisualTrip from './dataclasses/visual-trip';
import { Nullable } from './misc/types';
import ElevationService from './services/elevation-service';
import ClickHandler from './misc/click-handler';

// to make typescript accept its existence... I'm sure there's a more proper way to do this, but it works for now.
declare const GoogleMapsLoader: any;

// can't use the proper google maps types here, as the google object has yet to be initialized
// (side note: whose idea was it to prohibit enums inside classes in typescript? -.-)
enum TravelMode {

  WALKING = 'WALKING',
  BICYCLING = 'BICYCLING'
}

// for manipulating app state
enum Change {

  speed,
  travelMode,
  prevTrip,
  currentTrip,
  tripDuration,
  tripDistance,
  negTripElevs,
  posTripElevs,
  currentPos,
  posMarker
} // Change

// App needs to be globally accessible (otherwise I'd have to pass it to almost everything, which is pointless & hopelessly wordy),
// so I'm making all things in it static.
/**
 * Overall holder/central hub for the app, containing the responses to ui actions and API fetches.
 * @author Ville Lohkovuori (2019)
 */
export default class App {

  static readonly MIN_SPEED = 1; // km/h
  static readonly MAX_SPEED = 50;
  static readonly DEFAULT_SPEED = 15;

  static get TravelMode() {

    return TravelMode;
  }

  // to give type info to object literal fields in App.state (haven't found any other way)
  private static readonly _initialPrevTrip: Nullable<Trip> = null;
  private static readonly _initialCurrentTrip: Nullable<Trip> = null;
  private static readonly _initialTravelMode: string = 'BICYCLING'; // to prevent any init issues (might work without this)

  // NOTE: outside of App, the setState function should
  // always be used to manipulate the state (accessing it directly is fine)
  static state = {

    speed: 1,
    travelMode: App._initialTravelMode,
    prevTrip: App._initialPrevTrip, // 'planned' trip (not yet visible)
    currentTrip: App._initialCurrentTrip, // ditto
    tripDuration: 0, // duration of a *visible* trip (result of a route fetch)
    tripDistance: 0, // distance of a visible trip
    negTripElevs: 0, // negative elevation change (downhill total) of a visible trip
    posTripElevs: 0, // positive elevation change (uphill total) of a visible trip
    currentPos: new LatLng(0,0),
    posMarker: null
  }; // state

  // these need the google object to be initialized, so it can't be done here
  private static _mapService: MapService;
  private static _routeService: RouteService;
  private static _elevationService: ElevationService;
  private static readonly _geoLocService: GeoLocService = new GeoLocService();

  // it was previously in MapService; moved it here to remove some couplings
  private static readonly _clickHandler = new ClickHandler();

  static google: any; // may be unnecessary

// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX INIT XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

  // app 'constructor'
  static initialize(): void {

    document.addEventListener('deviceready', App._onDeviceReady.bind(App), false);
  }

  // called down below in onDeviceReady
  private static _init(): void {

    // the GoogleMapsLoader comes automatically from google.js in the lib folder
    GoogleMapsLoader.KEY = Env.API_KEY;
    GoogleMapsLoader.LANGUAGE = 'en';
    GoogleMapsLoader.LIBRARIES = ['geometry', 'places'];

    GoogleMapsLoader.load(function(google: any) {

      // not sure if needed or not... I'm using just google.maps.x in most places; but there was one error 
      // in MapService when I didn't do this
      App.google = google;

      // NOTE: the MapService needs to be created first, as a lot of other things depend on
      // the google map object within it already existing. (the map could be moved to App to 
      // fix this, but i'm pretty sure that's a bad solution)
      App._mapService = new MapService();
      App._routeService = new RouteService(App.onRouteFetchSuccess, App.onRouteFetchFailure);
      App._elevationService = new ElevationService(App.onElevationFetchSuccess, App.onElevationFetchFailure);

      App.setState(Change.speed, App.DEFAULT_SPEED);
      App.setState(Change.travelMode, App.TravelMode.BICYCLING);
      App.setState(Change.posMarker, Marker.makePosMarker(App._mapService.map, App.state.currentPos));

      UIBuilder.buildUI();

      App._geoLocService.start();
    }); // GoogleMapsLoader.load
  } // _init

  // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX API QUERY RESPONSES XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

  static onRouteFetchSuccess(fetchResult: google.maps.DirectionsResult, successfulTrip: Trip): void {

    App.setState(Change.prevTrip, successfulTrip.copy()); // save the trip in case the next one is unsuccessful

    if (App.hasVisualTrip) {

      App.mapService.clearTripFromMap(); // clear the old polyline and markers from the map
    }

    // it always has a valid destCoord, since the fetch was successful
    const visualTrip = new VisualTrip(fetchResult, successfulTrip.destCoord!, successfulTrip.wayPoints);

    const route: google.maps.DirectionsRoute = fetchResult.routes[0];

    // fetch elevations for the trip (it's only rendered on the map when the elev. request is resolved)
    App._elevationService.fetchElevations(visualTrip);
    
    const dist = Utils.distanceInKm(route);
    App.setState(Change.tripDistance, dist);

    const dura = Utils.duraInDecimHours(dist, App.state.speed);
    App.setState(Change.tripDuration, dura);

    // TODO (perhaps): these could be auto-called when the state values change
    InfoHeader.updateDistance(dist);
    InfoHeader.updateDuration(dura);
  } // onRouteFetchSuccess

  // usually occurs when clicking on water, mountains, etc
  static onRouteFetchFailure(): void {

    // if the first fetch is made to an invalid location (e.g. over water), 
    // this leaves the marker hanging over water. not sure how to fix it atm.
    if (App.state.prevTrip === null) return;
    // restore a successful trip (in most situations; failure is harmless though)
    App.setState(Change.currentTrip, App.state.prevTrip.copy());
    App.state.currentTrip!.autoRefetchRouteOnChange(); // we need to reactivate automatic fetches (putting this in the Trip constructor causes an infinite loop)
  } // onRouteFetchFailure

  static onElevationFetchSuccess(visualTrip: VisualTrip, resultsArray: Array<google.maps.ElevationResult>): void {

    // the elevations could be part of the trip; but for that, the trip would have to be created here, 
    // as it's supposed to have only immutable data. and for that local creation, onElevationFetchSuccess would need a ton 
    // of superfluous arguments. the callback hell means that there are no neat solutions here.
    const elevations = resultsArray.map(result => result.elevation);

    // calculate the positive and negative elevation changes (and store them in App.state)
    App._calculateElevTotals(elevations);

    InfoHeader.updateElevations(App.state.posTripElevs, App.state.negTripElevs);

    App.mapService.renderTripOnMap(visualTrip, elevations);
  }

  static onElevationFetchFailure(visualTrip: VisualTrip): void {

    App.mapService.renderTripOnMap(visualTrip, null);
  }

  // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX UI ACTION RESPONSES XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

  // -------------------------------- MAP TAPS & DRAGS -------------------------------------------------------------------

  static onGoogleMapLongPress(event: any): void {

    const destCoord: LatLng = Utils.latLngFromClickEvent(event);

    // this gets rid of all waypoints, but that is the preferred behavior 
    // (if you want to keep them, just drag the dest marker)
    App.setState(Change.currentTrip, Trip.makeTrip(destCoord));

    // uses mobx to automatically refetch the route whenever the dest coord or waypoints change.
    App.state.currentTrip!.autoRefetchRouteOnChange();
  } // onGoogleMapLongPress

  static onGoogleMapDoubleClick(event: any): void {

    // waypoints cannot be added without a valid destination
    if (!App.hasVisualTrip) return;

    const clickedPos = Utils.latLngFromClickEvent(event);
    App.state.currentTrip!.addWayPoint(clickedPos);
  }

  static onDestMarkerDragEnd(event: any): void {

    App.state.currentTrip!.destCoord = Utils.latLngFromClickEvent(event);

    App.clickHandler.markerDragEventJustStopped = true; // needed in order not to tangle the logic with that of a long press

    setTimeout(() => {

      App.clickHandler.markerDragEventJustStopped = false;
    }, ClickHandler.MARKER_DRAG_TIMEOUT);
  } // onDestMarkerDragEnd

/*// disabling for now, due to some bizarre issues when double-clicking on the map (it adds a waypoint but moves the dest marker as well!)
  // ideally, it should be possible to also clear the map with a double click on the dest marker.
  static onDestMarkerDoubleClick(event: any): void {

    App._clearTrips();
  } */

  static onDestMarkerClick(event: any): void {
    
    console.log("click event: " + JSON.stringify(event));
    // TODO: open an info window with place info
  }

  static onWayPointMarkerDragEnd(event: any): void {

    const latLng = Utils.latLngFromClickEvent(event);
    App.state.currentTrip!.updateWayPoint(event.wpIndex, latLng);

    App.clickHandler.markerDragEventJustStopped = true; // needed in order not to tangle the logic with that of a long press

    setTimeout(() => {

      App.clickHandler.markerDragEventJustStopped = false;
    }, ClickHandler.MARKER_DRAG_TIMEOUT);
  } // onWayPointMarkerDragEnd

  static onWayPointMarkerDblClick(event: any): void {

    App.state.currentTrip!.removeWayPoint(event.wpIndex);
  }

  // -------------------------------- OVERLAY UI CLICKS ---------------------------------------------------------------

  static onLocButtonClick(): void {

    App.mapService.reCenter(App.state.currentPos);
  }

  static onClearButtonClick(): void {

    App._clearTrips();
  } // onClearButtonClick

  // toggles the right-hand corner menu
  static onMenuButtonClick(event: any): void {

    Menu.toggleVisibility(event);
  }

  static onMapStyleToggleButtonClick(event: any): void {
    
    const textHolderDiv = event.target;
    const value = textHolderDiv.innerText; // supposedly expensive... but .textContent refuses to work with the switch, even though the type is string!
  
    switch (value) {
      case MapStyleToggleButton.NORMAL_TXT:
        
        App.mapService.map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
        break;
      case MapStyleToggleButton.SAT_TXT:
        
        App.mapService.map.setMapTypeId(google.maps.MapTypeId.HYBRID);
        break;
      case MapStyleToggleButton.TERRAIN_TXT:
        
        App.mapService.map.setMapTypeId(google.maps.MapTypeId.TERRAIN);
        break;
      default:

        console.log("something is badly wrong with map style toggle clicks...");
        console.log("text value in default statement: " + value);
        break;
    } // switch
  } // onMapStyleToggleButtonClick

  static onCyclingLayerToggleButtonClick(event: any): void {

    App.mapService.toggleBikeLayer(event);
  }

  static onTravelModeToggleButtonClick(event: any): void {

    App.setState(Change.travelMode, event.target.value); 
  }

  /**
   * Updates the info header's duration value upon speed change (if the app has a VisualTrip atm).
   */
  static onSpeedChooserValueChange(event: any): void {

    App.setState(Change.speed, event.target.value); // it's always valid due to the slider's min and max constraints
    SpeedChooser.updateDisplayedSpeed(App.state.speed);

    // there's always a speed value, but it's only used if there's a successfully fetched trip that's being displayed
    if (!App.hasVisualTrip) return;

    const newDura = Utils.duraInDecimHours(App.state.tripDistance, App.state.speed);
    App.setState(Change.tripDuration, newDura);
    InfoHeader.updateDuration(newDura);
  } // onSpeedChooserValueChange

  /**
   * Toggles between displaying distance/duration and upward/downward elevation changes.
   */
  static onInfoHeaderClick(): void {

    InfoHeader.toggleDisplayState();
  }

  // -------------------------------- GEOLOC --------------------------------------------------------------------------

  // called by GeoLocService each time it gets a new location
  static onGeoLocSuccess(oldCoord: LatLng, newCoord: LatLng): void {
    
    // need to cast because of an issue with type info 
    // (the object literal can't be given the correct type thanks to init order issues)
    const posMarker = App.state.posMarker! as Marker;

    posMarker.clearFromMap(); 
    App.setState(Change.currentPos, newCoord);
    posMarker.moveTo(newCoord);

    // make the camera follow the user when moving rapidly enough
    if (GeoLocService.diffIsOverCameraMoveThreshold(oldCoord, newCoord)) {

      App.mapService.reCenter(newCoord); 
    }
  } // onGeoLocSuccess

// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX HELPERS XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

  // called on clear button click
  private static _clearTrips() {
    
    if (!App.hasVisualTrip) return;

    if (App.state.prevTrip) {

      App.state.prevTrip!.clear(); // violation of state management principles... see if it's ok to disable
      App.setState(Change.prevTrip, null);
    }

    App.state.currentTrip!.clear(); // if there is a visualTrip, it exists
    App.setState(Change.currentTrip, null);
    App.mapService.clearTripFromMap();
    InfoHeader.reset();
  } // clearTrips

  private static _calculateElevTotals(elevs: number[]): void {

    let negTotal = 0;
    let posTotal = 0;
    let prevElev = elevs[0];
    const size = elevs.length;

    for (let i = 1; i < size; i++) {

      const value = elevs[i];

      if (prevElev - value == 0) continue;

      prevElev - value < 0 ? posTotal += value : negTotal += value;
      prevElev = value;
    } // for

    // technically it should return them, but ehh, whatever
    App.setState(Change.posTripElevs, posTotal);
    App.setState(Change.negTripElevs, negTotal);
  } // _calculateElevTotals

  // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX LIFECYCLE METHODS XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

  private static _onDeviceReady(): void {

    App._receivedEvent('deviceready');

    document.addEventListener("pause", App._onPause, false);
    document.addEventListener("resume", App._onResume, false);

    App._init();
  } // onDeviceReady

  private static _onPause(): void {

    App._geoLocService.stop();
  }

  private static _onResume(): void {
    
    App._geoLocService.start();
  }

  // Update DOM on a received event
  private static _receivedEvent(id: string): void {

    // console.log('Received Event: ' + id);
  } // _receivedEvent

    // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX GETTERS & SETTERS XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

  /**
   * For changing the app state. ONLY this function should be used to do it.
  */
  static setState(change: Change, value: any) {

    switch(change) {

      case Change.speed:
        App.state.speed = value;
        break;
      case Change.travelMode:
        App.state.travelMode = value;
        break;
      case Change.prevTrip:
        App.state.prevTrip = value;
        break;
      case Change.currentTrip:
        App.state.currentTrip = value;
        break;
      case Change.tripDistance:
        App.state.tripDistance = value;
        break;
      case Change.tripDuration:
        App.state.tripDuration = value;
        break;
      case Change.negTripElevs:
          App.state.negTripElevs = value;
          break;
      case Change.posTripElevs:
          App.state.posTripElevs = value;
          break;
      case Change.currentPos:
        App.state.currentPos = value;
        break;
      case Change.posMarker:
        App.state.posMarker = value;
        break;
    } // switch
  } // setState

  static get hasVisualTrip(): boolean {

    return App.mapService.visualTrip !== null;
  }

/*
  static get currentPos(): LatLng {

    return App._currentPos;
  }

  static set currentPos(newPos: LatLng) {

    App._currentPos = newPos;
  }

  static get plannedTrip(): Nullable<Trip> {

    return App._plannedTrip;
  }

  static set plannedTrip(newTrip: Nullable<Trip>) {

    App._plannedTrip = newTrip;
  }

  static get prevTrip(): Nullable<Trip> {

    return App._prevTrip;
  }

  static set prevTrip(newTrip: Nullable<Trip>) {

    App._prevTrip = newTrip;
  } */

  static get mapService(): MapService {

    return App._mapService;
  }

  static get routeService(): RouteService {

    return App._routeService;
  }

/*
  static get speed(): number {

    return App._speed;
  }
  static set speed(newSpeed: number) {

    App._speed = newSpeed;
  } */

  /*
  static get travelMode(): TravelMode {

    return App._travelMode;
  }

  static set travelMode(newMode: TravelMode) {

    App._travelMode = newMode;
  } */

  /*
  static get posMarker(): Marker {

    return App._posMarker;
  } */
  
  static get clickHandler(): ClickHandler {

    return this._clickHandler;
  }

} // App

App.initialize();