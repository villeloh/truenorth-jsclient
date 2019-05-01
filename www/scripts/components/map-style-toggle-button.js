var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "./base-abstract/button", "../misc/annotations"], function (require, exports, button_1, annotations_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class MapStyleToggleButton extends button_1.default {
        static build(onClick, btnText) {
            const outerDiv = document.createElement('div');
            outerDiv.className = MapStyleToggleButton._OUTER_DIV_CLASS;
            const innerDiv = document.createElement('div');
            innerDiv.className = MapStyleToggleButton._INNER_DIV_CLASS;
            innerDiv.innerHTML = btnText;
            outerDiv.addEventListener('click', onClick);
            outerDiv.appendChild(innerDiv);
            return outerDiv;
        }
    }
    MapStyleToggleButton.NORMAL_TXT = 'NORMAL';
    MapStyleToggleButton.TERRAIN_TXT = 'TERRAIN';
    MapStyleToggleButton.SAT_TXT = 'SAT.';
    MapStyleToggleButton._OUTER_DIV_CLASS = 'map-style-btn-outer';
    MapStyleToggleButton._INNER_DIV_CLASS = 'map-style-btn-inner';
    __decorate([
        annotations_1.override
    ], MapStyleToggleButton, "build", null);
    exports.default = MapStyleToggleButton;
});