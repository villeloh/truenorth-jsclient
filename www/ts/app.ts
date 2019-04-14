import Marker from './dataclasses/marker';
import { Trip, TripOptions } from './dataclasses/trip';
import LatLng from './dataclasses/latlng';
import MapService from './services/map-service';
import GeoLocService from './services/geoloc-service';
import RouteService from './services/route-service';
import Utils from './misc/utils';
import Env from './misc/env';
import Menu from './components/menu'; // TODO: combine the UI elements in one module, in order to have a more concise import
import InfoHeader from './components/info-header';
import MapStyleToggleButton from './components/map-style-toggle-button';
import UI from './misc/ui';

// to be able to use the IIFE-enabled thingy... I'm sure there's a more proper way to do this, but it works for now.
declare const GoogleMapsLoader: any;

// not needed atm it seems.
// to be able to use the google maps types in typescript
// /// <reference path="google.d.ts"/>
// import * as whatever from 'google.maps'; // it doesn't work because the actual google maps api file is dl'ded from the net (I guess)

/**
 * Overall holder/central hub for the app, containing the responses to ui actions and route fetches.
 * @author Ville Lohkovuori (2019)
 */

// can't use the proper google types here, as the google object has yet to be initialized
enum TravelMode {

  WALKING = 'WALKING',
  BICYCLING = 'BICYCLING'
}

/*
// needed in order to make Cordova work.
const AppContainer = {

  // app 'constructor'
  initialize(): void {

    console.log("called initialize");

    document.addEventListener('deviceready', App.onDeviceReady.bind(App), false);
  }
};

window.onload = function () {
  
  AppContainer.initialize();
} */

// app needs to be globally accessible (otherwise I'd have to pass it to almost everything, which is pointless & hopelessly wordy),
// so I'm making all things in it static.
export default class App {

  static readonly MAX_SPEED = 50; // km/h  
  static readonly DEFAULT_SPEED = 15; // km/h

  static get TravelMode() {

    return TravelMode;
  }

  // speed and travel mode are not parts of Trip because they exist regardless if there's a current trip or not
  private static _speed: number; // km/h
  private static _travelMode: any; // BICYCLING / WALKING


  private static _mapService: MapService;
  private static _routeService: RouteService;

  // periodically updated by the geoLocService 
  private static _currentPos: LatLng = new LatLng(0,0);
  private static _posMarker: Marker;

  private static readonly _geoLocService: GeoLocService = new GeoLocService();

  private static _prevTrip: Trip;
  private static _currentTrip: Trip;

  static google: any; // I'm not sure if this is even needed. the loader loads the API and the global types
  // ensure that the correct calls can be made without typescript complaining about them.

// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX INIT XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX


  // app 'constructor'
  static initialize(): void {

    console.log("called initialize");

    document.addEventListener('deviceready', App.onDeviceReady.bind(App), false);
  }

  // called down below in onDeviceReady
  private static initServices(): void {

    console.log("called initServices");

    GoogleMapsLoader.KEY = Env.API_KEY;
    GoogleMapsLoader.LANGUAGE = 'en';
    GoogleMapsLoader.LIBRARIES = ['geometry', 'places'];

    GoogleMapsLoader.load(function(google: any) {

      App.google = google;

      // NOTE: the MapService needs to be created first, as a lot of other things depend on
      // the google map object within it already existing. (the map could be moved to App to 
      // fix this, but it's not a priority atm)
      App._mapService = new MapService();
      App._routeService = new RouteService(App.onRouteFetchSuccess, App.onRouteFetchFailure);

      App._speed = App.DEFAULT_SPEED;
        
      // _currentTrip should never be null (even though many of its members may be)
      const defaultTripOptions: TripOptions = {

        map: App._mapService.map, // this needs to be done here as we need the initialized google object for the map
        startCoord: new LatLng(0,0),
        destCoord: null,
        status: Trip.Status.SUCCEEDED
      };

      const defaultTrip = new Trip(defaultTripOptions);

      App._currentTrip = defaultTrip;
      App._prevTrip = App._currentTrip.copy(); // weird, but we need it to exist

    
      App._posMarker = new Marker(App._mapService.map, App._currentPos, "", false);
      App._posMarker.setIcon(Marker.POS_MARKER_URL); 

      App._travelMode = App.TravelMode.BICYCLING;

      UI.init();

      App._geoLocService.start();
    }); // GoogleMapsLoader.load
  } // _initServices

  // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX API QUERY RESPONSES XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

