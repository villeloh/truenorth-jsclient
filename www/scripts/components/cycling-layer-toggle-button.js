define(["require", "exports", "../app"], function (require, exports, app_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class CyclingLayerToggleButton {
        static build() {
            const outerDiv = document.createElement('div');
            outerDiv.id = CyclingLayerToggleButton._OUTER_DIV_ID;
            const innerDiv = document.createElement('div');
            innerDiv.id = CyclingLayerToggleButton._INNER_DIV_ID;
            innerDiv.innerHTML = CyclingLayerToggleButton._TEXT;
            outerDiv.addEventListener('click', app_1.default.onCyclingLayerToggleButtonClick);
            outerDiv.appendChild(innerDiv);
            return outerDiv;
        }
        static setInitialStyles() {
            const toggleBtn = document.getElementById(CyclingLayerToggleButton._OUTER_DIV_ID);
            if (app_1.default.mapService.bikeLayerOn) {
                CyclingLayerToggleButton.applyOnStyles(toggleBtn);
            }
            else {
                CyclingLayerToggleButton.applyOffStyles(toggleBtn);
            }
        }
        static applyOffStyles(buttonDiv) {
            buttonDiv.style.backgroundColor = CyclingLayerToggleButton._BG_COLOR_OFF;
            buttonDiv.style.border = CyclingLayerToggleButton._BORDER_OFF;
        }
        static applyOnStyles(buttonDiv) {
            buttonDiv.style.backgroundColor = CyclingLayerToggleButton._BG_COLOR_ON;
            buttonDiv.style.border = CyclingLayerToggleButton._BORDER_ON;
        }
    }
    CyclingLayerToggleButton._BORDER_ON = '2px solid green';
    CyclingLayerToggleButton._BORDER_OFF = '2px solid #808080';
    CyclingLayerToggleButton._BG_COLOR_ON = '#7CFFAC';
    CyclingLayerToggleButton._BG_COLOR_OFF = '#fff';
    CyclingLayerToggleButton._OUTER_DIV_ID = 'cyc-layer-btn-outer';
    CyclingLayerToggleButton._INNER_DIV_ID = 'cyc-layer-btn-inner';
    CyclingLayerToggleButton._TEXT = 'C.LAYER';
    exports.default = CyclingLayerToggleButton;
});
