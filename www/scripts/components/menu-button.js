define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var MenuButton = {
        CLOSED_SYMBOL: 'ˇ',
        OPEN_SYMBOL: '^',
        _OUTER_DIV_ID: 'menu-btn-outer',
        _INNER_DIV_ID: 'menu-btn-inner',
        addTo: function (parentDiv) {
            parentDiv.innerHTML += "<div id=" + MenuButton._OUTER_DIV_ID + " onclick=\"App.onMenuButtonClick(event)\">\n      <div id=" + MenuButton._INNER_DIV_ID + ">" + MenuButton.CLOSED_SYMBOL + "</div>\n    </div>";
        }
    };
    exports.default = MenuButton;
});
