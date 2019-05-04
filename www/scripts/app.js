define(["require", "exports", "./dataclasses/marker", "./dataclasses/trip", "./dataclasses/latlng", "./services/map-service", "./services/geoloc-service", "./services/route-service", "./misc/utils", "./misc/env", "./components/components", "./misc/ui-builder", "./dataclasses/visual-trip", "./services/elevation-service", "./misc/click-handler"], function (require, exports, marker_1, trip_1, latlng_1, map_service_1, geoloc_service_1, route_service_1, utils_1, env_1, components_1, ui_builder_1, visual_trip_1, elevation_service_1, click_handler_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var TravelMode;
    (function (TravelMode) {
        TravelMode["WALKING"] = "WALKING";
        TravelMode["BICYCLING"] = "BICYCLING";
    })(TravelMode || (TravelMode = {}));
    class App {
        static get TravelMode() {
            return TravelMode;
        }
        static initialize() {
            document.addEventListener('deviceready', App._onDeviceReady.bind(App), false);
        }
        static _init() {
            GoogleMapsLoader.KEY = env_1.default.API_KEY;
            GoogleMapsLoader.LANGUAGE = 'en';
            GoogleMapsLoader.LIBRARIES = ['geometry', 'places'];
            GoogleMapsLoader.load(function (google) {
                App.google = google;
                App._mapService = new map_service_1.default();
                App._routeService = new route_service_1.default(App.onRouteFetchSuccess, App.onRouteFetchFailure);
                App._elevationService = new elevation_service_1.default(App.onElevationFetchSuccess, App.onElevationFetchFailure);
                App._speed = App.DEFAULT_SPEED;
                App._plannedTrip = null;
                App._prevTrip = null;
                App._posMarker = marker_1.default.makePosMarker(App._mapService.map, App._currentPos);
                App._travelMode = App.TravelMode.BICYCLING;
                ui_builder_1.default.buildUI();
                App._geoLocService.start();
            });
        }
        static onRouteFetchSuccess(fetchResult, successfulTrip) {
            if (App.hasVisualTrip) {
                App.mapService.clearTripFromMap();
            }
            const visualTrip = new visual_trip_1.default(fetchResult, successfulTrip.destCoord, successfulTrip.getAllWayPointCoords());
            const route = fetchResult.routes[0];
            App._elevationService.fetchElevations(visualTrip);
            App.prevTrip = successfulTrip.copy();
            const dist = utils_1.default.distanceInKm(route);
            const dura = utils_1.default.duraInDecimHours(dist, App.speed);
            components_1.InfoHeader.updateDistance(dist);
            components_1.InfoHeader.updateDuration(dura);
        }
        static onRouteFetchFailure() {
            if (App.prevTrip === null)
                return;
            App.plannedTrip = App.prevTrip.copy();
            App.routeService.fetchRoute(App.plannedTrip);
        }
        static onElevationFetchSuccess(visualTrip, resultsArray) {
            const elevations = resultsArray.map(result => { return result.elevation; });
            App.mapService.renderTripOnMap(visualTrip, elevations);
        }
        static onElevationFetchFailure() {
        }
        static onGoogleMapLongPress(event) {
            if (App.hasVisualTrip) {
                App.prevTrip = App.plannedTrip.copy();
            }
            const destCoord = utils_1.default.latLngFromClickEvent(event);
            App.plannedTrip = trip_1.Trip.makeTrip(destCoord);
            App.routeService.fetchRoute(App.plannedTrip);
        }
        static onGoogleMapDoubleClick(event) {
            if (!App.hasVisualTrip)
                return;
            const clickedPos = utils_1.default.latLngFromClickEvent(event);
            App.plannedTrip.addWayPointObject(clickedPos);
            App.routeService.fetchRoute(App.plannedTrip);
        }
        static onDestMarkerDragEnd(event) {
            App.plannedTrip.destCoord = utils_1.default.latLngFromClickEvent(event);
            App.routeService.fetchRoute(App.plannedTrip);
            App.clickHandler.markerDragEventJustStopped = true;
            setTimeout(() => {
                App.clickHandler.markerDragEventJustStopped = false;
            }, map_service_1.default.MARKER_DRAG_TIMEOUT);
        }
        static onDestMarkerClick(event) {
            console.log("click event: " + JSON.stringify(event));
        }
        static onWayPointMarkerDragEnd(event) {
            const latLng = utils_1.default.latLngFromClickEvent(event);
            App.plannedTrip.updateWayPointObject(event.wpIndex, latLng);
            App.routeService.fetchRoute(App.plannedTrip);
            App.clickHandler.markerDragEventJustStopped = true;
            setTimeout(() => {
                App.clickHandler.markerDragEventJustStopped = false;
            }, map_service_1.default.MARKER_DRAG_TIMEOUT);
        }
        static onWayPointMarkerDblClick(event) {
            App.plannedTrip.removeWayPointObject(event.wpIndex);
            App.routeService.fetchRoute(App.plannedTrip);
        }
        static onLocButtonClick() {
            App.mapService.reCenter(App.currentPos);
        }
        static onClearButtonClick() {
            App.clearTrips();
        }
        static onMenuButtonClick(event) {
            components_1.Menu.toggleVisibility(event);
        }
        static onMapStyleToggleButtonClick(event) {
            const textHolderDiv = event.target;
            const value = textHolderDiv.innerText;
            switch (value) {
                case components_1.MapStyleToggleButton.NORMAL_TXT:
                    App.mapService.map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
                    break;
                case components_1.MapStyleToggleButton.SAT_TXT:
                    App.mapService.map.setMapTypeId(google.maps.MapTypeId.HYBRID);
                    break;
                case components_1.MapStyleToggleButton.TERRAIN_TXT:
                    App.mapService.map.setMapTypeId(google.maps.MapTypeId.TERRAIN);
                    break;
                default:
                    console.log("something is badly wrong with map style toggle clicks...");
                    console.log("text value in default statement: " + value);
                    break;
            }
        }
        static onCyclingLayerToggleButtonClick(event) {
            App.mapService.toggleBikeLayer(event);
        }
        static onTravelModeToggleButtonClick(event) {
            App.travelMode = event.target.value;
        }
        static onSpeedChooserValueChange(event) {
            App.speed = event.target.value;
            components_1.SpeedChooser.updateDisplayedSpeed(App.speed);
            if (!App.hasVisualTrip)
                return;
            const newDura = utils_1.default.duraInDecimHours(App.mapService.visualTrip.distance, App.speed);
            components_1.InfoHeader.updateDuration(newDura);
        }
        static onGeoLocSuccess(oldCoord, newCoord) {
            App.posMarker.clearFromMap();
            App.currentPos = newCoord;
            App.posMarker.moveTo(newCoord);
            if (geoloc_service_1.default.diffIsOverCameraMoveThreshold(oldCoord, newCoord)) {
                App.mapService.reCenter(newCoord);
            }
        }
        static clearTrips() {
            if (!App.hasVisualTrip)
                return;
            if (App.prevTrip) {
                App.prevTrip.clear();
            }
            App.prevTrip = null;
            App.plannedTrip.clear();
            App.plannedTrip = null;
            App.mapService.clearTripFromMap();
            components_1.InfoHeader.reset();
        }
        static _onDeviceReady() {
            App._receivedEvent('deviceready');
            document.addEventListener("pause", App._onPause, false);
            document.addEventListener("resume", App._onResume, false);
            App._init();
        }
        static _onPause() {
            App._geoLocService.stop();
        }
        static _onResume() {
            App._geoLocService.start();
        }
        static _receivedEvent(id) {
        }
        static get hasVisualTrip() {
            return App.mapService.visualTrip !== null;
        }
        static get currentPos() {
            return App._currentPos;
        }
        static set currentPos(newPos) {
            App._currentPos = newPos;
        }
        static get plannedTrip() {
            return App._plannedTrip;
        }
        static set plannedTrip(newTrip) {
            App._plannedTrip = newTrip;
        }
        static get prevTrip() {
            return App._prevTrip;
        }
        static set prevTrip(newTrip) {
            App._prevTrip = newTrip;
        }
        static get mapService() {
            return App._mapService;
        }
        static get routeService() {
            return App._routeService;
        }
        static get speed() {
            return App._speed;
        }
        static set speed(newSpeed) {
            App._speed = newSpeed;
        }
        static get travelMode() {
            return App._travelMode;
        }
        static set travelMode(newMode) {
            App._travelMode = newMode;
        }
        static get posMarker() {
            return App._posMarker;
        }
        static get clickHandler() {
            return this._clickHandler;
        }
    }
    App.MIN_SPEED = 1;
    App.MAX_SPEED = 50;
    App.DEFAULT_SPEED = 15;
    App._currentPos = new latlng_1.default(0, 0);
    App._geoLocService = new geoloc_service_1.default();
    App._clickHandler = new click_handler_1.default();
    exports.default = App;
    App.initialize();
});
