define(["require", "exports", "../misc/click-handler", "./route-renderer", "../components/components", "../dataclasses/latlng", "../app"], function (require, exports, click_handler_1, route_renderer_1, components_1, latlng_1, app_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class MapService {
        constructor() {
            this._bikeLayerOn = false;
            const mapOptions = {
                center: MapService._INITIAL_CENTER_COORDS,
                zoom: MapService._DEFAULT_ZOOM,
                minZoom: MapService._MIN_ZOOM,
                fullscreenControl: false,
                gestureHandling: 'greedy',
                mapTypeControl: false,
                clickableIcons: false,
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
            this._setListeners(this._map, app_1.default.clickHandler);
        }
        reCenter(newCoord) {
            this._map.setCenter(newCoord);
        }
        addUIControl(position, control) {
            this._map.controls[position].push(control);
        }
        toggleBikeLayer(event) {
            const toggleBtn = event.target.parentElement;
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
        }
        renderTripOnMap(visualTrip, elevations) {
            this._visualTrip = visualTrip;
            this._visualTrip.showMarkersOnMap(this._map);
            this._routeRenderer.drawPolyLineFor(visualTrip, elevations);
        }
        clearTripFromMap() {
            if (this._visualTrip === null)
                return;
            this._visualTrip.clearMarkersFromMap();
            this._visualTrip = null;
            this._routeRenderer.clearPolyLine();
        }
        get map() {
            return this._map;
        }
        get bikeLayerOn() {
            return this._bikeLayerOn;
        }
        get visualTrip() {
            return this._visualTrip;
        }
        _setListeners(map, clickHandler) {
            map.addListener('click', function (e) {
                e.id = click_handler_1.default.ClickType.SINGLE;
                clickHandler.handle(e);
            });
            map.addListener('dblclick', function (e) {
                e.id = click_handler_1.default.ClickType.DOUBLE;
                clickHandler.handle(e);
            });
            map.addListener('heading_changed', function (e) {
                console.log("heading changed event: " + JSON.stringify(e));
            });
            map.addListener('zoom_changed', function (e) {
                clickHandler.isLongPress = false;
            });
            map.addListener('dragstart', function () {
                clickHandler.isLongPress = false;
            });
            map.addListener('drag', function () {
                clickHandler.isLongPress = false;
            });
            map.addListener('dragend', function () {
                clickHandler.isLongPress = false;
            });
            app_1.default.google.maps.event.addDomListener(this.mapHolderDiv, 'touchstart', function (e) {
                e.id = click_handler_1.default.ClickType.LONG_START;
                clickHandler.handle(e);
            });
            app_1.default.google.maps.event.addDomListener(this.mapHolderDiv, 'touchend', function (e) {
                e.id = click_handler_1.default.ClickType.LONG_END;
                clickHandler.handle(e);
            });
        }
    }
    MapService._DEFAULT_ZOOM = 11;
    MapService._MIN_ZOOM = 5;
    MapService._INITIAL_CENTER_COORDS = new latlng_1.default(0, 0);
    exports.default = MapService;
});
