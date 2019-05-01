var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "./base-abstract/button", "../misc/annotations"], function (require, exports, button_1, annotations_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class CyclingLayerToggleButton extends button_1.default {
        static build(onClick) {
            const outerDiv = document.createElement('div');
            outerDiv.id = CyclingLayerToggleButton._OUTER_DIV_ID;
            const innerDiv = document.createElement('div');
            innerDiv.id = CyclingLayerToggleButton._INNER_DIV_ID;
            innerDiv.innerHTML = CyclingLayerToggleButton._TEXT;
            outerDiv.addEventListener('click', onClick);
            outerDiv.appendChild(innerDiv);
            return outerDiv;
        }
        static setInitialStyles(bikeLayerOn) {
            const toggleBtn = document.getElementById(CyclingLayerToggleButton._OUTER_DIV_ID);
            if (bikeLayerOn) {
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
    __decorate([
        annotations_1.override
    ], CyclingLayerToggleButton, "build", null);
    exports.default = CyclingLayerToggleButton;
});
