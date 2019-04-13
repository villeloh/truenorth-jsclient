define(["require", "exports", "../dataclasses/latlng", "../app"], function (require, exports, latlng_1, app_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var GeoLocService = (function () {
        function GeoLocService() {
        }
        GeoLocService.prototype.start = function () {
            var that = this;
            this._locTracker = navigator.geolocation.watchPosition(function (pos) {
                that._onSuccess.bind(that);
                that._onSuccess(pos);
            }, this._onError, GeoLocService._OPTIONS);
        };
        GeoLocService.prototype.stop = function () {
            navigator.geolocation.clearWatch(this._locTracker);
        };
        GeoLocService.prototype._onSuccess = function (pos) {
            var newCoord = new latlng_1.default(pos.coords.latitude, pos.coords.longitude);
            var oldCoord = app_1.default.currentPos;
            app_1.default.onGeoLocSuccess(newCoord);
            if (this._diffIsOverCameraMoveThreshold(oldCoord, newCoord)) {
                app_1.default.mapService.reCenter(newCoord);
            }
        };
        GeoLocService.prototype._onError = function (error) {
            console.log("GeoLoc error! Code: " + error.code);
            console.log("GeoLoc error! Msg: " + error.message);
        };
        GeoLocService.prototype._diffIsOverCameraMoveThreshold = function (oldPos, newPos) {
            var diff = oldPos.differenceFrom(newPos);
            return diff > GeoLocService._CAMERA_MOVE_THRESHOLD;
        };
        GeoLocService._CAMERA_MOVE_THRESHOLD = 0.001;
        GeoLocService._MAX_AGE = 3000;
        GeoLocService._TIME_OUT = 5000;
        GeoLocService._OPTIONS = {
            maximumAge: GeoLocService._MAX_AGE,
            timeout: GeoLocService._TIME_OUT,
            enableHighAccuracy: true
        };
        return GeoLocService;
    }());
    exports.default = GeoLocService;
});
