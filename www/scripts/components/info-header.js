var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../misc/utils", "../misc/annotations", "./base-abstract/ui-element"], function (require, exports, utils_1, annotations_1, ui_element_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class InfoHeader extends ui_element_1.default {
        static build() {
            const outerDiv = document.createElement('div');
            outerDiv.id = InfoHeader._OUTER_DIV_ID;
            const p1 = document.createElement('p');
            p1.id = InfoHeader._INNER_P_ID_DIST;
            p1.innerHTML = InfoHeader._DEFAULT_DIST;
            const p2 = document.createElement('p');
            p2.id = InfoHeader._INNER_P_ID_DIVISOR;
            p2.innerHTML = '&nbsp;|&nbsp;';
            const p3 = document.createElement('p');
            p3.id = InfoHeader._INNER_P_ID_DURA;
            p3.innerHTML = InfoHeader._DEFAULT_DURA;
            outerDiv.append(p1, p2, p3);
            return outerDiv;
        }
        static reset() {
            const innerDistP = document.getElementById(InfoHeader._INNER_P_ID_DIST);
            const innerDuraP = document.getElementById(InfoHeader._INNER_P_ID_DURA);
            innerDistP.textContent = InfoHeader._DEFAULT_DIST;
            innerDuraP.textContent = InfoHeader._DEFAULT_DURA;
        }
        static updateDistance(value) {
            const innerP = document.getElementById(InfoHeader._INNER_P_ID_DIST);
            const distToDisplay = `${value} km`;
            innerP.textContent = distToDisplay;
        }
        static updateDuration(valueInDecimH) {
            const innerP = document.getElementById(InfoHeader._INNER_P_ID_DURA);
            innerP.textContent = utils_1.default.formatDuration(valueInDecimH, InfoHeader._DEFAULT_DURA);
        }
    }
    InfoHeader._DEFAULT_DIST = '0.0 km';
    InfoHeader._DEFAULT_DURA = 'n/a';
    InfoHeader._OUTER_DIV_ID = 'info-header-outer';
    InfoHeader._INNER_P_ID_DIST = 'info-header-p-dist';
    InfoHeader._INNER_P_ID_DURA = 'info-header-p-dura';
    InfoHeader._INNER_P_ID_DIVISOR = 'info-header-p-divisor';
    __decorate([
        annotations_1.override
    ], InfoHeader, "build", null);
    exports.default = InfoHeader;
});
