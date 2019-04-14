define(["require", "exports", "../app"], function (require, exports, app_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ClearButton = {
        _OUTER_DIV_ID: 'clear-btn-outer',
        _INNER_DIV_ID: 'clear-btn-inner',
        _TEXT: 'CLEAR',
        addTo: function (parentDiv) {
            var outerDiv = document.createElement('div');
            outerDiv.id = ClearButton._OUTER_DIV_ID;
            var innerDiv = document.createElement('div');
            innerDiv.id = ClearButton._INNER_DIV_ID;
            innerDiv.innerHTML = ClearButton._TEXT;
            outerDiv.appendChild(innerDiv);
            outerDiv.addEventListener('click', app_1.default.onClearButtonClick);
            parentDiv.appendChild(outerDiv);
        }
    };
    exports.default = ClearButton;
});
