/**
 * Periodically updates the user's own position (via GPS).
 */
// TODO: handle not having GPS on / turning it off while using the app (rn it crashes the app)
var GeoLocService = /** @class */ (function () {
    function GeoLocService() {
        this._locTracker = null;
        this._options = {
            maximumAge: GeoLocService._MAX_AGE,
            timeout: GeoLocService._TIME_OUT,
            enableHighAccuracy: true
        };
    } // constructor
    Object.defineProperty(GeoLocService, "_CAMERA_MOVE_THRESHOLD", {
        get: function () { return 0.001; },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(GeoLocService, "_MAX_AGE", {
        get: function () { return 3000; },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(GeoLocService, "_TIME_OUT", {
        get: function () { return 5000; },
        enumerable: true,
        configurable: true
    });
    ;
    GeoLocService.prototype.start = function () {
        var that = this;
        this._locTracker = navigator.geolocation.watchPosition(function (pos) {
            that._onSuccess.bind(that); // for some odd reason, this trick is needed for the function to retain the correct 'this' reference
            that._onSuccess(pos);
        }, this._onError, this._options);
    }; // start
    GeoLocService.prototype.stop = function () {
        navigator.geolocation.clearWatch(this._locTracker);
    };
    GeoLocService.prototype._onSuccess = function (pos) {
        var newCoords = new LatLng(pos.coords.latitude, pos.coords.longitude);
        var oldCoords = App.routeService.plannedTrip.getPosCoords();
        App.routeService.plannedTrip.updatePosition(newCoords);
        if (this._diffIsOverCameraMoveThreshold(oldCoords, newCoords)) {
            App.mapService.reCenter(newCoords);
        }
    }; // _onSuccess
    GeoLocService.prototype._onError = function (error) {
        console.log("GeoLoc error! Code: " + error.code);
        console.log("GeoLoc error! Msg: " + error.message);
    };
    // make the camera auto-follow the user only if the change in position is significant enough (i.e., they're cycling).
    GeoLocService.prototype._diffIsOverCameraMoveThreshold = function (oldPos, newPos) {
        var diff = oldPos.differenceFrom(newPos);
        return diff > GeoLocService._CAMERA_MOVE_THRESHOLD;
    }; // _diffIsOverCameraMoveThreshold
    return GeoLocService;
}()); // GeoLocService
