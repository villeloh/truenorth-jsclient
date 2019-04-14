define(["require", "exports", "../app"], function (require, exports, app_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var LocationButton = {
        _OUTER_DIV_ID: 'loc-btn-outer',
        _INNER_DIV_ID: 'loc-btn-inner',
        addTo: function (parentDiv) {
            var outerDiv = document.createElement('div');
            outerDiv.id = LocationButton._OUTER_DIV_ID;
            var innerDiv = document.createElement('div');
            innerDiv.id = LocationButton._INNER_DIV_ID;
            outerDiv.addEventListener('click', app_1.default.onLocButtonClick);
            outerDiv.appendChild(innerDiv);
            parentDiv.appendChild(outerDiv);
        }
    };
    exports.default = LocationButton;
});
