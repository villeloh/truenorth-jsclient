define(["require", "exports", "./dataclasses/marker", "./dataclasses/trip", "./dataclasses/latlng", "./services/map-service", "./services/geoloc-service", "./services/route-service", "./misc/utils", "./misc/env", "./components/menu", "./components/info-header", "./components/map-style-toggle-button", "./misc/ui"], function (require, exports, marker_1, trip_1, latlng_1, map_service_1, geoloc_service_1, route_service_1, utils_1, env_1, menu_1, info_header_1, map_style_toggle_button_1, ui_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var TravelMode;
    (function (TravelMode) {
        TravelMode[TravelMode["WALKING"] = google.maps.TravelMode.WALKING] = "WALKING";
        TravelMode[TravelMode["BICYCLING"] = google.maps.TravelMode.BICYCLING] = "BICYCLING";
        TravelMode[TravelMode["DRIVING"] = google.maps.TravelMode.DRIVING] = "DRIVING";
        TravelMode[TravelMode["TRANSIT"] = google.maps.TravelMode.TRANSIT] = "TRANSIT";
    })(TravelMode || (TravelMode = {}));
    var AppContainer = {
        initialize: function () {
            console.log("called initialize");
            document.addEventListener('deviceready', App.onDeviceReady.bind(App), false);
        }
    };
    window.onload = function () {
        AppContainer.initialize();
    };
    var App = (function () {
        function App() {
        }
        Object.defineProperty(App, "MAX_SPEED", {
            get: function () { return 50; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(App, "DEFAULT_SPEED", {
            get: function () { return 15; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(App, "TravelMode", {
            get: function () {
                return TravelMode;
            },
            enumerable: true,
            configurable: true
        });
        App.initServices = function () {
            console.log("called initServices");
            GoogleMapsLoader.KEY = env_1.default.API_KEY;
            GoogleMapsLoader.LANGUAGE = 'en';
            GoogleMapsLoader.LIBRARIES = ['geometry', 'places'];
            GoogleMapsLoader.load(function (google) {
                App.google = google;
                ui_1.default.init();
                App._currentTrip = App._DEFAULT_TRIP;
                App._prevTrip = App._currentTrip.copy();
                App._posMarker.setIcon(marker_1.default.POS_MARKER_URL);
                App._geoLocService.start();
            });
        };
        App.onRouteFetchSuccess = function (fetchResult, successfulTrip) {
            App.currentTrip.clear();
            var route = fetchResult.routes[0];
            var dist = utils_1.default.distanceInKm(route);
            var dura = utils_1.default.calcDuration(dist, App.speed);
            successfulTrip.distance = dist;
            successfulTrip.duration = dura;
            successfulTrip.fetchResult = fetchResult;
            successfulTrip.status = trip_1.Trip.Status.SHOWN;
            App.prevTrip = successfulTrip.copy();
            App.currentTrip = successfulTrip;
            App.currentTrip.showOnMap();
            info_header_1.default.updateDistance(dist);
            info_header_1.default.updateDuration(dura);
        };
        App.onRouteFetchFailure = function () {
            App.currentTrip = App.prevTrip.copy();
            App.routeService.fetchRoute(App.currentTrip);
        };
        App.onGoogleMapLongPress = function (event) {
            var destCoord = utils_1.default.latLngFromClickEvent(event);
            if (App.noCurrentDest) {
                App.currentTrip.clear();
                App.currentTrip = trip_1.Trip.makeTrip(destCoord);
            }
            else {
                App.currentTrip.destCoord = destCoord;
            }
            App.routeService.fetchRoute(App.currentTrip);
        };
        App.onGoogleMapDoubleClick = function (event) {
            if (App.noCurrentDest)
                return;
            var clickedPos = utils_1.default.latLngFromClickEvent(event);
            App.currentTrip.addWayPointObject(clickedPos);
            App.routeService.fetchRoute(App.currentTrip);
        };
        App.onDestMarkerDragEnd = function (event) {
            App.currentTrip.destCoord = utils_1.default.latLngFromClickEvent(event);
            App.routeService.fetchRoute(App.currentTrip);
            App.mapService.markerDragEventJustStopped = true;
            setTimeout(function () {
                App.mapService.markerDragEventJustStopped = false;
            }, map_service_1.default.MARKER_DRAG_TIMEOUT);
        };
        App.onDestMarkerTap = function (event) {
            console.log("tap event: " + JSON.stringify(event));
        };
        App.onWayPointMarkerDragEnd = function (event) {
            var latLng = utils_1.default.latLngFromClickEvent(event);
            App.currentTrip.updateWayPointObject(event.wpIndex, latLng);
            App.routeService.fetchRoute(App.currentTrip);
            App.mapService.markerDragEventJustStopped = true;
            setTimeout(function () {
                App.mapService.markerDragEventJustStopped = false;
            }, map_service_1.default.MARKER_DRAG_TIMEOUT);
        };
        App.onWayPointDblClick = function (event) {
            App.currentTrip.removeWayPointObject(event.wpIndex);
            App.routeService.fetchRoute(App.currentTrip);
        };
        App.onLocButtonClick = function () {
            App.mapService.reCenter(App.currentPos);
        };
        App.onClearButtonClick = function () {
            if (App.noCurrentDest)
                return;
            App.currentTrip.clear();
            info_header_1.default.reset();
        };
        App.onMenuButtonClick = function (event) {
            menu_1.default.toggleVisibility(event);
        };
        App.onMapStyleToggleButtonClick = function (event) {
            var textHolderDiv = event.target;
            var value = textHolderDiv.innerText;
            switch (value) {
                case map_style_toggle_button_1.default.NORMAL_TXT:
                    App.mapService.map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
                    break;
                case map_style_toggle_button_1.default.SAT_TXT:
                    App.mapService.map.setMapTypeId(google.maps.MapTypeId.HYBRID);
                    break;
                case map_style_toggle_button_1.default.TERRAIN_TXT:
                    App.mapService.map.setMapTypeId(google.maps.MapTypeId.TERRAIN);
                    break;
                default:
                    console.log("something is badly wrong with map style toggle clicks...");
                    console.log("text value in default statement: " + value);
                    break;
            }
        };
        App.onCyclingLayerToggleButtonClick = function (event) {
            App.mapService.toggleBikeLayer(event);
        };
        App.onTravelModeToggleButtonClick = function (event) {
            App.travelMode = event.target.value;
        };
        App.onGeoLocSuccess = function (newPos) {
            App.prevTrip.startCoord = newPos;
            App.currentTrip.startCoord = newPos;
            App.posMarker.clearFromMap();
            App.currentPos = newPos;
            App.posMarker.moveTo(newPos);
        };
        App.onDeviceReady = function () {
            App._receivedEvent('deviceready');
            document.addEventListener("pause", App._onPause, false);
            document.addEventListener("resume", App._onResume, false);
            App.initServices();
        };
        App._onPause = function () {
            App._geoLocService.stop();
        };
        App._onResume = function () {
            App._geoLocService.start();
        };
        App._receivedEvent = function (id) {
        };
        Object.defineProperty(App, "currentPos", {
            get: function () {
                return App._currentPos;
            },
            set: function (newPos) {
                App._currentPos = newPos;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(App, "currentTrip", {
            get: function () {
                return App._currentTrip;
            },
            set: function (newTrip) {
                App._currentTrip = newTrip;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(App, "prevTrip", {
            get: function () {
                return App._prevTrip;
            },
            set: function (newTrip) {
                App._prevTrip = newTrip;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(App, "mapService", {
            get: function () {
                return App._mapService;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(App, "routeService", {
            get: function () {
                return App._routeService;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(App, "speed", {
            get: function () {
                return App._speed;
            },
            set: function (newSpeed) {
                App._speed = newSpeed;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(App, "travelMode", {
            get: function () {
                return App._travelMode;
            },
            set: function (newMode) {
                App._travelMode = newMode;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(App, "posMarker", {
            get: function () {
                return App._posMarker;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(App, "noCurrentDest", {
            get: function () {
                return App._currentTrip.destCoord === null;
            },
            enumerable: true,
            configurable: true
        });
        App._mapService = new map_service_1.default();
        App._routeService = new route_service_1.default(App.onRouteFetchSuccess, App.onRouteFetchFailure);
        App._currentPos = new latlng_1.default(0, 0);
        App._posMarker = new marker_1.default(App._mapService.map, App._currentPos, "", false);
        App._geoLocService = new geoloc_service_1.default();
        App._DEFAULT_TRIP_OPTIONS = {
            map: App._mapService.map,
            startCoord: new latlng_1.default(0, 0),
            destCoord: null,
            status: trip_1.Trip.Status.PREFETCH
        };
        App._DEFAULT_TRIP = new trip_1.Trip(App._DEFAULT_TRIP_OPTIONS);
        return App;
    }());
    exports.default = App;
});
