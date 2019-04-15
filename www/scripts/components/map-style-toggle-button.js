define(["require", "exports", "../app"], function (require, exports, app_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const MapStyleToggleButton = {
        NORMAL_TXT: 'NORMAL',
        TERRAIN_TXT: 'TERRAIN',
        SAT_TXT: 'SAT.',
        OUTER_DIV_CLASS: 'map-style-btn-outer',
        INNER_DIV_CLASS: 'map-style-btn-inner',
        addTo: function (parentDiv, btnText) {
            const outerDiv = document.createElement('div');
            outerDiv.className = MapStyleToggleButton.OUTER_DIV_CLASS;
            const innerDiv = document.createElement('div');
            innerDiv.className = MapStyleToggleButton.INNER_DIV_CLASS;
            innerDiv.innerHTML = btnText;
            outerDiv.addEventListener('click', app_1.default.onMapStyleToggleButtonClick);
            outerDiv.appendChild(innerDiv);
            parentDiv.appendChild(outerDiv);
        }
    };
    exports.default = MapStyleToggleButton;
});
