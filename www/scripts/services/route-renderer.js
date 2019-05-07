define(["require", "exports", "../misc/utils"], function (require, exports, utils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class RouteRenderer {
        constructor(_googleMap) {
            this._googleMap = _googleMap;
            this._polyLines = [];
        }
        clearPolyLine() {
            this._polyLines.forEach(line => line.setMap(null));
            this._polyLines.length = 0;
        }
        drawPolyLineFor(visualTrip, elevations) {
            const legs = visualTrip.routeResult.routes[0].legs;
            elevations === null ? this._renderSinglePolyline(legs) : this._renderMultiplePolylines(legs, elevations);
        }
        _renderSinglePolyline(legs) {
            const path = [];
            for (let i = 0; i < legs.length; i++) {
                for (let j = 0; j < legs[i].steps.length; j++) {
                    path.push(...legs[i].steps[j].path);
                }
            }
            const polylineOptions = {
                clickable: false,
                geodesic: true,
                map: this._googleMap,
                path: path,
                strokeColor: RouteRenderer._DEFAULT_COLOR,
                strokeOpacity: 1,
                strokeWeight: 4
            };
            this._polyLines.push(new google.maps.Polyline(polylineOptions));
        }
        _renderMultiplePolylines(legs, elevations) {
            const paths = [];
            const distances = [];
            for (let i = 0; i < legs.length; i++) {
                for (let j = 0; j < legs[i].steps.length; j++) {
                    paths.push(legs[i].steps[j].path);
                    distances.push(legs[i].steps[j].distance.value);
                }
            }
            paths.forEach((path, index) => {
                const elev = elevations[index];
                const nextElev = elevations[index + 1] ? elevations[index + 1] : elev;
                const dist = distances[index];
                const color = RouteRenderer._computeColor(elev, nextElev, dist);
                const polylineOptions = {
                    clickable: false,
                    geodesic: true,
                    map: this._googleMap,
                    path: path,
                    strokeColor: color,
                    strokeOpacity: 1,
                    strokeWeight: 4
                };
                this._polyLines.push(new google.maps.Polyline(polylineOptions));
            });
        }
        static _computeColor(elev1, elev2, distance) {
            const gradient = (elev2 - elev1) / distance;
            let uphillValue = 0;
            let downhillValue = 0;
            let steepness = gradient / RouteRenderer._MAX_GRADIENT;
            if (steepness > 1) {
                steepness = 1;
            }
            else if (steepness < -1) {
                steepness = -1;
            }
            uphillValue = 127 + steepness * 15000;
            downhillValue = 127 - steepness * 15000;
            uphillValue = utils_1.default.clamp(uphillValue, 0, 255);
            downhillValue = utils_1.default.clamp(downhillValue, 0, 255);
            return `rgba(${uphillValue},0,${downhillValue},1)`;
        }
    }
    RouteRenderer._MAX_GRADIENT = 10;
    RouteRenderer._DEFAULT_COLOR = `rgba(100,100,255,1)`;
    exports.default = RouteRenderer;
});
