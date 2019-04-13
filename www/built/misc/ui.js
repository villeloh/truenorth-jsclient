define(["require", "exports", "../app", "../components/menu-button", "../components/menu", "../components/location-button", "../components/info-header", "../components/clear-button"], function (require, exports, app_1, menu_button_1, menu_1, location_button_1, info_header_1, clear_button_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var UI = {
        mapService: null,
        init: function () {
            this._addLocationButton();
            this._addMenuButton();
            this._addInfoHeader();
            this._addClearButton();
        },
        _addMenuButton: function () {
            var buttonHolderDiv = document.createElement('div');
            buttonHolderDiv.style.margin = '2.5%';
            menu_button_1.default.addTo(buttonHolderDiv);
            app_1.default.mapService.addUIControl(app_1.default.google.maps.ControlPosition.TOP_RIGHT, buttonHolderDiv);
        },
        addMenu: function () {
            var menuHolderDiv = document.createElement('div');
            menuHolderDiv.id = menu_1.default.DIV_ID;
            menuHolderDiv.style.marginRight = '2.5%';
            menuHolderDiv.style.display = 'flex';
            menuHolderDiv.style.flexDirection = 'column';
            menuHolderDiv.style.width = '30%';
            menuHolderDiv.style.alignItems = 'flex-end';
            menuHolderDiv.style.marginTop = '20%';
            menuHolderDiv.style.marginBottom = '75%';
            menu_1.default.addTo(menuHolderDiv);
            app_1.default.mapService.addUIControl(app_1.default.google.maps.ControlPosition.RIGHT_CENTER, menuHolderDiv);
        },
        _addLocationButton: function () {
            var buttonHolderDiv = document.createElement('div');
            location_button_1.default.addTo(buttonHolderDiv);
            app_1.default.mapService.addUIControl(app_1.default.google.maps.ControlPosition.RIGHT_BOTTOM, buttonHolderDiv);
        },
        _addClearButton: function () {
            var buttonHolderDiv = document.createElement('div');
            buttonHolderDiv.style.margin = '2.5%';
            clear_button_1.default.addTo(buttonHolderDiv);
            app_1.default.mapService.addUIControl(app_1.default.google.maps.ControlPosition.TOP_LEFT, buttonHolderDiv);
        },
        _addInfoHeader: function () {
            var holderDiv = document.createElement('div');
            holderDiv.style.width = '65%';
            holderDiv.style.height = '8%';
            holderDiv.style.marginTop = '1.5%';
            info_header_1.default.addTo(holderDiv);
            app_1.default.mapService.addUIControl(app_1.default.google.maps.ControlPosition.TOP_CENTER, holderDiv);
        },
        removeElement: function (elementId) {
            var element = document.getElementById(elementId);
            element.parentNode.removeChild(element);
        }
    };
    exports.default = UI;
});
