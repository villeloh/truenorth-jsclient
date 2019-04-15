define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class RouteRenderer {
        constructor(_googleMap) {
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
        clearPolyLine() {
            this._renderer.setMap(null);
        }
        renderRouteOnMap(routeResult) {
            this._renderer.setMap(this._googleMap);
            this._renderer.setDirections(routeResult);
        }
    }
    RouteRenderer._ROUTE_COLOR = '#2B7CFF';
    exports.default = RouteRenderer;
});
