define(["require", "exports", "./waypoint-object"], function (require, exports, waypoint_object_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Trip {
        constructor(options) {
            this._destCoord = options.destCoord;
            this._wayPointObjects = options.wayPointObjects || [];
        }
        static makeTrip(destCoord) {
            const options = {
                destCoord: destCoord,
                wayPointObjects: []
            };
            return new Trip(options);
        }
        copy() {
            const options = {
                destCoord: this._destCoord,
                wayPointObjects: []
            };
            this._wayPointObjects.forEach(wpObj => {
                options.wayPointObjects.push(wpObj);
            });
            return new Trip(options);
        }
        get destCoord() {
            return this._destCoord;
        }
        set destCoord(newCoord) {
            this._destCoord = newCoord;
        }
        addWayPointObject(latLng) {
            this._wayPointObjects.push(new waypoint_object_1.default(latLng));
        }
        updateWayPointObject(index, newCoord) {
            this._wayPointObjects[index] = new waypoint_object_1.default(newCoord);
        }
        removeWayPointObject(index) {
            this._wayPointObjects.splice(index, 1);
        }
        get wayPointObjects() {
            return this._wayPointObjects;
        }
        set wayPointObjects(newArray) {
            this._wayPointObjects = newArray;
        }
        getAllWayPointCoords() {
            return this._wayPointObjects.map(wpObj => {
                return wpObj.location;
            });
        }
        clear() {
            this._destCoord = null;
            this._wayPointObjects.length = 0;
        }
    }
    exports.Trip = Trip;
});