  static onRouteFetchSuccess(fetchResult: google.maps.DirectionsResult, successfulTrip: Trip): void {

    // if there is a previous trip to be cleared
    if (App.prevTrip.destCoord !== null) {

      App.currentTrip.clear(); // clear the old polyline and markers from the map (if they exist)
    }
    
    const route: google.maps.DirectionsRoute = fetchResult.routes[0];

    const dist: number = Utils.distanceInKm(route);
    const dura: number = Utils.calcDuration(dist, App.speed);

    successfulTrip.distance = dist;
    successfulTrip.duration = dura;
    successfulTrip.fetchResult = fetchResult;
    successfulTrip.status = Trip.Status.SHOWN;
    
    App.prevTrip = successfulTrip.copy(); // save the trip in case the next one is unsuccessful
    App.currentTrip = successfulTrip;
    App.currentTrip.showOnMap();

    InfoHeader.updateDistance(dist);
    InfoHeader.updateDuration(dura);
  } // onRouteFetchSuccess

  // usually occurs when clicking on water, mountains, etc
  static onRouteFetchFailure(): void {

    // restore a successful trip (in most situations; failure is harmless though)
    App.currentTrip = App.prevTrip.copy(); 

    App.routeService.fetchRoute(App.currentTrip); // we need to re-fetch because otherwise dragging the dest marker over water will leave it there
  }

  // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX UI ACTION RESPONSES XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

  // -------------------------------- MAP TAPS & DRAGS -------------------------------------------------------------------

  static onGoogleMapLongPress(event: any): void {

    if (App.currentTrip.status === Trip.Status.SUCCEEDED) {

      App.prevTrip = App.currentTrip.copy();
    }

    const destCoord: LatLng = Utils.latLngFromClickEvent(event);

    // on first click, or when the map has been cleared
    if (App.noCurrentDest) {

      App.currentTrip = Trip.makeTrip(destCoord);
    } else {

      App.currentTrip.destCoord = destCoord;
    }

    App.routeService.fetchRoute(App.currentTrip);
  } // onGoogleMapLongPress

  static onGoogleMapDoubleClick(event: any): void {

    // waypoints cannot be added without a valid destination
    if (App.noCurrentDest) return;

    const clickedPos = Utils.latLngFromClickEvent(event);
    App.currentTrip.addWayPointObject(clickedPos);
    App.routeService.fetchRoute(App.currentTrip);
  }

  static onDestMarkerDragEnd(event:any): void {

    App.currentTrip.destCoord = Utils.latLngFromClickEvent(event);
    App.routeService.fetchRoute(App.currentTrip);

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
    App.currentTrip.updateWayPointObject(event.wpIndex, latLng);

    App.routeService.fetchRoute(App.currentTrip);

    App.mapService.markerDragEventJustStopped = true; // needed in order not to tangle the logic with that of a long press

    setTimeout(() => {

      App.mapService.markerDragEventJustStopped = false;
    }, MapService.MARKER_DRAG_TIMEOUT);
  } // onWayPointMarkerDragEnd

  static onWayPointDblClick(event: any): void {

    App.currentTrip.removeWayPointObject(event.wpIndex);
    App.routeService.fetchRoute(App.currentTrip);
  }

  // -------------------------------- OVERLAY UI CLICKS ---------------------------------------------------------------

  static onLocButtonClick(): void {

    App.mapService.reCenter(App.currentPos);
  }

  static onClearButtonClick(): void {

    if (App.noCurrentDest) return;

    App.currentTrip.clear();
    InfoHeader.reset();
  }

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
  static onGeoLocSuccess(newPos: LatLng): void {

    App.prevTrip.startCoord = newPos;
    App.currentTrip.startCoord = newPos; // it needs to keep 'in sync' with the geoloc updates. reactive programming would be a big help here!

    App.posMarker.clearFromMap();
    App.currentPos = newPos; // currentPos may be useless rn, but it could be used if moving to MobX / RxJs
    App.posMarker.moveTo(newPos);
  }

  // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX LIFECYCLE METHODS XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

  static onDeviceReady(): void {

    App._receivedEvent('deviceready');

    document.addEventListener("pause", App._onPause, false);
    document.addEventListener("resume", App._onResume, false);

    App.initServices();
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

  static get travelMode(): google.maps.TravelMode {

    return App._travelMode;
  }

  static set travelMode(newMode: google.maps.TravelMode) {

    App._travelMode = newMode;
  }

  static get posMarker(): Marker {

    return App._posMarker;
  }

  static get noCurrentDest() {

    return App._currentTrip.destCoord === null;
  }

} // App

App.initialize();