define(["require", "exports", "../app"], function (require, exports, app_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class LocationButton {
        static build() {
            const outerDiv = document.createElement('div');
            outerDiv.id = LocationButton._OUTER_DIV_ID;
            const innerDiv = document.createElement('div');
            innerDiv.id = LocationButton._INNER_DIV_ID;
            outerDiv.addEventListener('click', app_1.default.onLocButtonClick);
            outerDiv.appendChild(innerDiv);
            return outerDiv;
        }
    }
    LocationButton._OUTER_DIV_ID = 'loc-btn-outer';
    LocationButton._INNER_DIV_ID = 'loc-btn-inner';
    exports.default = LocationButton;
});
