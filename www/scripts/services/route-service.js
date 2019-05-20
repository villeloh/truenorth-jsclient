define(["require", "exports", "../app"], function (require, exports, app_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class RouteService {
        constructor(onFetchSuccessCallback, onFetchFailureCallback) {
            this.onFetchSuccessCallback = onFetchSuccessCallback;
            this.onFetchFailureCallback = onFetchFailureCallback;
            this._directionsService = new google.maps.DirectionsService();
        }
        fetchRoute(trip) {
            const destCoord = trip.destCoord;
            if (destCoord === null)
                return;
            const startCoord = app_1.default.state.currentPos;
            const that = this;
            const request = {
                origin: startCoord,
                destination: destCoord,
                travelMode: app_1.default.state.travelMode,
                optimizeWaypoints: false,
                avoidHighways: true,
                waypoints: trip.getAllWpsAsAPIObjects()
            };
            this._directionsService.route(request, function (result, status) {
                if (status === google.maps.DirectionsStatus.OK) {
                    that.onFetchSuccessCallback(result, trip);
                }
                else {
                    console.log("Error fetching route: " + status);
                    that.onFetchFailureCallback();
                }
            });
        }
    }
    exports.default = RouteService;
});
