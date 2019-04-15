define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Marker {
        constructor(_map, _position, _label, _isDraggable) {
            this._map = _map;
            this._position = _position;
            this._label = _label;
            this._isDraggable = _isDraggable;
            const markerOptions = {
                position: _position,
                map: _map,
                draggable: _isDraggable,
                label: _label,
                crossOnDrag: false
            };
            this._googleMapMarker = new google.maps.Marker(markerOptions);
        }
        static makeDestMarker(destCoord) {
            return new Marker(null, destCoord, "", true);
        }
        static makeWayPointMarker(coord, label) {
            return new Marker(null, coord, label, true);
        }
        addListener(eventName, callback) {
            this._googleMapMarker.addListener(eventName, callback);
        }
        clearFromMap() {
            this._googleMapMarker.setMap(null);
            google.maps.event.clearInstanceListeners(this._googleMapMarker);
        }
        showOnMap(map) {
            this._googleMapMarker.setMap(map);
            return this;
        }
        moveTo(newPos) {
            this.clearFromMap();
            const options = {
                position: newPos,
                map: this._map,
                draggable: this._isDraggable,
                label: this._label,
                crossOnDrag: false,
                icon: this._googleMapMarker.getIcon()
            };
            this._googleMapMarker = new google.maps.Marker(options);
        }
        setIcon(iconUrl) {
            this._googleMapMarker.setIcon(iconUrl);
        }
    }
    Marker.POS_MARKER_URL = 'http://maps.google.com/mapfiles/kml/shapes/placemark_circle_highlight.png';
    exports.default = Marker;
});
