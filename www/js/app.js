
/**
 * Overall holder/central hub for app, containing the responses to ui actions and route fetches.
 * @author Ville Lohkovuori (2019)
 */

const App = {

  // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX INIT XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

  google: null,
  geoLocService: null,
  mapService: null,

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

    App.mapService.visualTrip = tripToDisplay;
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

  // here, 'this' works correctly... go figure.
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

App._initialize();