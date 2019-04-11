import Marker from './dataclasses/marker';
import { Nullable } from './misc/types';
import { Trip, TripOptions } from './dataclasses/trip';
import LatLng from './dataclasses/latng';
import VisualTrip from './dataclasses/visual-trip';
import GeoLocService from './services/geoloc-service';
import RouteService from './services/route-service';
import Utils from './misc/utils';

// not needed atm it seems.
// to be able to use the google maps types in typescript
// /// <reference path="google.d.ts"/>
// import * as whatever from 'google.maps'; // it doesn't work because the actual google maps api file is dl'ded from the net (I guess)

/**
 * Overall holder/central hub for the app, containing the responses to ui actions and route fetches.
 * @author Ville Lohkovuori (2019)
 */

// to be able to use the IIFE-enabled thingy... I'm sure there's a more proper way to do this, but it works for now.
declare const GoogleMapsLoader: any;

enum TravelMode {

  WALK = 'WALKING',
  CYCLE = 'BICYCLING'
}

// app needs to be globally accessible (otherwise I'd have to pass it to almost everything, which is pointless & hopelessly wordy),
// so I'm making most things in it static.
export default class App {

  static get MAX_SPEED() { return 50; } // km/h  
  static get DEFAULT_SPEED() { return 15; } // km/h

  // speed and travel mode are not parts of Trip because they exist regardless if there's a current trip or not
  private static _speed: number; // km/h
  private static _travelMode: TravelMode; // BICYCLING / WALKING

  static readonly TravelMode = TravelMode;

  private static readonly _mapService: MapService = new MapService();
  private static readonly _routeService: RouteService = new RouteService(App.onRouteFetchSuccess, App.onRouteFetchFailure);

  // periodically updated by the geoLocService 
  private static _currentPos: LatLng = new LatLng(0,0);
  private static _posMarker: Marker = new Marker(App._mapService.map, App._currentPos, "", false);

  private static readonly _geoLocService: GeoLocService = new GeoLocService();

  private static _prevTrip: Trip;
  private static _currentTrip: Trip;

  static google: any | null; // I'm not sure if this is even needed. the loader loads the API and the types
  // ensure that the correct calls can be made without typescript complaining about them.

  // _currentTrip should never be null (even though many of its members may be)
  private static readonly _DEFAULT_TRIP_OPTIONS: TripOptions = {

    map: App._mapService.map,
    startCoord: new LatLng(0,0),
    destCoord: null
  };
  private static readonly _DEFAULT_TRIP = new Trip(App._DEFAULT_TRIP_OPTIONS);

// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX INIT XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

  // app 'constructor'
  static initialize() {

    document.addEventListener('deviceready', App.onDeviceReady.bind(this), false);
  }

  // called down below in onDeviceReady
  private static initServices() {

    GoogleMapsLoader.KEY = Env.API_KEY;
    GoogleMapsLoader.LANGUAGE = 'en';
    GoogleMapsLoader.LIBRARIES = ['geometry', 'places'];

    GoogleMapsLoader.load(function(google: any) {

      // may be unnecessary
      App.google = google;

      UI.init();

      App._currentTrip = App._DEFAULT_TRIP;
      App._prevTrip = App._currentTrip.copy(); // weird, but we need it to exist

      App._geoLocService.start();
    }); // GoogleMapsLoader.load
  } // _initServices

  // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX API QUERY RESPONSES XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

  // 'slimming down' this method is an enticing proposition, but otoh it shows very clearly what's going on
  static onRouteFetchSuccess(fetchResult: google.maps.DirectionsResult, successfulPlannedTrip: PlannedTrip) {

    App.routeService.prevPlannedTrip = successfulPlannedTrip.copy(); // save the trip in case the next one is unsuccessful

    App.mapService.deleteVisualTrip(); // clears the old polyline and markers from the map (if they exist)
    
    const route = fetchResult.routes[0];

    const dist: number = Utils.distanceInKm(route);
    const dura: number = Utils.calcDuration(dist, successfulPlannedTrip.speed);

    const destCoords: LatLng = successfulPlannedTrip.destCoords;
    const wayPointCoords: Array<LatLng> = successfulPlannedTrip.getAllWayPointCoords();

    const tripToDisplay = new VisualTrip(fetchResult, destCoords, wayPointCoords, dist, dura);

    App.mapService.visualTrip = tripToDisplay; // maybe its state should be kept in App instead?
    App.mapService.showVisualTripOnMap(); // shows the destination and waypoint markers and the polyline

    // I'm not sure if this is the best location for this operation... tbd.
    InfoHeader.updateDistance(dist);
    InfoHeader.updateDuration(dura);
  } // onRouteFetchSuccess

