define(["require", "exports"], function (require, exports) {
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
        drawPolyLineFor(visualTrip, elevations, stepResolution) {
            const stepStartCoords = visualTrip.routeStepStartCoords;
            const paths = [];
            const distances = [];
            const legs = visualTrip.routeResult.routes[0].legs;
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
                const color = this.calcColor(elev, nextElev, dist);
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
        calcColor(elev1, elev2, distance) {
            console.log("elev1: " + elev1);
            console.log("elev2: " + elev2);
            console.log("dist: " + distance);
            const gradient = (elev2 - elev1) / distance;
            let red = 0;
            let green = 0;
            let steepness = gradient / RouteRenderer._MAX_GRADIENT;
            if (steepness > 1) {
                steepness = 1;
            }
            else if (steepness < -1) {
                steepness = -1;
            }
            red = 127 + steepness * 15000;
            green = 127 - steepness * 15000;
            red = red > 255 ? 255 : red;
            red = red < 0 ? 0 : red;
            green = green > 255 ? 255 : green;
            green = green < 0 ? 0 : green;
            console.log("red: " + red);
            console.log("green: " + green);
            return `rgba(${red},${green},0,1)`;
        }
    }
    RouteRenderer._MAX_GRADIENT = 10;
    exports.default = RouteRenderer;
});
