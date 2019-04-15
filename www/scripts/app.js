define(["require", "exports", "./dataclasses/marker", "./dataclasses/trip", "./dataclasses/latlng", "./services/map-service", "./services/geoloc-service", "./services/route-service", "./misc/utils", "./misc/env", "./components/components", "./misc/ui-builder", "./dataclasses/visual-trip"], function (require, exports, marker_1, trip_1, latlng_1, map_service_1, geoloc_service_1, route_service_1, utils_1, env_1, components_1, ui_builder_1, visual_trip_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var TravelMode;
    (function (TravelMode) {
        TravelMode["WALKING"] = "WALKING";
        TravelMode["BICYCLING"] = "BICYCLING";
    })(TravelMode || (TravelMode = {}));
    var App = (function () {
        function App() {
        }
        Object.defineProperty(App, "TravelMode", {
            get: function () {
                return TravelMode;
            },
            enumerable: true,
            configurable: true
        });
        App.initialize = function () {
            console.log("called initialize");
            document.addEventListener('deviceready', App._onDeviceReady.bind(App), false);
        };
        App._init = function () {
            GoogleMapsLoader.KEY = env_1.default.API_KEY;
            GoogleMapsLoader.LANGUAGE = 'en';
            GoogleMapsLoader.LIBRARIES = ['geometry', 'places'];
            GoogleMapsLoader.load(function (google) {
                App.google = google;
                App._mapService = new map_service_1.default();
                App._routeService = new route_service_1.default(App.onRouteFetchSuccess, App.onRouteFetchFailure);
                App._speed = App.DEFAULT_SPEED;
                App._plannedTrip = null;
                App._prevTrip = null;
                App._posMarker = new marker_1.default(App._mapService.map, App._currentPos, "", false);
                App._posMarker.setIcon(marker_1.default.POS_MARKER_URL);
                App._travelMode = App.TravelMode.BICYCLING;
                ui_builder_1.default.buildUI();
                App._geoLocService.start();
            });
        };
        App.onRouteFetchSuccess = function (fetchResult, successfulTrip) {
            if (App.hasVisualTrip) {
                App.mapService.clearTripFromMap();
            }
            var visualTrip = new visual_trip_1.default(fetchResult, successfulTrip.destCoord, successfulTrip.getAllWayPointCoords());
            App.prevTrip = successfulTrip.copy();
            App.mapService.renderTripOnMap(visualTrip);
            var route = fetchResult.routes[0];
            var dist = utils_1.default.distanceInKm(route);
            var dura = utils_1.default.calcDuration(dist, App.speed);
            components_1.InfoHeader.updateDistance(dist);
            components_1.InfoHeader.updateDuration(dura);
        };
        App.onRouteFetchFailure = function () {
            if (App.prevTrip === null)
                return;
            App.plannedTrip = App.prevTrip.copy();
            App.routeService.fetchRoute(App.plannedTrip);
        };
        App.onGoogleMapLongPress = function (event) {
            if (App.hasVisualTrip) {
                App.prevTrip = App.plannedTrip.copy();
            }
            var destCoord = utils_1.default.latLngFromClickEvent(event);
            if (App.hasVisualTrip) {
                App.plannedTrip.destCoord = destCoord;
            }
            else {
                App.plannedTrip = trip_1.Trip.makeTrip(destCoord);
            }
            App.routeService.fetchRoute(App.plannedTrip);
        };
        App.onGoogleMapDoubleClick = function (event) {
            if (!App.hasVisualTrip)
                return;
            var clickedPos = utils_1.default.latLngFromClickEvent(event);
            App.plannedTrip.addWayPointObject(clickedPos);
            App.routeService.fetchRoute(App.plannedTrip);
        };
        App.onDestMarkerDragEnd = function (event) {
            App.plannedTrip.destCoord = utils_1.default.latLngFromClickEvent(event);
            App.routeService.fetchRoute(App.plannedTrip);
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
            App.plannedTrip.updateWayPointObject(event.wpIndex, latLng);
            App.routeService.fetchRoute(App.plannedTrip);
            App.mapService.markerDragEventJustStopped = true;
            setTimeout(function () {
                App.mapService.markerDragEventJustStopped = false;
            }, map_service_1.default.MARKER_DRAG_TIMEOUT);
        };
        App.onWayPointMarkerDblClick = function (event) {
            App.plannedTrip.removeWayPointObject(event.wpIndex);
            App.routeService.fetchRoute(App.plannedTrip);
        };
        App.onLocButtonClick = function () {
            App.mapService.reCenter(App.currentPos);
        };
        App.onClearButtonClick = function () {
            if (!App.hasVisualTrip)
                return;
            App.prevTrip = null;
            App.plannedTrip = null;
            App.mapService.clearTripFromMap();
            components_1.InfoHeader.reset();
        };
        App.onMenuButtonClick = function (event) {
            components_1.Menu.toggleVisibility(event);
        };
        App.onMapStyleToggleButtonClick = function (event) {
            var textHolderDiv = event.target;
            var value = textHolderDiv.innerText;
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
        };
        App.onCyclingLayerToggleButtonClick = function (event) {
            App.mapService.toggleBikeLayer(event);
        };
        App.onTravelModeToggleButtonClick = function (event) {
            App.travelMode = event.target.value;
        };
        App.onGeoLocSuccess = function (newPos) {
            App.posMarker.clearFromMap();
            App.currentPos = newPos;
            App.posMarker.moveTo(newPos);
        };
        App._onDeviceReady = function () {
            App._receivedEvent('deviceready');
            document.addEventListener("pause", App._onPause, false);
            document.addEventListener("resume", App._onResume, false);
            App._init();
        };
        App._onPause = function () {
            App._geoLocService.stop();
        };
        App._onResume = function () {
            App._geoLocService.start();
        };
        App._receivedEvent = function (id) {
        };
        Object.defineProperty(App, "hasVisualTrip", {
            get: function () {
                return App.mapService.visualTrip !== null;
            },
            enumerable: true,
            configurable: true
        });
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
        Object.defineProperty(App, "plannedTrip", {
            get: function () {
                return App._plannedTrip;
            },
            set: function (newTrip) {
                App._plannedTrip = newTrip;
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
        App.MAX_SPEED = 50;
        App.DEFAULT_SPEED = 15;
        App._currentPos = new latlng_1.default(0, 0);
        App._geoLocService = new geoloc_service_1.default();
        return App;
    }());
    exports.default = App;
    App.initialize();
});
