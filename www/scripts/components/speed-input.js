define(["require", "exports", "../app", "../misc/utils", "../components/components"], function (require, exports, app_1, utils_1, components_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class SpeedInput {
        static build() {
            const input = document.createElement('input');
            input.type = "number";
            input.id = SpeedInput._INPUT_ID;
            input.step = "1";
            input.max = app_1.default.MAX_SPEED + "";
            input.value = app_1.default.speed + "";
            input.addEventListener('input', SpeedInput.onValueChange);
            return input;
        }
        static onValueChange(event) {
            const value = event.target.value;
            if (value > app_1.default.MAX_SPEED) {
                event.target.value = app_1.default.MAX_SPEED;
            }
            else if (value < 0) {
                event.target.value = 0;
            }
            if (utils_1.default.isValidSpeed(event.target.value)) {
                app_1.default.speed = event.target.value;
            }
            else {
                app_1.default.speed = 0;
            }
            if (!app_1.default.hasVisualTrip)
                return;
            const newDura = utils_1.default.calcDuration(app_1.default.mapService.visualTrip.distance, app_1.default.speed);
            components_1.InfoHeader.updateDuration(newDura);
        }
    }
    SpeedInput._INPUT_ID = 'speed-input';
    exports.default = SpeedInput;
});
