define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ClearButton = {
        _OUTER_DIV_ID: 'clear-btn-outer',
        _INNER_DIV_ID: 'clear-btn-inner',
        _TEXT: 'CLEAR',
        addTo: function (parentDiv) {
            parentDiv.innerHTML = "<div id=" + ClearButton._OUTER_DIV_ID + " onclick=\"App.onClearButtonClick()\">\n      <div id=" + ClearButton._INNER_DIV_ID + ">" + ClearButton._TEXT + "</div>\n    </div>";
        }
    };
    exports.default = ClearButton;
});
