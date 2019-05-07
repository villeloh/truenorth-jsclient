var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "./waypoint-object", "mobx", "../app"], function (require, exports, waypoint_object_1, mobx_1, app_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Trip {
        constructor(options) {
            this._destCoord = options.destCoord;
            const wpObjects = options.wayPointObjects || [];
            this._wayPointObjects = mobx_1.observable.array(wpObjects, {});
        }
        static makeTrip(destCoord) {
            const options = {
                destCoord: destCoord,
                wayPointObjects: []
            };
            return new Trip(options);
        }
        autoRefetchRouteOnChange() {
            this._disposer = mobx_1.autorun(() => {
                mobx_1.toJS(this._wayPointObjects, {});
                app_1.default.routeService.fetchRoute(this);
            }, {});
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
            if (this._disposer) {
                this._disposer();
            }
            this._destCoord = null;
            this._wayPointObjects.length = 0;
        }
    }
    __decorate([
        mobx_1.observable,
        __metadata("design:type", Object)
    ], Trip.prototype, "_destCoord", void 0);
    exports.Trip = Trip;
});
