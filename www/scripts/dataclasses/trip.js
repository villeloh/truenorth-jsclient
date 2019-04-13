define(["require", "exports", "../app", "./waypoint-object", "./marker"], function (require, exports, app_1, waypoint_object_1, marker_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Status;
    (function (Status) {
        Status[Status["PREFETCH"] = 0] = "PREFETCH";
        Status[Status["FAILED"] = 1] = "FAILED";
        Status[Status["SUCCEEDED"] = 2] = "SUCCEEDED";
        Status[Status["SHOWN"] = 3] = "SHOWN";
    })(Status || (Status = {}));
    var Trip = (function () {
        function Trip(options) {
            this._map = options.map;
            this._startCoord = options.startCoord;
            this._destCoord = options.destCoord;
            this._wayPointObjects = options.wayPointObjects || [];
            this._status = options.status;
            this._distance = null;
            this._duration = null;
            this._fetchResult = null;
            this._destMarker = null;
            this._wayPointMarkers = [];
        }
        Trip.makeTrip = function (destCoord) {
            var options = {
                map: app_1.default.mapService.map,
                startCoord: app_1.default.currentTrip.startCoord,
                destCoord: destCoord,
                wayPointObjects: app_1.default.currentTrip.wayPointObjects || [],
                status: Trip.Status.PREFETCH
            };
            return new Trip(options);
        };
        Trip.prototype.showOnMap = function () {
            app_1.default.mapService.renderOnMap(this._fetchResult);
            if (this._destCoord !== null) {
                this.destMarker = marker_1.default.makeDestMarker(this._destCoord);
            }
            else {
                this._destMarker = null;
            }
            this.makeWayPointMarkers();
        };
        Trip.prototype.copy = function () {
            var options = {
                map: this._map,
                startCoord: this._startCoord,
                destCoord: this._destCoord,
                wayPointObjects: [],
                status: Trip.Status.PREFETCH
            };
            this._wayPointObjects.forEach(function (wpObj) {
                options.wayPointObjects.push(wpObj);
            });
            return new Trip(options);
        };
        Object.defineProperty(Trip.prototype, "startCoord", {
            get: function () {
                return this._startCoord;
            },
            set: function (newCoord) {
                this._startCoord = newCoord;
            },
            enumerable: true,
            configurable: true
        });
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
        Object.defineProperty(Trip.prototype, "status", {
            get: function () {
                return this._status;
            },
            set: function (newStatus) {
                this._status = newStatus;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Trip.prototype, "distance", {
            get: function () {
                return this._distance;
            },
            set: function (newDist) {
                this._distance = newDist;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Trip.prototype, "duration", {
            get: function () {
                return this._duration;
            },
            set: function (newDura) {
                this._duration = newDura;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Trip.prototype, "fetchResult", {
            get: function () {
                return this._fetchResult;
            },
            set: function (newResult) {
                this._fetchResult = newResult;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Trip.prototype, "destMarker", {
            set: function (marker) {
                this._destMarker = marker;
                this._destMarker.addListener('dragend', app_1.default.onDestMarkerDragEnd);
                this._destMarker.addListener('click', app_1.default.onDestMarkerTap);
            },
            enumerable: true,
            configurable: true
        });
        Trip.prototype.makeWayPointMarkers = function () {
            var labelNum = 1;
            var wayPointCoordsArray = this.getAllWayPointCoords();
            var _loop_1 = function (i) {
                var marker = marker_1.default.makeWayPointMarker(wayPointCoordsArray[i], labelNum + "");
                labelNum++;
                marker.addListener('dragend', function (event) {
                    event.wpIndex = i;
                    app_1.default.onWayPointMarkerDragEnd(event);
                });
                marker.addListener('dblclick', function (event) {
                    event.wpIndex = i;
                    app_1.default.onWayPointDblClick(event);
                });
                this_1._wayPointMarkers.push(marker);
            };
            var this_1 = this;
            for (var i = 0; i < wayPointCoordsArray.length; i++) {
                _loop_1(i);
            }
        };
        Trip.prototype.clear = function () {
            this._destCoord = null;
            this._wayPointObjects.length = 0;
            this._distance = null;
            this._duration = null;
            app_1.default.mapService.clearPolyLineFromMap();
            this._destMarker.clearFromMap();
            this._wayPointMarkers.map(function (marker) {
                marker.clearFromMap();
                return null;
            });
            this._wayPointMarkers.length = 0;
        };
        Trip.Status = Status;
        return Trip;
    }());
    exports.Trip = Trip;
});
