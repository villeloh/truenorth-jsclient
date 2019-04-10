/**
 * Renders routes on the map.
 */
var RouteRenderer = /** @class */ (function () {
    function RouteRenderer(googleMap) {
        this._googleMap = googleMap;
        this._renderer = new App.google.maps.DirectionsRenderer({
            draggable: false,
            suppressMarkers: true,
            suppressBicyclingLayer: true,
            map: this._googleMap,
            preserveViewport: true,
            polylineOptions: {
                // path: points,
                strokeColor: RouteRenderer._ROUTE_COLOR,
                strokeOpacity: 1.0,
                strokeWeight: 4,
                zIndex: 5,
                map: this._googleMap,
                // editable: true,
                geodesic: true
            }
        }); // _renderer
    } // constructor
    Object.defineProperty(RouteRenderer, "_ROUTE_COLOR", {
        get: function () { return '#2B7CFF'; } // darkish blue
        ,
        enumerable: true,
        configurable: true
    });
    RouteRenderer.prototype.clearPolyLine = function () {
        this._renderer.setMap(null);
    };
    RouteRenderer.prototype.renderOnMap = function (fetchResult) {
        this._renderer.setMap(this._googleMap);
        this._renderer.setDirections(fetchResult); // renders polyline on the map
    };
    return RouteRenderer;
}()); // RouteRenderer
