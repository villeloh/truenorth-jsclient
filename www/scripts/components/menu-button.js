define(["require", "exports", "../app"], function (require, exports, app_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class MenuButton {
        static build() {
            const outerDiv = document.createElement('div');
            outerDiv.id = MenuButton._OUTER_DIV_ID;
            const innerDiv = document.createElement('div');
            innerDiv.id = MenuButton._INNER_DIV_ID;
            innerDiv.innerHTML = MenuButton.CLOSED_SYMBOL;
            outerDiv.addEventListener('click', app_1.default.onMenuButtonClick);
            outerDiv.appendChild(innerDiv);
            return outerDiv;
        }
    }
    MenuButton.CLOSED_SYMBOL = 'ˇ';
    MenuButton.OPEN_SYMBOL = '^';
    MenuButton._OUTER_DIV_ID = 'menu-btn-outer';
    MenuButton._INNER_DIV_ID = 'menu-btn-inner';
    exports.default = MenuButton;
});
