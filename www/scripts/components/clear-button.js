define(["require", "exports", "../app"], function (require, exports, app_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class ClearButton {
        static build() {
            const outerDiv = document.createElement('div');
            outerDiv.id = ClearButton._OUTER_DIV_ID;
            const innerDiv = document.createElement('div');
            innerDiv.id = ClearButton._INNER_DIV_ID;
            innerDiv.innerHTML = ClearButton._TEXT;
            outerDiv.appendChild(innerDiv);
            outerDiv.addEventListener('click', app_1.default.onClearButtonClick);
            return outerDiv;
        }
    }
    ClearButton._OUTER_DIV_ID = 'clear-btn-outer';
    ClearButton._INNER_DIV_ID = 'clear-btn-inner';
    ClearButton._TEXT = 'CLEAR';
    exports.default = ClearButton;
});
