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
            var outerDiv = document.createElement('div');
            var p1 = document.createElement('p');
            p1.id = InfoHeader._INNER_P_ID_DIST;
            p1.innerHTML = InfoHeader._DEFAULT_DIST;
            var p2 = document.createElement('p');
            p2.id = InfoHeader._INNER_P_ID_DIVISOR;
            p2.innerHTML = '&nbsp;|&nbsp;';
            var p3 = document.createElement('p');
            p3.id = InfoHeader._INNER_P_ID_DURA;
            p3.innerHTML = InfoHeader._DEFAULT_DURA;
            outerDiv.append(p1, p2, p3);
            parentDiv.appendChild(outerDiv);
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
