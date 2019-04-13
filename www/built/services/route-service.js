define(["require", "exports", "./../dataclasses/trip", "../app"], function (require, exports, trip_1, app_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var RouteService = (function () {
        function RouteService(onFetchSuccessCallback, onFetchFailureCallback) {
            this.onFetchSuccessCallback = onFetchSuccessCallback;
            this.onFetchFailureCallback = onFetchFailureCallback;
            this._directionsService = new google.maps.DirectionsService();
        }
        RouteService.prototype.fetchRoute = function (trip) {
            if (trip.status !== trip_1.Trip.Status.PREFETCH)
                return;
            var that = this;
            var destCoord = trip.destCoord;
            if (destCoord === null)
                return;
            var request = {
                origin: trip.startCoord,
                destination: destCoord,
                travelMode: app_1.default.travelMode,
                optimizeWaypoints: false,
                avoidHighways: true,
                waypoints: trip.wayPointObjects
            };
            this._directionsService.route(request, function (result, status) {
                if (status === google.maps.DirectionsStatus.OK) {
                    trip.status = trip_1.Trip.Status.SUCCEEDED;
                    that.onFetchSuccessCallback(result, trip);
                }
                else {
                    console.log("Error fetching route: " + status);
                    that.onFetchFailureCallback();
                }
            });
        };
        return RouteService;
    }());
    exports.default = RouteService;
});
