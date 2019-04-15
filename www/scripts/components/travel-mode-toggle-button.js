define(["require", "exports", "../app"], function (require, exports, app_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const TravelModeToggleButton = {
        OUTER_DIV_ID: 'walk-cycle-btn-outer',
        SELECT_ID: 'walk-cycle-btn-select',
        CYCLE_TEXT: "cycle",
        WALK_TEXT: "walk",
        addTo: function (parentDiv) {
            const pickedOption = app_1.default.travelMode;
            let unpickedOption;
            let pickedText;
            let unpickedText;
            if (pickedOption === app_1.default.TravelMode.BICYCLING) {
                unpickedOption = app_1.default.TravelMode.WALKING;
                pickedText = TravelModeToggleButton.CYCLE_TEXT;
                unpickedText = TravelModeToggleButton.WALK_TEXT;
            }
            else {
                unpickedOption = app_1.default.TravelMode.BICYCLING;
                pickedText = TravelModeToggleButton.WALK_TEXT;
                unpickedText = TravelModeToggleButton.CYCLE_TEXT;
            }
            const outerDiv = document.createElement('div');
            outerDiv.id = TravelModeToggleButton.OUTER_DIV_ID;
            const select = document.createElement('select');
            select.id = TravelModeToggleButton.SELECT_ID;
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
            parentDiv.appendChild(outerDiv);
        }
    };
    exports.default = TravelModeToggleButton;
});
