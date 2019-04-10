/**
 * Overall holder/central hub for app, containing the responses to ui actions and route fetches.
 * @author Ville Lohkovuori (2019)
 */
var App = {
    // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX INIT XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
    google: null,
    geoLocService: null,
    mapService: null,
    routeService: null,
    // Application Constructor
    _initialize: function () {
        document.addEventListener('deviceready', this._onDeviceReady.bind(this), false);
    },
    // called down below in _onDeviceReady
    _initServices: function () {
        var _this = this;
        GoogleMapsLoader.KEY = Env.API_KEY;
        GoogleMapsLoader.LANGUAGE = 'en';
        GoogleMapsLoader.LIBRARIES = ['geometry', 'places'];
        GoogleMapsLoader.load(function (google) {
            _this.google = google;
            _this.mapService = new MapService(); // must be done before setting up other services
            _this.routeService = new RouteService(_this.onRouteFetchSuccess, _this.onRouteFetchFailure);
            UI.init();
            _this.geoLocService = new GeoLocService();
            _this.geoLocService.start();
        }); // GoogleMapsLoader.load
    },
    // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX API QUERY RESPONSES XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
    // 'slimming down' this method is an enticing proposition, but otoh it shows very clearly what's going on
    onRouteFetchSuccess: function (fetchResult, successfulPlannedTrip) {
        App.routeService.prevPlannedTrip = successfulPlannedTrip.copy(); // save the trip in case the next one is unsuccessful
        App.mapService.deleteVisualTrip(); // clears the old polyline and markers from the map (if they exist)
        var route = fetchResult.routes[0];
        var dist = Utils.distanceInKm(route);
        var dura = Utils.calcDuration(dist, successfulPlannedTrip.speed);
        var destCoords = successfulPlannedTrip.destCoords;
        var wayPointCoords = successfulPlannedTrip.getAllWayPointCoords();
        var tripToDisplay = new VisualTrip(fetchResult, destCoords, wayPointCoords, dist, dura);
        App.mapService.visualTrip = tripToDisplay; // maybe its state should be kept in App instead?
        App.mapService.showVisualTripOnMap(); // shows the destination and waypoint markers and the polyline
        // I'm not sure if this is the best location for this operation... tbd.
        InfoHeader.updateDistance(dist);
        InfoHeader.updateDuration(dura);
    },
    // usually occurs when clicking on water, mountains, etc
    onRouteFetchFailure: function () {
        App.routeService.plannedTrip = App.routeService.prevPlannedTrip.copy(); // restore a successful trip (in most situations; failure is harmless though)
        App.routeService.fetchRoute(); // we need to re-fetch because otherwise dragging the dest marker over water will leave it there
    },
    // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX UI ACTION RESPONSES XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
    // -------------------------------- MAP TAPS & DRAGS -------------------------------------------------------------------
    onGoogleMapLongPress: function (event) {
        App.routeService.updateDestination(event);
        App.routeService.fetchRoute();
    },
    onGoogleMapDoubleClick: function (event) {
        // waypoints cannot be added without a valid destination
        if (App.mapService.noVisualTrip)
            return;
        App.routeService.addWayPoint(event);
        App.routeService.fetchRoute();
    },
    onDestMarkerDragEnd: function (event) {
        App.routeService.updateDestination(event);
        App.routeService.fetchRoute();
        App.mapService.markerDragEventJustStopped = true; // needed in order not to tangle the logic with that of a long press
        setTimeout(function () {
            App.mapService.markerDragEventJustStopped = false;
        }, MapService.MARKER_DRAG_TIMEOUT);
    },
    onDestMarkerTap: function (event) {
        console.log("tap event: " + JSON.stringify(event));
        // TODO: open an info window with place info
    },
    onWayPointMarkerDragEnd: function (event) {
        App.routeService.updateWayPoint(event);
        App.routeService.fetchRoute();
        App.mapService.markerDragEventJustStopped = true; // needed in order not to tangle the logic with that of a long press
        setTimeout(function () {
            App.mapService.markerDragEventJustStopped = false;
        }, MapService.MARKER_DRAG_TIMEOUT);
    },
    onWayPointDblClick: function (event) {
        App.routeService.deleteWayPoint(event);
        App.routeService.fetchRoute();
    },
    // -------------------------------- OVERLAY UI CLICKS ---------------------------------------------------------------
    onLocButtonClick: function () {
        App.mapService.reCenter(App.routeService.plannedTrip.getPosCoords());
    },
    onClearButtonClick: function () {
        if (App.mapService.noVisualTrip)
            return;
        App.mapService.fullClear();
    },
    // toggles the right-hand corner menu
    onMenuButtonClick: function (event) {
        Menu.toggleVisibility(event);
    },
    onMapStyleToggleButtonClick: function (event) {
        var textHolderDiv = event.target;
        var value = textHolderDiv.innerText; // supposedly expensive... but .textContent refuses to work with the switch, even though the type is string!
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
    },
    onCyclingLayerToggleButtonClick: function (event) {
        App.mapService.toggleBikeLayer(event);
    },
    onTravelModeToggleButtonClick: function (event) {
        App.routeService.plannedTrip.travelMode = event.target.value;
    },
    // NOTE: the speed input contains its own onValueChange method (it should technically be here, but its so simple yet huge that I put it in speed-input.js)
    // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX LIFECYCLE METHODS XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
    _onDeviceReady: function () {
        this._receivedEvent('deviceready');
        document.addEventListener("pause", this._onPause, false);
        document.addEventListener("resume", this._onResume, false);
        this._initServices();
    },
    _onPause: function () {
        App.geoLocService.stop();
    },
    _onResume: function () {
        App.geoLocService.start();
    },
    // Update DOM on a received event
    _receivedEvent: function (id) {
        // console.log('Received Event: ' + id);
    } // _receivedEvent
}; // App
App._initialize();