  // usually occurs when clicking on water, mountains, etc
  static onRouteFetchFailure() {

    // restore a successful trip (in most situations; failure is harmless though)
    App.routeService.plannedTrip = App.routeService.prevPlannedTrip.copy(); 

    App.routeService.fetchRoute(); // we need to re-fetch because otherwise dragging the dest marker over water will leave it there
  }


  // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX UI ACTION RESPONSES XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

  // -------------------------------- MAP TAPS & DRAGS -------------------------------------------------------------------

  static onGoogleMapLongPress(event: google.maps.MouseEvent) {

    const destCoord: LatLng = Utils.latLngFromClickEvent(event);

    // on first click, or when the map has been cleared
    if (App.noCurrentTrip) {

      App.currentTrip = Trip.makeTrip(destCoord);
    } else {

      App.currentTrip.destCoord = destCoord;
    }

    App.routeService.fetchRoute(App.currentTrip);
  } // onGoogleMapLongPress

  onGoogleMapDoubleClick(event: google.maps.MouseEvent) {

    // waypoints cannot be added without a valid destination
    if (App.mapService.noVisualTrip) return;

    App.routeService.addWayPoint(event);
    App.routeService.fetchRoute();
  }

  static onDestMarkerDragEnd(event: google.maps.MouseEvent) {

    App.routeService.updateDestination(event);
    App.routeService.fetchRoute();

    App.mapService.markerDragEventJustStopped = true; // needed in order not to tangle the logic with that of a long press

    setTimeout(() => {

      App.mapService.markerDragEventJustStopped = false;
    }, MapService.MARKER_DRAG_TIMEOUT);
  } // onDestMarkerDragEnd

  static onDestMarkerTap(event) {
    
    console.log("tap event: " + JSON.stringify(event));
    // TODO: open an info window with place info
  }

  onWayPointMarkerDragEnd(event) {

    App.routeService.updateWayPoint(event);
    App.routeService.fetchRoute();

    App.mapService.markerDragEventJustStopped = true; // needed in order not to tangle the logic with that of a long press

    setTimeout(() => {

      App.mapService.markerDragEventJustStopped = false;
    }, MapService.MARKER_DRAG_TIMEOUT);
  } // onWayPointMarkerDragEnd

  onWayPointDblClick(event) {

    App.routeService.deleteWayPoint(event);
    App.routeService.fetchRoute();
  }

  // -------------------------------- OVERLAY UI CLICKS ---------------------------------------------------------------

  onLocButtonClick() {

    App.mapService.reCenter(App.routeService.plannedTrip.getPosCoords());
  }

  onClearButtonClick() {

    if (App.mapService.noVisualTrip) return;

    App.mapService.fullClear();
  }

  // toggles the right-hand corner menu
  onMenuButtonClick(event) {

    Menu.toggleVisibility(event);
  }

  onMapStyleToggleButtonClick(event) {
    
    const textHolderDiv = event.target;
    const value = textHolderDiv.innerText; // supposedly expensive... but .textContent refuses to work with the switch, even though the type is string!
  
    switch (value) {
      case MapStyleToggleButton.NORMAL_TXT:
        
        App.mapService.map.setMapTypeId(App.google.maps.MapTypeId.ROADMAP);
        break;
      case MapStyleToggleButton.SAT_TXT:
        
        App.mapService.map.setMapTypeId(App.google.maps.MapTypeId.HYBRID);
        break;
      case MapStyleToggleButton.TERRAIN_TXT:
        
        App.mapService.map.setMapTypeId(App.google.maps.MapTypeId.TERRAIN);
        break;
      default:

        console.log("something is badly wrong with map style toggle clicks...");
        console.log("text value in default statement: " + value);
        break;
    } // switch
  } // onMapStyleToggleButtonClick

