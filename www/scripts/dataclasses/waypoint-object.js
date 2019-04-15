define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class WayPointObject {
        constructor(latLng, stopover = true) {
            this.stopover = stopover;
            this.location = latLng;
        }
        toString() {
            return `WP Object: ( lat.: ${this.location.lat}, lng.: ${this.location.lng} )`;
        }
        ;
    }
    exports.default = WayPointObject;
});
