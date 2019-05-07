define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Marker {
        constructor(_map, _position, _label, _isDraggable, _icon) {
            this._map = _map;
            this._position = _position;
            this._label = _label;
            this._isDraggable = _isDraggable;
            this._icon = _icon;
            let markerOptions = {
                position: _position,
                map: _map,
                draggable: _isDraggable,
                label: _label,
                crossOnDrag: false
            };
            if (_icon) {
                markerOptions.icon = _icon;
            }
            this._googleMapMarker = new google.maps.Marker(markerOptions);
        }
        static makeDestMarker(destCoord) {
            return new Marker(null, destCoord, "", true);
        }
        static makeWayPointMarker(coord, label) {
            const symbol = {
                fillColor: this.WAYPOINT_MARKER_COLOR,
                fillOpacity: 1,
                path: google.maps.SymbolPath.CIRCLE,
                scale: 8,
                strokeColor: this.WAYPOINT_MARKER_STROKE,
                strokeWeight: 1
            };
            return new Marker(null, coord, label, true, symbol);
        }
        static makePosMarker(map, coord) {
            const symbol = {
                fillColor: Marker.POS_MARKER_COLOR,
                fillOpacity: 1,
                path: google.maps.SymbolPath.CIRCLE,
                scale: 5,
                strokeColor: Marker.POS_MARKER_COLOR,
                strokeWeight: 1
            };
            return new Marker(map, coord, "", false, symbol);
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
    }
    Marker.POS_MARKER_COLOR = 'rgba(50,50,255,1)';
    Marker.WAYPOINT_MARKER_COLOR = 'rgba(190,255,255,1)';
    Marker.WAYPOINT_MARKER_STROKE = 'rgba(0,0,0,1)';
    exports.default = Marker;
});
