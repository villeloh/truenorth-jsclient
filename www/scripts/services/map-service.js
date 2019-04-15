define(["require", "exports", "../misc/click-handler", "./route-renderer", "../components/components", "../dataclasses/latlng", "../app"], function (require, exports, click_handler_1, route_renderer_1, components_1, latlng_1, app_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var MapService = (function () {
        function MapService() {
            this._markerDragEventJustStopped = false;
            this._bikeLayerOn = false;
            this._clickHandler = new click_handler_1.default();
            var mapOptions = {
                center: MapService._INITIAL_CENTER_COORDS,
                zoom: MapService._DEFAULT_ZOOM,
                minZoom: MapService._MIN_ZOOM,
                fullscreenControl: false,
                gestureHandling: 'greedy',
                mapTypeControl: false,
                rotateControl: false,
                scaleControl: false,
                tilt: 0,
                disableDoubleClickZoom: true
            };
            this.mapHolderDiv = document.getElementById('map');
            this._map = new app_1.default.google.maps.Map(this.mapHolderDiv, mapOptions);
            this._bikeLayer = new google.maps.BicyclingLayer();
            this._visualTrip = null;
            this._routeRenderer = new route_renderer_1.default(this._map);
            this._setListeners();
        }
        MapService.prototype.reCenter = function (newCoord) {
            this._map.setCenter(newCoord);
        };
        MapService.prototype.addUIControl = function (position, control) {
            this._map.controls[position].push(control);
        };
        MapService.prototype.toggleBikeLayer = function (event) {
            var toggleBtn = event.target.parentElement;
            if (this._bikeLayerOn) {
                components_1.CyclingLayerToggleButton.applyOffStyles(toggleBtn);
                this._bikeLayer.setMap(null);
                this._bikeLayerOn = false;
            }
            else {
                components_1.CyclingLayerToggleButton.applyOnStyles(toggleBtn);
                this._bikeLayer.setMap(this._map);
                this._bikeLayerOn = true;
            }
        };
        MapService.prototype.renderTripOnMap = function (visualTrip) {
            this._visualTrip = visualTrip;
            this._visualTrip.showMarkersOnMap(this._map);
            this._routeRenderer.renderRouteOnMap(visualTrip.routeResult);
        };
        MapService.prototype.clearTripFromMap = function () {
            if (this._visualTrip === null)
                return;
            this._visualTrip.clearMarkersFromMap();
            this._visualTrip = null;
            this._routeRenderer.clearPolyLine();
        };
        Object.defineProperty(MapService.prototype, "markerDragEventJustStopped", {
            get: function () {
                return this._markerDragEventJustStopped;
            },
            set: function (value) {
                this._markerDragEventJustStopped = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MapService.prototype, "map", {
            get: function () {
                return this._map;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MapService.prototype, "clickHandler", {
            get: function () {
                return this._clickHandler;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MapService.prototype, "bikeLayerOn", {
            get: function () {
                return this._bikeLayerOn;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MapService.prototype, "visualTrip", {
            get: function () {
                return this._visualTrip;
            },
            enumerable: true,
            configurable: true
        });
        MapService.prototype._setListeners = function () {
            this.map.addListener('click', function (e) {
                e.id = click_handler_1.default.ClickType.SINGLE;
                app_1.default.mapService.clickHandler.handle(e);
            });
            this.map.addListener('dblclick', function (e) {
                e.id = click_handler_1.default.ClickType.DOUBLE;
                app_1.default.mapService.clickHandler.handle(e);
            });
            this.map.addListener('heading_changed', function (e) {
                console.log("heading changed event: " + JSON.stringify(e));
            });
            this.map.addListener('zoom_changed', function (e) {
                app_1.default.mapService.clickHandler.isLongPress = false;
            });
            this.map.addListener('dragstart', function () {
                app_1.default.mapService.clickHandler.isLongPress = false;
            });
            this.map.addListener('drag', function () {
                app_1.default.mapService.clickHandler.isLongPress = false;
            });
            this.map.addListener('dragend', function () {
                app_1.default.mapService.clickHandler.isLongPress = false;
            });
            app_1.default.google.maps.event.addDomListener(this.mapHolderDiv, 'touchstart', function (e) {
                e.id = click_handler_1.default.ClickType.LONG_START;
                app_1.default.mapService.clickHandler.handle(e);
            });
            app_1.default.google.maps.event.addDomListener(this.mapHolderDiv, 'touchend', function (e) {
                e.id = click_handler_1.default.ClickType.LONG_END;
                app_1.default.mapService.clickHandler.handle(e);
            });
        };
        MapService.MARKER_DRAG_TIMEOUT = 100;
        MapService._DEFAULT_ZOOM = 8;
        MapService._MIN_ZOOM = 5;
        MapService._INITIAL_CENTER_COORDS = new latlng_1.default(0, 0);
        return MapService;
    }());
    exports.default = MapService;
});
