define(["require", "exports", "../app", "./waypoint-object"], function (require, exports, app_1, waypoint_object_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Trip = (function () {
        function Trip(options) {
            this._map = options.map;
            this._destCoord = options.destCoord;
            this._wayPointObjects = options.wayPointObjects || [];
        }
        Trip.makeTrip = function (destCoord) {
            var options = {
                map: app_1.default.mapService.map,
                destCoord: destCoord,
                wayPointObjects: []
            };
            return new Trip(options);
        };
        Trip.prototype.copy = function () {
            var options = {
                map: this._map,
                destCoord: this._destCoord,
                wayPointObjects: []
            };
            this._wayPointObjects.forEach(function (wpObj) {
                options.wayPointObjects.push(wpObj);
            });
            return new Trip(options);
        };
        Object.defineProperty(Trip.prototype, "destCoord", {
            get: function () {
                return this._destCoord;
            },
            set: function (newCoord) {
                this._destCoord = newCoord;
            },
            enumerable: true,
            configurable: true
        });
        Trip.prototype.addWayPointObject = function (latLng) {
            this._wayPointObjects.push(new waypoint_object_1.default(latLng));
        };
        Trip.prototype.updateWayPointObject = function (index, newCoord) {
            this._wayPointObjects[index] = new waypoint_object_1.default(newCoord);
        };
        Trip.prototype.removeWayPointObject = function (index) {
            this._wayPointObjects.splice(index, 1);
        };
        Object.defineProperty(Trip.prototype, "wayPointObjects", {
            get: function () {
                return this._wayPointObjects;
            },
            set: function (newArray) {
                this._wayPointObjects = newArray;
            },
            enumerable: true,
            configurable: true
        });
        Trip.prototype.getAllWayPointCoords = function () {
            return this._wayPointObjects.map(function (wpObj) {
                return wpObj.location;
            });
        };
        Trip.prototype.clear = function () {
            this._destCoord = null;
            this._wayPointObjects.length = 0;
        };
        return Trip;
    }());
    exports.Trip = Trip;
});
