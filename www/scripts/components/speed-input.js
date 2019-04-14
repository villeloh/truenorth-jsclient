define(["require", "exports", "../app", "../misc/utils", "../components/info-header"], function (require, exports, app_1, utils_1, info_header_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SpeedInput = {
        INPUT_ID: 'speed-input',
        addTo: function (parentDiv) {
            var input = document.createElement('input');
            input.type = "number";
            input.id = SpeedInput.INPUT_ID;
            input.step = "1";
            input.max = app_1.default.MAX_SPEED + "";
            input.value = app_1.default.speed + "";
            input.addEventListener('input', SpeedInput.onValueChange);
            parentDiv.appendChild(input);
        },
        onValueChange: function (event) {
            var value = event.target.value;
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
            if (app_1.default.mapService.visualTrip === null)
                return;
            var newDura = utils_1.default.calcDuration(app_1.default.mapService.visualTrip.distance, app_1.default.speed);
            info_header_1.default.updateDuration(newDura);
        }
    };
    exports.default = SpeedInput;
});
