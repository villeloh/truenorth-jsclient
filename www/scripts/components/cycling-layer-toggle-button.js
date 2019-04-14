define(["require", "exports", "../app"], function (require, exports, app_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var CyclingLayerToggleButton = {
        BORDER_ON: '2px solid green',
        BORDER_OFF: '2px solid #808080',
        BG_COLOR_ON: '#7CFFAC',
        BG_COLOR_OFF: '#fff',
        OUTER_DIV_ID: 'cyc-layer-btn-outer',
        INNER_DIV_ID: 'cyc-layer-btn-inner',
        TEXT: 'C.LAYER',
        addTo: function (parentDiv) {
            var outerDiv = document.createElement('div');
            outerDiv.id = CyclingLayerToggleButton.OUTER_DIV_ID;
            var innerDiv = document.createElement('div');
            innerDiv.id = CyclingLayerToggleButton.INNER_DIV_ID;
            innerDiv.innerHTML = CyclingLayerToggleButton.TEXT;
            outerDiv.addEventListener('click', app_1.default.onCyclingLayerToggleButtonClick);
            outerDiv.appendChild(innerDiv);
            parentDiv.appendChild(outerDiv);
        },
        setInitialStyles: function () {
            var toggleBtn = document.getElementById(CyclingLayerToggleButton.OUTER_DIV_ID);
            if (app_1.default.mapService.bikeLayerOn) {
                CyclingLayerToggleButton.applyOnStyles(toggleBtn);
            }
            else {
                CyclingLayerToggleButton.applyOffStyles(toggleBtn);
            }
        },
        applyOffStyles: function (buttonDiv) {
            buttonDiv.style.backgroundColor = CyclingLayerToggleButton.BG_COLOR_OFF;
            buttonDiv.style.border = CyclingLayerToggleButton.BORDER_OFF;
        },
        applyOnStyles: function (buttonDiv) {
            buttonDiv.style.backgroundColor = CyclingLayerToggleButton.BG_COLOR_ON;
            buttonDiv.style.border = CyclingLayerToggleButton.BORDER_ON;
        }
    };
    exports.default = CyclingLayerToggleButton;
});
