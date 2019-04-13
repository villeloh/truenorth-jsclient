define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var LocationButton = {
        _OUTER_DIV_ID: 'loc-btn-outer',
        _INNER_DIV_ID: 'loc-btn-inner',
        addTo: function (parentDiv) {
            parentDiv.innerHTML = "<div id=" + LocationButton._OUTER_DIV_ID + " onclick=\"App.onLocButtonClick()\">\n    <div id=" + LocationButton._INNER_DIV_ID + "></div></div>";
        }
    };
    exports.default = LocationButton;
});
