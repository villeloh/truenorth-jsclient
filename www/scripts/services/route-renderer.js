define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var RouteRenderer = (function () {
        function RouteRenderer(_googleMap) {
            this._googleMap = _googleMap;
            this._renderer = new google.maps.DirectionsRenderer({
                draggable: false,
                suppressMarkers: true,
                suppressBicyclingLayer: true,
                map: this._googleMap,
                preserveViewport: true,
                polylineOptions: {
                    strokeColor: RouteRenderer._ROUTE_COLOR,
                    strokeOpacity: 1.0,
                    strokeWeight: 4,
                    zIndex: 5,
                    map: this._googleMap,
                    geodesic: true
                }
            });
        }
        RouteRenderer.prototype.clearPolyLine = function () {
            this._renderer.setMap(null);
        };
        RouteRenderer.prototype.renderOnMap = function (fetchResult) {
            this._renderer.setMap(this._googleMap);
            this._renderer.setDirections(fetchResult);
        };
        RouteRenderer._ROUTE_COLOR = '#2B7CFF';
        return RouteRenderer;
    }());
    exports.default = RouteRenderer;
});
