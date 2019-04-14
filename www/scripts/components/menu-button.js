define(["require", "exports", "../app"], function (require, exports, app_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var MenuButton = {
        CLOSED_SYMBOL: 'ˇ',
        OPEN_SYMBOL: '^',
        _OUTER_DIV_ID: 'menu-btn-outer',
        _INNER_DIV_ID: 'menu-btn-inner',
        addTo: function (parentDiv) {
            var outerDiv = document.createElement('div');
            outerDiv.id = MenuButton._OUTER_DIV_ID;
            var innerDiv = document.createElement('div');
            innerDiv.id = MenuButton._INNER_DIV_ID;
            innerDiv.innerHTML = MenuButton.CLOSED_SYMBOL;
            outerDiv.addEventListener('click', app_1.default.onMenuButtonClick);
            outerDiv.appendChild(innerDiv);
            parentDiv.appendChild(outerDiv);
        }
    };
    exports.default = MenuButton;
});
