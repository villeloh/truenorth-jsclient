define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var WayPointObject = (function () {
        function WayPointObject(location, stopover) {
            if (stopover === void 0) { stopover = true; }
            this.location = location;
            this.stopover = stopover;
        }
        WayPointObject.prototype.toString = function () {
            return "WP Object: ( lat.: " + this.location.lat + ", lng.: " + this.location.lng + " )";
        };
        ;
        return WayPointObject;
    }());
    exports.default = WayPointObject;
});
