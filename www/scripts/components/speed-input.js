define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SpeedInput = {
        INPUT_ID: 'speed-input',
        addTo: function (parentDiv) {
            parentDiv.innerHTML = "<input \n      type=\"number\" \n      id=" + SpeedInput.INPUT_ID + " \n      step=1\n      max=" + App.MAX_SPEED + " \n      value=" + App.speed + " \n      oninput=\"SpeedInput.onValueChange(event)\"\n    >";
        },
        onValueChange: function (event) {
            var value = event.target.value;
            if (value > App.MAX_SPEED) {
                event.target.value = App.MAX_SPEED;
            }
            else if (value < 0) {
                event.target.value = 0;
            }
            if (Utils.isValidSpeed(event.target.value)) {
                App.speed = event.target.value;
            }
            else {
                App.speed = 0;
            }
            if (App.noCurrentDest)
                return;
            App.currentTrip.duration = Utils.calcDuration(App.currentTrip.distance, App.speed);
            InfoHeader.updateDuration(App.currentTrip.duration);
        }
    };
    exports.default = SpeedInput;
});
