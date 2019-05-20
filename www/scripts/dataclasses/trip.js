var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "mobx", "../app"], function (require, exports, mobx_1, app_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Trip {
        constructor(options) {
            this._destCoord = options.destCoord;
            const wps = options.wayPoints || [];
            this._wayPoints = mobx_1.observable.array(wps, {});
        }
        static makeTrip(destCoord) {
            const options = {
                destCoord: destCoord,
                wayPoints: []
            };
            return new Trip(options);
        }
        autoRefetchRouteOnChange() {
            this._disposer = mobx_1.autorun(() => {
                mobx_1.toJS(this._wayPoints, {});
                app_1.default.routeService.fetchRoute(this);
            }, {});
        }
        copy() {
            const options = {
                destCoord: this._destCoord,
                wayPoints: []
            };
            this._wayPoints.forEach(wp => {
                options.wayPoints.push(wp);
            });
            return new Trip(options);
        }
        get destCoord() {
            return this._destCoord;
        }
        set destCoord(newCoord) {
            this._destCoord = newCoord;
        }
        addWayPoint(latLng) {
            this._wayPoints.push(latLng);
        }
        updateWayPoint(index, newCoord) {
            this._wayPoints[index] = newCoord;
        }
        removeWayPoint(index) {
            this._wayPoints.splice(index, 1);
        }
        get wayPoints() {
            return this._wayPoints;
        }
        set wayPoints(newArray) {
            this._wayPoints = newArray;
        }
        getAllWpsAsAPIObjects() {
            return this._wayPoints.map(wp => {
                return {
                    stopover: true,
                    location: wp
                };
            });
        }
        clear() {
            if (this._disposer) {
                this._disposer();
            }
            this._destCoord = null;
            this._wayPoints.length = 0;
            return this;
        }
    }
    __decorate([
        mobx_1.observable,
        __metadata("design:type", Object)
    ], Trip.prototype, "_destCoord", void 0);
    exports.Trip = Trip;
});
