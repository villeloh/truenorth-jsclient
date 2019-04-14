define(["require", "exports", "../dataclasses/latlng"], function (require, exports, latlng_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Utils = (function () {
        function Utils() {
        }
        Utils.isValidSpeed = function (speedInKmH) {
            if (speedInKmH < 1 || speedInKmH === "" || speedInKmH === null || speedInKmH === undefined) {
                return false;
            }
            else {
                return true;
            }
        };
        Utils.calcDuration = function (distance, speed) {
            var duraInDecimHours;
            if (Utils.isValidSpeed(speed)) {
                duraInDecimHours = distance / speed;
            }
            else {
                duraInDecimHours = 0;
            }
            return duraInDecimHours;
        };
        Utils.formatDuration = function (duraInDecimHours, fallBackText) {
            var text;
            if (duraInDecimHours === 0) {
                text = fallBackText;
            }
            else {
                var hours = Math.trunc(duraInDecimHours);
                var decimPart = duraInDecimHours - hours;
                var minutes = Math.round(decimPart * 60);
                text = hours + " h " + minutes + " m";
            }
            return text;
        };
        Utils.distanceInKm = function (route) {
            var total = 0;
            for (var i = 0; i < route.legs.length; i++) {
                total += route.legs[i].distance.value;
            }
            return parseFloat((total / 1000).toFixed(1));
        };
        Utils.latLngFromClickEvent = function (event) {
            return new latlng_1.default(event.latLng.lat(), event.latLng.lng());
        };
        return Utils;
    }());
    exports.default = Utils;
});
