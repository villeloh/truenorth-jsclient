define(["require", "exports", "../misc/utils"], function (require, exports, utils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var InfoHeader = {
        _DEFAULT_DIST: '0.0 km',
        _DEFAULT_DURA: 'n/a',
        _OUTER_DIV_ID: 'info-header-outer',
        _INNER_P_ID_DIST: 'info-header-p-dist',
        _INNER_P_ID_DURA: 'info-header-p-dura',
        _INNER_P_ID_DIVISOR: 'info-header-p-divisor',
        addTo: function (parentDiv) {
            parentDiv.innerHTML = "<div id=" + InfoHeader._OUTER_DIV_ID + ">\n      <p id=" + InfoHeader._INNER_P_ID_DIST + ">" + InfoHeader._DEFAULT_DIST + "</p>\n      <p id=" + InfoHeader._INNER_P_ID_DIVISOR + ">&nbsp;|&nbsp;</p>\n      <p id=" + InfoHeader._INNER_P_ID_DURA + ">" + InfoHeader._DEFAULT_DURA + "</p>\n    <div>";
        },
        reset: function () {
            var innerDistP = document.getElementById(InfoHeader._INNER_P_ID_DIST);
            var innerDuraP = document.getElementById(InfoHeader._INNER_P_ID_DURA);
            innerDistP.textContent = InfoHeader._DEFAULT_DIST;
            innerDuraP.textContent = InfoHeader._DEFAULT_DURA;
        },
        updateDistance: function (value) {
            var innerP = document.getElementById(InfoHeader._INNER_P_ID_DIST);
            var distToDisplay = value + " km";
            innerP.textContent = distToDisplay;
        },
        updateDuration: function (valueInDecimH) {
            var innerP = document.getElementById(InfoHeader._INNER_P_ID_DURA);
            innerP.textContent = utils_1.default.formatDuration(valueInDecimH, InfoHeader._DEFAULT_DURA);
        },
    };
    exports.default = InfoHeader;
});
