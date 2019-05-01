var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "./base-abstract/button", "../misc/annotations"], function (require, exports, button_1, annotations_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class LocationButton extends button_1.default {
        static build(onClick) {
            const outerDiv = document.createElement('div');
            outerDiv.id = LocationButton._OUTER_DIV_ID;
            const innerDiv = document.createElement('div');
            innerDiv.id = LocationButton._INNER_DIV_ID;
            outerDiv.addEventListener('click', onClick);
            outerDiv.appendChild(innerDiv);
            return outerDiv;
        }
    }
    LocationButton._OUTER_DIV_ID = 'loc-btn-outer';
    LocationButton._INNER_DIV_ID = 'loc-btn-inner';
    __decorate([
        annotations_1.override
    ], LocationButton, "build", null);
    exports.default = LocationButton;
});
