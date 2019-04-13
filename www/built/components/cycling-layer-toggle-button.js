define(["require", "exports"], function (require, exports) {
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
            parentDiv.innerHTML = "<div id=" + CyclingLayerToggleButton.OUTER_DIV_ID + " onclick=\"App.onCyclingLayerToggleButtonClick(event)\">\n    <div id=" + CyclingLayerToggleButton.INNER_DIV_ID + ">" + CyclingLayerToggleButton.TEXT + "</div></div>";
        },
        setInitialStyles: function () {
            var toggleBtn = document.getElementById(CyclingLayerToggleButton.OUTER_DIV_ID);
            if (App.mapService.bikeLayerOn) {
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
