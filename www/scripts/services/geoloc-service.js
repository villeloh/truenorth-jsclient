define(["require", "exports", "../dataclasses/latlng", "../app"], function (require, exports, latlng_1, app_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class GeoLocService {
        constructor() {
        }
        start() {
            const that = this;
            this._locTracker = navigator.geolocation.watchPosition(function (pos) {
                that._onSuccess.bind(that);
                that._onSuccess(pos);
            }, this._onError, GeoLocService._OPTIONS);
        }
        stop() {
            navigator.geolocation.clearWatch(this._locTracker);
        }
        _onSuccess(pos) {
            const newCoord = new latlng_1.default(pos.coords.latitude, pos.coords.longitude);
            const oldCoord = app_1.default.currentPos;
            app_1.default.onGeoLocSuccess(oldCoord, newCoord);
        }
        _onError(error) {
            console.log("GeoLoc error! Code: " + error.code);
            console.log("GeoLoc error! Msg: " + error.message);
        }
        static diffIsOverCameraMoveThreshold(oldPos, newPos) {
            const diff = oldPos.differenceFrom(newPos);
            return diff > GeoLocService._CAMERA_MOVE_THRESHOLD;
        }
    }
    GeoLocService._CAMERA_MOVE_THRESHOLD = 0.001;
    GeoLocService._MAX_AGE = 3000;
    GeoLocService._TIME_OUT = 5000;
    GeoLocService._OPTIONS = {
        maximumAge: GeoLocService._MAX_AGE,
        timeout: GeoLocService._TIME_OUT,
        enableHighAccuracy: true
    };
    exports.default = GeoLocService;
});