  onCyclingLayerToggleButtonClick(event: any) {

    App._mapService.toggleBikeLayer(event);
  }

  onTravelModeToggleButtonClick(event: any) {

    App._routeService.plannedTrip.travelMode = event.target.value; 
  }

  // -------------------------------- GEOLOC --------------------------------------------------------------------------

  // called by GeoLocService each time it gets a new location
  static onGeoLocSuccess(newPos: LatLng) {

    App._currentPos = newPos;
    App._posMarker.moveTo(newPos);
  }

  // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX LIFECYCLE METHODS XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

  private static onDeviceReady() {

    App._receivedEvent('deviceready');

    document.addEventListener("pause", App._onPause, false);
    document.addEventListener("resume", App._onResume, false);

    App.initServices();
  } // onDeviceReady

  private static _onPause() {

    App._geoLocService.stop();
  }

  private static _onResume() {
    
    App._geoLocService.start();
  }

  // Update DOM on a received event
  private static _receivedEvent(id: string) {

    // console.log('Received Event: ' + id);
  } // _receivedEvent

    // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX GETTERS & SETTERS XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

  static get currentPos(): LatLng {

    return App._currentPos;
  }

  static set currentPos(newPos: LatLng) {

    App._currentPos = newPos;
  }

  static get currentTrip(): Trip {

    return App._currentTrip;
  }

  static set currentTrip(newTrip: Trip) {

    App._currentTrip = newTrip;
  }

  static get prevTrip(): Trip {

    return App._prevTrip;
  }

