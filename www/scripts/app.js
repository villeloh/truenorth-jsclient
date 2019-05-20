define(["require", "exports", "./dataclasses/marker", "./dataclasses/trip", "./dataclasses/latlng", "./services/map-service", "./services/geoloc-service", "./services/route-service", "./misc/utils", "./misc/env", "./components/components", "./misc/ui-builder", "./dataclasses/visual-trip", "./services/elevation-service", "./misc/click-handler"], function (require, exports, marker_1, trip_1, latlng_1, map_service_1, geoloc_service_1, route_service_1, utils_1, env_1, components_1, ui_builder_1, visual_trip_1, elevation_service_1, click_handler_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var TravelMode;
    (function (TravelMode) {
        TravelMode["WALKING"] = "WALKING";
        TravelMode["BICYCLING"] = "BICYCLING";
    })(TravelMode || (TravelMode = {}));
    var Change;
    (function (Change) {
        Change[Change["speed"] = 0] = "speed";
        Change[Change["travelMode"] = 1] = "travelMode";
        Change[Change["prevTrip"] = 2] = "prevTrip";
        Change[Change["currentTrip"] = 3] = "currentTrip";
        Change[Change["tripDuration"] = 4] = "tripDuration";
        Change[Change["tripDistance"] = 5] = "tripDistance";
        Change[Change["currentPos"] = 6] = "currentPos";
        Change[Change["posMarker"] = 7] = "posMarker";
    })(Change || (Change = {}));
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
                App.setState(Change.speed, App.DEFAULT_SPEED);
                App.setState(Change.travelMode, App.TravelMode.BICYCLING);
                App.setState(Change.posMarker, marker_1.default.makePosMarker(App._mapService.map, App.state.currentPos));
                ui_builder_1.default.buildUI();
                App._geoLocService.start();
            });
        }
        static onRouteFetchSuccess(fetchResult, successfulTrip) {
            App.setState(Change.prevTrip, successfulTrip.copy());
            if (App.hasVisualTrip) {
                App.mapService.clearTripFromMap();
            }
            const visualTrip = new visual_trip_1.default(fetchResult, successfulTrip.destCoord, successfulTrip.wayPoints);
            const route = fetchResult.routes[0];
            App._elevationService.fetchElevations(visualTrip);
            const dist = utils_1.default.distanceInKm(route);
            App.setState(Change.tripDistance, dist);
            const dura = utils_1.default.duraInDecimHours(dist, App.state.speed);
            App.setState(Change.tripDuration, dura);
            components_1.InfoHeader.updateDistance(dist);
            components_1.InfoHeader.updateDuration(dura);
        }
        static onRouteFetchFailure() {
            if (App.state.prevTrip === null)
                return;
            App.setState(Change.currentTrip, App.state.prevTrip.copy());
            App.state.currentTrip.autoRefetchRouteOnChange();
        }
        static onElevationFetchSuccess(visualTrip, resultsArray) {
            const elevations = resultsArray.map(result => result.elevation);
            App.mapService.renderTripOnMap(visualTrip, elevations);
        }
        static onElevationFetchFailure(visualTrip) {
            App.mapService.renderTripOnMap(visualTrip, null);
        }
        static onGoogleMapLongPress(event) {
            const destCoord = utils_1.default.latLngFromClickEvent(event);
            App.setState(Change.currentTrip, trip_1.Trip.makeTrip(destCoord));
            App.state.currentTrip.autoRefetchRouteOnChange();
        }
        static onGoogleMapDoubleClick(event) {
            if (!App.hasVisualTrip)
                return;
            const clickedPos = utils_1.default.latLngFromClickEvent(event);
            App.state.currentTrip.addWayPoint(clickedPos);
        }
        static onDestMarkerDragEnd(event) {
            App.state.currentTrip.destCoord = utils_1.default.latLngFromClickEvent(event);
            App.clickHandler.markerDragEventJustStopped = true;
            setTimeout(() => {
                App.clickHandler.markerDragEventJustStopped = false;
            }, click_handler_1.default.MARKER_DRAG_TIMEOUT);
        }
        static onDestMarkerClick(event) {
            console.log("click event: " + JSON.stringify(event));
        }
        static onWayPointMarkerDragEnd(event) {
            const latLng = utils_1.default.latLngFromClickEvent(event);
            App.state.currentTrip.updateWayPoint(event.wpIndex, latLng);
            App.clickHandler.markerDragEventJustStopped = true;
            setTimeout(() => {
                App.clickHandler.markerDragEventJustStopped = false;
            }, click_handler_1.default.MARKER_DRAG_TIMEOUT);
        }
        static onWayPointMarkerDblClick(event) {
            App.state.currentTrip.removeWayPoint(event.wpIndex);
        }
        static onLocButtonClick() {
            App.mapService.reCenter(App.state.currentPos);
        }
        static onClearButtonClick() {
            App._clearTrips();
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
            App.setState(Change.travelMode, event.target.value);
        }
        static onSpeedChooserValueChange(event) {
            App.setState(Change.speed, event.target.value);
            components_1.SpeedChooser.updateDisplayedSpeed(App.state.speed);
            if (!App.hasVisualTrip)
                return;
            const newDura = utils_1.default.duraInDecimHours(App.state.tripDistance, App.state.speed);
            App.setState(Change.tripDuration, newDura);
            components_1.InfoHeader.updateDuration(newDura);
        }
        static onGeoLocSuccess(oldCoord, newCoord) {
            const posMarker = App.state.posMarker;
            posMarker.clearFromMap();
            App.setState(Change.currentPos, newCoord);
            posMarker.moveTo(newCoord);
            if (geoloc_service_1.default.diffIsOverCameraMoveThreshold(oldCoord, newCoord)) {
                App.mapService.reCenter(newCoord);
            }
        }
        static _clearTrips() {
            if (!App.hasVisualTrip)
                return;
            if (App.state.prevTrip) {
                App.state.prevTrip.clear();
                App.setState(Change.prevTrip, null);
            }
            App.state.currentTrip.clear();
            App.setState(Change.currentTrip, null);
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
        static setState(change, value) {
            switch (change) {
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
                case Change.currentPos:
                    App.state.currentPos = value;
                    break;
                case Change.posMarker:
                    App.state.posMarker = value;
                    break;
            }
        }
        static get hasVisualTrip() {
            return App.mapService.visualTrip !== null;
        }
        static get mapService() {
            return App._mapService;
        }
        static get routeService() {
            return App._routeService;
        }
        static get clickHandler() {
            return this._clickHandler;
        }
    }
    App.MIN_SPEED = 1;
    App.MAX_SPEED = 50;
    App.DEFAULT_SPEED = 15;
    App._initialPrevTrip = null;
    App._initialCurrentTrip = null;
    App._initialTravelMode = 'BICYCLING';
    App.state = {
        speed: 1,
        travelMode: App._initialTravelMode,
        prevTrip: App._initialPrevTrip,
        currentTrip: App._initialCurrentTrip,
        tripDuration: 0,
        tripDistance: 0,
        currentPos: new latlng_1.default(0, 0),
        posMarker: null
    };
    App._geoLocService = new geoloc_service_1.default();
    App._clickHandler = new click_handler_1.default();
    exports.default = App;
    App.initialize();
});
