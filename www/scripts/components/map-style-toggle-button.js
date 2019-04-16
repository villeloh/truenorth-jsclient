define(["require", "exports", "../app"], function (require, exports, app_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class MapStyleToggleButton {
        static build(btnText) {
            const outerDiv = document.createElement('div');
            outerDiv.className = MapStyleToggleButton._OUTER_DIV_CLASS;
            const innerDiv = document.createElement('div');
            innerDiv.className = MapStyleToggleButton._INNER_DIV_CLASS;
            innerDiv.innerHTML = btnText;
            outerDiv.addEventListener('click', app_1.default.onMapStyleToggleButtonClick);
            outerDiv.appendChild(innerDiv);
            return outerDiv;
        }
    }
    MapStyleToggleButton.NORMAL_TXT = 'NORMAL';
    MapStyleToggleButton.TERRAIN_TXT = 'TERRAIN';
    MapStyleToggleButton.SAT_TXT = 'SAT.';
    MapStyleToggleButton._OUTER_DIV_CLASS = 'map-style-btn-outer';
    MapStyleToggleButton._INNER_DIV_CLASS = 'map-style-btn-inner';
    exports.default = MapStyleToggleButton;
});
