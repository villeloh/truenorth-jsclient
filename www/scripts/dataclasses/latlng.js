define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class LatLng {
        constructor(lat, lng) {
            this.lat = lat;
            this.lng = lng;
        }
        toString() {
            return `lat.: ${this.lat}, lng.: ${this.lng}`;
        }
        differenceFrom(anotherLatLng) {
            const absLatDiff = Math.abs(Math.abs(this.lat) - Math.abs(anotherLatLng.lat));
            const absLngDiff = Math.abs(Math.abs(this.lng) - Math.abs(anotherLatLng.lng));
            return Math.max(absLatDiff, absLngDiff);
        }
    }
    exports.default = LatLng;
});