  static set prevTrip(newTrip: Trip) {

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

  static get noCurrentTrip() {

    return App._currentTrip === null;
  }

} // App














/*

const App2 = {

  // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX INIT XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

  google: null,
  geoLocService: null,
  mapService: null,
  routeService: null,

  // Application Constructor
  _initialize: function() {

    document.addEventListener('deviceready', this._onDeviceReady.bind(this), false);
  },

  // called down below in _onDeviceReady
  _initServices: function() {

    GoogleMapsLoader.KEY = Env.API_KEY;
    GoogleMapsLoader.LANGUAGE = 'en';
    GoogleMapsLoader.LIBRARIES = ['geometry', 'places'];

    GoogleMapsLoader.load(google => {

      this.google = google;

      this.mapService = new MapService(); // must be done before setting up other services
      
      this.routeService = new RouteService(this.onRouteFetchSuccess, this.onRouteFetchFailure);
      
      UI.init();

      this.geoLocService = new GeoLocService();
      this.geoLocService.start();
    }); // GoogleMapsLoader.load
  }, // _initServices

  // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX API QUERY RESPONSES XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

  // 'slimming down' this method is an enticing proposition, but otoh it shows very clearly what's going on
  onRouteFetchSuccess: (fetchResult, successfulPlannedTrip) => {

    App.routeService.prevPlannedTrip = successfulPlannedTrip.copy(); // save the trip in case the next one is unsuccessful

    App.mapService.deleteVisualTrip(); // clears the old polyline and markers from the map (if they exist)
    
    const route = fetchResult.routes[0];

    const dist = Utils.distanceInKm(route);
    const dura = Utils.calcDuration(dist, successfulPlannedTrip.speed);

    const destCoords = successfulPlannedTrip.destCoords;
    const wayPointCoords = successfulPlannedTrip.getAllWayPointCoords();

    const tripToDisplay = new VisualTrip(fetchResult, destCoords, wayPointCoords, dist, dura);

    App.mapService.visualTrip = tripToDisplay; // maybe its state should be kept in App instead?
    App.mapService.showVisualTripOnMap(); // shows the destination and waypoint markers and the polyline

    // I'm not sure if this is the best location for this operation... tbd.
    InfoHeader.updateDistance(dist);
    InfoHeader.updateDuration(dura);
  }, // onRouteFetchSuccess

  // usually occurs when clicking on water, mountains, etc
  onRouteFetchFailure: () => {

    App.routeService.plannedTrip = App.routeService.prevPlannedTrip.copy(); // restore a successful trip (in most situations; failure is harmless though)

    App.routeService.fetchRoute(); // we need to re-fetch because otherwise dragging the dest marker over water will leave it there
  },

  // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX UI ACTION RESPONSES XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

  // -------------------------------- MAP TAPS & DRAGS -------------------------------------------------------------------

  onGoogleMapLongPress: (event) => {

    App.routeService.updateDestination(event);
    App.routeService.fetchRoute();
  },

  onGoogleMapDoubleClick: (event) => {

    // waypoints cannot be added without a valid destination
    if (App.mapService.noVisualTrip) return;

    App.routeService.addWayPoint(event);
    App.routeService.fetchRoute();
  },

  onDestMarkerDragEnd: (event) => {

    App.routeService.updateDestination(event);
    App.routeService.fetchRoute();

    App.mapService.markerDragEventJustStopped = true; // needed in order not to tangle the logic with that of a long press

    setTimeout(() => {

      App.mapService.markerDragEventJustStopped = false;
    }, MapService.MARKER_DRAG_TIMEOUT);
  }, // onDestMarkerDragEnd

  onDestMarkerTap: (event) => {
    
    console.log("tap event: " + JSON.stringify(event));
    // TODO: open an info window with place info
  },

  onWayPointMarkerDragEnd: (event) => {

    App.routeService.updateWayPoint(event);
    App.routeService.fetchRoute();

    App.mapService.markerDragEventJustStopped = true; // needed in order not to tangle the logic with that of a long press

    setTimeout(() => {

      App.mapService.markerDragEventJustStopped = false;
    }, MapService.MARKER_DRAG_TIMEOUT);
  }, // onWayPointMarkerDragEnd

  onWayPointDblClick: (event) => {

    App.routeService.deleteWayPoint(event);
    App.routeService.fetchRoute();
  },

  // -------------------------------- OVERLAY UI CLICKS ---------------------------------------------------------------

  onLocButtonClick: () => {

    App.mapService.reCenter(App.routeService.plannedTrip.getPosCoords());
  },

  onClearButtonClick: () => {

    if (App.mapService.noVisualTrip) return;

    App.mapService.fullClear();
  },

  // toggles the right-hand corner menu
  onMenuButtonClick: (event) => {

    Menu.toggleVisibility(event);
  },

  onMapStyleToggleButtonClick: (event) => {
    
    const textHolderDiv = event.target;
    const value = textHolderDiv.innerText; // supposedly expensive... but .textContent refuses to work with the switch, even though the type is string!
  
    switch (value) {
      case MapStyleToggleButton.NORMAL_TXT:
        
        App.mapService.map.setMapTypeId(App.google.maps.MapTypeId.ROADMAP);
        break;
      case MapStyleToggleButton.SAT_TXT:
        
        App.mapService.map.setMapTypeId(App.google.maps.MapTypeId.HYBRID);
        break;
      case MapStyleToggleButton.TERRAIN_TXT:
        
        App.mapService.map.setMapTypeId(App.google.maps.MapTypeId.TERRAIN);
        break;
      default:

        console.log("something is badly wrong with map style toggle clicks...");
        console.log("text value in default statement: " + value);
        break;
    } // switch
  }, // onMapStyleToggleButtonClick

  onCyclingLayerToggleButtonClick: (event) => {

    App.mapService.toggleBikeLayer(event);
  },

  onTravelModeToggleButtonClick: (event) => {

    App.routeService.plannedTrip.travelMode = event.target.value; 
  },

  // NOTE: the speed input contains its own onValueChange method (it should technically be here, but its so simple yet huge that I put it in speed-input.js)

  // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX LIFECYCLE METHODS XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

  _onDeviceReady: function() {

    this._receivedEvent('deviceready');

    document.addEventListener("pause", this._onPause, false);
    document.addEventListener("resume", this._onResume, false);

    this._initServices();
  }, // _onDeviceReady

  _onPause: function() {

    App.geoLocService.stop();
  },

  _onResume: function () {
    
    App.geoLocService.start();
  },

  // Update DOM on a received event
  _receivedEvent: function(id) {

    // console.log('Received Event: ' + id);
  } // _receivedEvent

}; // App2 */

App.initialize();