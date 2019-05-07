define(["require", "exports", "../dataclasses/latlng"], function (require, exports, latlng_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Utils {
        static duraInDecimHours(distance, speed) {
            return distance / speed;
        }
        static distanceInKm(route) {
            let total = 0;
            for (let i = 0; i < route.legs.length; i++) {
                total += route.legs[i].distance.value;
            }
            return parseFloat((total / 1000).toFixed(1));
        }
        static latLngFromClickEvent(event) {
            return new latlng_1.default(event.latLng.lat(), event.latLng.lng());
        }
        static clamp(num, min, max) {
            if (num < min)
                return min;
            if (max && num > max)
                return max;
            return num;
        }
    }
    exports.default = Utils;
});
