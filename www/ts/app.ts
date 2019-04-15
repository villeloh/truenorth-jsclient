import Marker from './dataclasses/marker';
import { Trip } from './dataclasses/trip';
import LatLng from './dataclasses/latlng';
import MapService from './services/map-service';
import GeoLocService from './services/geoloc-service';
import RouteService from './services/route-service';
import Utils from './misc/utils';
import Env from './misc/env';
import { InfoHeader, MapStyleToggleButton, Menu } from './components/components';
import UIBuilder from './misc/ui-builder';
import VisualTrip from './dataclasses/visual-trip';
import { Nullable } from './misc/types';

// to make typescript accept its existence... I'm sure there's a more proper way to do this, but it works for now.
declare const GoogleMapsLoader: any;

/**
 * Overall holder/central hub for the app, containing the responses to ui actions and route fetches.
 * @author Ville Lohkovuori (2019)
 */

// can't use the proper google types here, as the google object has yet to be initialized
// (side note: whose idea was it to prohibit enums inside classes in typescript? -.-)
enum TravelMode {

  WALKING = 'WALKING',
  BICYCLING = 'BICYCLING'
}

// app needs to be globally accessible (otherwise I'd have to pass it to almost everything, which is pointless & hopelessly wordy),
// so I'm making all things in it static.
export default class App {

  static readonly MAX_SPEED = 50; // km/h
  static readonly DEFAULT_SPEED = 15;

  static get TravelMode() {

    return TravelMode;
  }

  // speed and travel mode are not parts of Trip because they exist regardless if there's a current trip or not
  private static _speed: number; // km/h
  private static _travelMode: TravelMode; // BICYCLING / WALKING

  // they need the google object to be initialized, so it can't be done here
  private static _mapService: MapService;
  private static _routeService: RouteService;

  // periodically updated by the geoLocService 
  private static _currentPos: LatLng = new LatLng(0,0);
  private static _posMarker: Marker;

  private static readonly _geoLocService: GeoLocService = new GeoLocService();

  private static _prevTrip: Nullable<Trip>;
  private static _plannedTrip: Nullable<Trip>;

  static google: any;

// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX INIT XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

