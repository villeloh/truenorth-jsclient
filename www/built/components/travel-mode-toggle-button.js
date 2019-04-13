define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var TravelModeToggleButton = {
        OUTER_DIV_ID: 'walk-cycle-btn-outer',
        SELECT_ID: 'walk-cycle-btn-select',
        addTo: function (parentDiv) {
            parentDiv.innerHTML = "<div id=" + TravelModeToggleButton.OUTER_DIV_ID + ">\n    <select id=" + TravelModeToggleButton.SELECT_ID + " onchange=\"App.onTravelModeToggleButtonClick(event)\">\n      <option value=" + App.TravelMode.BICYCLING + ">cycle</option>\n      <option value=" + App.TravelMode.WALKING + ">walk</option>\n    </select>\n    </div>";
        }
    };
    exports.default = TravelModeToggleButton;
});
