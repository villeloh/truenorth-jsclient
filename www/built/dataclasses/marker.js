define(["require", "exports", "../app"], function (require, exports, app_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Marker = (function () {
        function Marker(_map, _position, _label, _isDraggable) {
            this._map = _map;
            this._position = _position;
            this._label = _label;
            this._isDraggable = _isDraggable;
            var markerOptions = {
                position: _position,
                map: _map,
                draggable: _isDraggable,
                label: _label,
                crossOnDrag: false
            };
            this._googleMapMarker = new google.maps.Marker(markerOptions);
        }
        Marker.makeDestMarker = function (destCoord) {
            return new Marker(app_1.default.mapService.map, destCoord, "", true);
        };
        Marker.makeWayPointMarker = function (coord, label) {
            return new Marker(app_1.default.mapService.map, coord, label, true);
        };
        Marker.prototype.addListener = function (eventName, callback) {
            this._googleMapMarker.addListener(eventName, callback);
        };
        Marker.prototype.clearFromMap = function () {
            this._googleMapMarker.setMap(null);
            google.maps.event.clearInstanceListeners(this._googleMapMarker);
        };
        Marker.prototype.moveTo = function (newPos) {
            this.clearFromMap();
            var options = {
                position: newPos,
                map: this._map,
                draggable: this._isDraggable,
                label: this._label,
                crossOnDrag: false
            };
            this._googleMapMarker = new google.maps.Marker(options);
        };
        Marker.prototype.setIcon = function (iconUrl) {
            this._googleMapMarker.setIcon(iconUrl);
        };
        Marker.POS_MARKER_URL = 'http://maps.google.com/mapfiles/kml/shapes/placemark_circle_highlight.png';
        return Marker;
    }());
    exports.default = Marker;
});
