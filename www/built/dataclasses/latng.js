define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var LatLng = (function () {
        function LatLng(lat, lng) {
            this.lat = lat;
            this.lng = lng;
        }
        LatLng.prototype.toString = function () {
            return "lat.: " + this.lat + ", lng.: " + this.lng;
        };
        LatLng.prototype.differenceFrom = function (anotherLatLng) {
            var absLatDiff = Math.abs(Math.abs(this.lat) - Math.abs(anotherLatLng.lat));
            var absLngDiff = Math.abs(Math.abs(this.lng) - Math.abs(anotherLatLng.lng));
            return Math.max(absLatDiff, absLngDiff);
        };
        return LatLng;
    }());
    exports.default = LatLng;
});
