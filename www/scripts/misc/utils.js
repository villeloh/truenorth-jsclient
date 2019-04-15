define(["require", "exports", "../dataclasses/latlng"], function (require, exports, latlng_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Utils {
        static isValidSpeed(speedInKmH) {
            if (speedInKmH < 1 || speedInKmH === "" || speedInKmH === null || speedInKmH === undefined) {
                return false;
            }
            else {
                return true;
            }
        }
        static calcDuration(distance, speed) {
            let duraInDecimHours;
            if (Utils.isValidSpeed(speed)) {
                duraInDecimHours = distance / speed;
            }
            else {
                duraInDecimHours = 0;
            }
            return duraInDecimHours;
        }
        static formatDuration(duraInDecimHours, fallBackText) {
            let text;
            if (duraInDecimHours === 0) {
                text = fallBackText;
            }
            else {
                const hours = Math.trunc(duraInDecimHours);
                const decimPart = duraInDecimHours - hours;
                const minutes = Math.round(decimPart * 60);
                text = `${hours} h ${minutes} m`;
            }
            return text;
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
    }
    exports.default = Utils;
});
