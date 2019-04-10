import LatLng from './dataclasses/latng';
import VisualTrip from './dataclasses/visual-trip';

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

// app needs to be globally accessible (otherwise I'd have to pass it to almost everything, which is pointless & hopelessly wordy),
// so I'm making most things in it static.
class App {

  static mapService: MapService = new MapService();
  static geoLocService: GeoLocService = new GeoLocService();
  static routeService: RouteService = new RouteService(App.onRouteFetchSuccess, App.onRouteFetchFailure);
  static google: any | null; // I'm not sure if this is even needed. the loader loads the API and the types
  // ensure that the correct calls can be made without typescript complaining about them.

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

      App.geoLocService.start();
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

  onGoogleMapLongPress(event: google.maps.MouseEvent) {

    App.routeService.updateDestination(event);
    App.routeService.fetchRoute();
  }

  onGoogleMapDoubleClick(event: google.maps.MouseEvent) {

    // waypoints cannot be added without a valid destination
    if (App.mapService.noVisualTrip) return;

    App.routeService.addWayPoint(event);
    App.routeService.fetchRoute();
  }

  onDestMarkerDragEnd(event: google.maps.MouseEvent) {

    App.routeService.updateDestination(event);
    App.routeService.fetchRoute();

    App.mapService.markerDragEventJustStopped = true; // needed in order not to tangle the logic with that of a long press

    setTimeout(() => {

      App.mapService.markerDragEventJustStopped = false;
    }, MapService.MARKER_DRAG_TIMEOUT);
  } // onDestMarkerDragEnd

  onDestMarkerTap(event) {
    
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

  onCyclingLayerToggleButtonClick(event) {

    App.mapService.toggleBikeLayer(event);
  }

  onTravelModeToggleButtonClick(event) {

    App.routeService.plannedTrip.travelMode = event.target.value; 
  }

  // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX LIFECYCLE METHODS XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

  private static onDeviceReady() {

    App.receivedEvent('deviceready');

    document.addEventListener("pause", App.onPause, false);
    document.addEventListener("resume", App.onResume, false);

    App.initServices();
  } // onDeviceReady

  private static onPause() {

    App.geoLocService.stop();
  }

  private static onResume() {
    
    App.geoLocService.start();
  }

  // Update DOM on a received event
  private static receivedEvent(id: string) {

    // console.log('Received Event: ' + id);
  } // _receivedEvent

} // App

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

}; // App

App.initialize();