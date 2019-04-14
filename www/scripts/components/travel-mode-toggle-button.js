define(["require", "exports", "../app"], function (require, exports, app_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var TravelModeToggleButton = {
        OUTER_DIV_ID: 'walk-cycle-btn-outer',
        SELECT_ID: 'walk-cycle-btn-select',
        addTo: function (parentDiv) {
            var outerDiv = document.createElement('div');
            outerDiv.id = TravelModeToggleButton.OUTER_DIV_ID;
            var select = document.createElement('select');
            select.id = TravelModeToggleButton.SELECT_ID;
            select.addEventListener('change', app_1.default.onTravelModeToggleButtonClick);
            var cycleOption = document.createElement('option');
            cycleOption.innerHTML = "cycle";
            cycleOption.value = app_1.default.TravelMode.BICYCLING;
            var walkOption = document.createElement('option');
            walkOption.innerHTML = "walk";
            walkOption.value = app_1.default.TravelMode.WALKING;
            select.appendChild(cycleOption);
            select.appendChild(walkOption);
            outerDiv.appendChild(select);
            parentDiv.appendChild(outerDiv);
        }
    };
    exports.default = TravelModeToggleButton;
});
