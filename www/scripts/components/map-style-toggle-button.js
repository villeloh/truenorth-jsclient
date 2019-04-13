define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var MapStyleToggleButton = {
        NORMAL_TXT: 'NORMAL',
        TERRAIN_TXT: 'TERRAIN',
        SAT_TXT: 'SAT.',
        OUTER_DIV_CLASS: 'map-style-btn-outer',
        INNER_DIV_CLASS: 'map-style-btn-inner',
        addTo: function (parentDiv, btnText) {
            parentDiv.innerHTML += "<div class=" + MapStyleToggleButton.OUTER_DIV_CLASS + " onclick=\"App.onMapStyleToggleButtonClick(event)\">\n    <div class=" + MapStyleToggleButton.INNER_DIV_CLASS + ">" + btnText + "</div></div>";
        }
    };
    exports.default = MapStyleToggleButton;
});
