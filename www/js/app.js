
/**
 * Overall holder for app initialization. GoogleMap.js is the real heart of the app.
 * @author Ville Lohkovuori (2019)
 */

const App = {

  google: null,
  geoLocService: null,
  mapService: null,

  // Application Constructor
  _initialize: function() {

    document.addEventListener('deviceready', this._onDeviceReady.bind(this), false);
  },

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

  // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX UI ACTION RESPONSES XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

  // ------------------------------------ MAP TAPS -----------------------------------------------------------------------

  onGoogleMapLongPress = (event) => {

    this.routeService.updateDestination(event);

    this.routeService.fetch();
  },

  onGoogleMapDoubleClick = (event) => {

    // waypoints cannot be added without a valid destination
    if (this.mapService.noVisualTrip) return;

    this.routeService.addWayPoint(event);
    this.routeService.fetch();
  },

  onRouteFetchSuccess = (fetchResult, successfulPlannedTrip) => {

    this.routeService.prevPlannedTrip = successfulPlannedTrip.copy(); // save the trip in case the next one is unsuccessful

    App.mapService.deleteVisualTrip();

    App.mapService.renderOnMap(fetchResult);
    
    const route = fetchResult.routes[0];

    const dist = Utils.distanceInKm(route);
    const dura = Utils.calcDuration(dist, successfulPlannedTrip.speed);

    const destCoords = successfulPlannedTrip.destCoords;
    const wayPointCoords = successfulPlannedTrip.getAllWayPointCoords();

    const tripToDisplay = new VisualTrip(this.mapService, destCoords, wayPointCoords, dist, dura);

    this.mapService.visualTrip = tripToDisplay;
    this.mapService.visualTrip.displayOnMap(this.mapService.map);

    InfoHeader.updateDistance(dist);
    InfoHeader.updateDuration(dura);
  }, // onRouteFetchSuccess

  // usually occurs when clicking on water, mountains, etc
  onRouteFetchFailure = () => {

    this.routeService.plannedTrip = this.routeService.prevPlannedTrip.copy(); // restore a successful trip

    App.routeService.fetch(); // we need to re-fetch because otherwise dragging the dest marker over water will leave it there
  },

  onMapStyleToggleButtonClick = (event) => {
    
    const textHolderDiv = event.target;
    const value = textHolderDiv.innerText; // supposedly expensive... but .textContent refuses to work with the switch, even though the type is string!
  
    switch (value) {
      case MapStyleToggleButton.NORMAL_TXT:
        
        this.mapService.map.setMapTypeId(App.google.maps.MapTypeId.ROADMAP);
        break;
      case MapStyleToggleButton.SAT_TXT:
        
        this.mapService.map.setMapTypeId(App.google.maps.MapTypeId.HYBRID);
        break;
      case MapStyleToggleButton.TERRAIN_TXT:
        
        this.mapService.map.setMapTypeId(App.google.maps.MapTypeId.TERRAIN);
        break;
      default:

        console.log("something is badly wrong with map style toggle clicks...");
        console.log("text value in default statement: " + value);
        break;
    } // switch
  }, // onMapStyleToggleButtonClick

  onLocButtonClick = () => {

    this.mapService.reCenter(this.routeService.plannedTrip.getPosCoords());
  },

  onTravelModeToggleButtonClick = (event) => {

    this.routeService.plannedTrip.travelMode = event.target.value; 
  },

  onCyclingLayerToggleButtonClick = (event) => {

    this.mapService.toggleBikeLayer(event);
  },

  // toggles the right-hand corner menu
  onMenuButtonClick = (event) => {

    Menu.toggleVisibility(event);
  },

    
  onWayPointDblClick = (event) => {

    this.routeService.deleteWayPoint(event);
    this.routeService.fetch();
  },

  onDestMarkerDragEnd = (event) => {

    this.routeService.updateDestination(event);

    this.routeService.fetch();

    this.mapService.markerDragEventJustStopped = true; // needed in order not to tangle the logic with that of a long press

    setTimeout(() => {

      this.mapService.markerDragEventJustStopped = false;
    }, MapService.MARKER_DRAG_TIMEOUT);
  }, // onDestMarkerDragEnd

  onDestMarkerTap = (event) => {
    
    console.log("tap event: " + JSON.stringify(event));
    // TODO: open an info window with place info
  },

  onClearButtonClick = () => {

    if (this.mapService.noVisualTrip) return;

    this.mapService.fullClear();
  },
  
  onWayPointMarkerDragEnd = (event) => {

    this.routeService.updateWayPoint(event);
    this.routeService.fetch();

    this.mapService.markerDragEventJustStopped = true; // needed in order not to tangle the logic with that of a long press

    setTimeout(() => {

      this.markerDragEventJustStopped = false;
    }, MapService.MARKER_DRAG_TIMEOUT);
  }, // onWayPointMarkerDragEnd

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

App._initialize();