define(["require", "exports", "../app"], function (require, exports, app_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class TravelModeToggleButton {
        static build() {
            const pickedOption = app_1.default.travelMode;
            let unpickedOption;
            let pickedText;
            let unpickedText;
            if (pickedOption === app_1.default.TravelMode.BICYCLING) {
                unpickedOption = app_1.default.TravelMode.WALKING;
                pickedText = TravelModeToggleButton._CYCLE_TEXT;
                unpickedText = TravelModeToggleButton._WALK_TEXT;
            }
            else {
                unpickedOption = app_1.default.TravelMode.BICYCLING;
                pickedText = TravelModeToggleButton._WALK_TEXT;
                unpickedText = TravelModeToggleButton._CYCLE_TEXT;
            }
            const outerDiv = document.createElement('div');
            outerDiv.id = TravelModeToggleButton._OUTER_DIV_ID;
            const select = document.createElement('select');
            select.id = TravelModeToggleButton._SELECT_ID;
            select.addEventListener('change', app_1.default.onTravelModeToggleButtonClick);
            const firstOption = document.createElement('option');
            firstOption.innerHTML = pickedText;
            firstOption.value = pickedOption;
            const secondOption = document.createElement('option');
            secondOption.innerHTML = unpickedText;
            secondOption.value = unpickedOption;
            select.appendChild(firstOption);
            select.appendChild(secondOption);
            outerDiv.appendChild(select);
            return outerDiv;
        }
    }
    TravelModeToggleButton._OUTER_DIV_ID = 'walk-cycle-btn-outer';
    TravelModeToggleButton._SELECT_ID = 'walk-cycle-btn-select';
    TravelModeToggleButton._CYCLE_TEXT = "cycle";
    TravelModeToggleButton._WALK_TEXT = "walk";
    exports.default = TravelModeToggleButton;
});