  // app 'constructor'
  static initialize(): void {

    console.log("called initialize");

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
      // fix this, but it's not a priority atm)
      App._mapService = new MapService();
      App._routeService = new RouteService(App.onRouteFetchSuccess, App.onRouteFetchFailure);

      App._speed = App.DEFAULT_SPEED;

      App._plannedTrip = null;
      App._prevTrip = null;
    
      App._posMarker = new Marker(App._mapService.map, App._currentPos, "", false);
      App._posMarker.setIcon(Marker.POS_MARKER_URL); 

      App._travelMode = App.TravelMode.BICYCLING;

      UIBuilder.buildUI();

      App._geoLocService.start();
    }); // GoogleMapsLoader.load
  } // _init

  // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX API QUERY RESPONSES XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

  static onRouteFetchSuccess(fetchResult: google.maps.DirectionsResult, successfulTrip: Trip): void {

    if (App.hasVisualTrip) {

      App.mapService.clearTripFromMap(); // clear the old polyline and markers from the map
    }

    // it always has a valid destCoord, since the fetch was successful
    const visualTrip = new VisualTrip(fetchResult, successfulTrip.destCoord!, successfulTrip.getAllWayPointCoords());
    
    App.prevTrip = successfulTrip.copy(); // save the trip in case the next one is unsuccessful
    // App.plannedTrip = successfulTrip; // should be unnecessary, as it is already the same trip
    App.mapService.renderTripOnMap(visualTrip);

    // this happens internally in VisualTrip as well, when it stores the distance,
    // but it's more clear to do it explicitly here.
    const route: google.maps.DirectionsRoute = fetchResult.routes[0];
    const dist: number = Utils.distanceInKm(route);

    // the trip duration can always be calculated based on the stored distance and current speed values. 
    // because the speed can be changed at any time (via the speed input), and VisualTrip is meant to 
    // contain only fresh data, the duration should never be stored directly in VisualTrip.
    const dura: number = Utils.calcDuration(dist, App.speed);

    InfoHeader.updateDistance(dist);
    InfoHeader.updateDuration(dura);
  } // onRouteFetchSuccess

  // usually occurs when clicking on water, mountains, etc
  static onRouteFetchFailure(): void {

    if (App.prevTrip === null) return;
    // restore a successful trip (in most situations; failure is harmless though)
    App.plannedTrip = App.prevTrip.copy();

    App.routeService.fetchRoute(App.plannedTrip); // we need to re-fetch because otherwise dragging the dest marker over water will leave it there
  }

  // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX UI ACTION RESPONSES XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

  // -------------------------------- MAP TAPS & DRAGS -------------------------------------------------------------------

  static onGoogleMapLongPress(event: any): void {

    // lots of exclamation marks here! if we have a visualTrip, 
    // we also have a plannedTrip; if we don't, it will be created
    // by this very method. so, there should be no problem, but a neater
    // way to do things should eventually be found.

    if (App.hasVisualTrip) {

      App.prevTrip = App.plannedTrip!.copy();
    }

    const destCoord: LatLng = Utils.latLngFromClickEvent(event);

    if (App.hasVisualTrip) {

      App.plannedTrip!.destCoord = destCoord;
    } else { // on first click, or when the map has been cleared

      App.plannedTrip = Trip.makeTrip(destCoord);
    }

    App.routeService.fetchRoute(App.plannedTrip!);
  } // onGoogleMapLongPress

  static onGoogleMapDoubleClick(event: any): void {

    // waypoints cannot be added without a valid destination
    if (!App.hasVisualTrip) return;

    const clickedPos = Utils.latLngFromClickEvent(event);
    App.plannedTrip!.addWayPointObject(clickedPos);
    App.routeService.fetchRoute(App.plannedTrip!);
  }

  static onDestMarkerDragEnd(event: any): void {

    App.plannedTrip!.destCoord = Utils.latLngFromClickEvent(event);
    App.routeService.fetchRoute(App.plannedTrip!);

    App.mapService.markerDragEventJustStopped = true; // needed in order not to tangle the logic with that of a long press

    setTimeout(() => {

      App.mapService.markerDragEventJustStopped = false;
    }, MapService.MARKER_DRAG_TIMEOUT);
  } // onDestMarkerDragEnd

  static onDestMarkerTap(event: any): void {
    
    console.log("tap event: " + JSON.stringify(event));
    // TODO: open an info window with place info
  }

  static onWayPointMarkerDragEnd(event: any): void {

    const latLng = Utils.latLngFromClickEvent(event);
    App.plannedTrip!.updateWayPointObject(event.wpIndex, latLng);

    App.routeService.fetchRoute(App.plannedTrip!);

    App.mapService.markerDragEventJustStopped = true; // needed in order not to tangle the logic with that of a long press

    setTimeout(() => {

      App.mapService.markerDragEventJustStopped = false;
    }, MapService.MARKER_DRAG_TIMEOUT);
  } // onWayPointMarkerDragEnd

  static onWayPointMarkerDblClick(event: any): void {

    App.plannedTrip!.removeWayPointObject(event.wpIndex);
    App.routeService.fetchRoute(App.plannedTrip!);
  }

  // -------------------------------- OVERLAY UI CLICKS ---------------------------------------------------------------

  static onLocButtonClick(): void {

    App.mapService.reCenter(App.currentPos);
  }

  static onClearButtonClick(): void {

    if (!App.hasVisualTrip) return;

    if (App.prevTrip) {

      App.prevTrip.clear();
    }
    App.prevTrip = null;
    App.plannedTrip!.clear(); // if there is a visualTrip, it exists
    App.plannedTrip = null;
    App.mapService.clearTripFromMap();
    InfoHeader.reset();
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

    App.travelMode = event.target.value; 
  }

  // -------------------------------- GEOLOC --------------------------------------------------------------------------

  // called by GeoLocService each time it gets a new location
  static onGeoLocSuccess(oldCoord: LatLng, newCoord: LatLng): void {

    App.posMarker.clearFromMap();
    App.currentPos = newCoord;
    App.posMarker.moveTo(newCoord);

    // make the camera follow the user when moving rapidly enough
    if (GeoLocService.diffIsOverCameraMoveThreshold(oldCoord, newCoord)) {

      App.mapService.reCenter(newCoord); 
    }
  } // onGeoLocSuccess

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

  static get hasVisualTrip(): boolean {

    return App.mapService.visualTrip !== null;
  }

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
  }

  static get mapService(): MapService {

    return App._mapService;
  }

  static get routeService(): RouteService {

    return App._routeService;
  }

  static get speed(): number {

    return App._speed;
  }

  static set speed(newSpeed: number) {

    App._speed = newSpeed;
  }

  static get travelMode(): TravelMode {

    return App._travelMode;
  }

  static set travelMode(newMode: TravelMode) {

    App._travelMode = newMode;
  }

  static get posMarker(): Marker {

    return App._posMarker;
  }

} // App

App.initialize();