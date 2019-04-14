define(["require", "exports", "../components/map-style-toggle-button", "../components/cycling-layer-toggle-button", "../components/travel-mode-toggle-button", "../components/speed-input", "../components/menu-button", "../misc/ui"], function (require, exports, map_style_toggle_button_1, cycling_layer_toggle_button_1, travel_mode_toggle_button_1, speed_input_1, menu_button_1, ui_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Menu = {
        DIV_ID: 'menu',
        isVisible: false,
        addTo: function (parentDiv) {
            Menu._addMapStyleToggleButtons(parentDiv);
            Menu._addCyclingLayerToggleButton(parentDiv);
            Menu._addTravelModeToggleButton(parentDiv);
            Menu._addSpeedInput(parentDiv);
        },
        _addMapStyleToggleButtons: function (parentDiv) {
            map_style_toggle_button_1.default.addTo(parentDiv, map_style_toggle_button_1.default.NORMAL_TXT);
            map_style_toggle_button_1.default.addTo(parentDiv, map_style_toggle_button_1.default.SAT_TXT);
            map_style_toggle_button_1.default.addTo(parentDiv, map_style_toggle_button_1.default.TERRAIN_TXT);
        },
        _addCyclingLayerToggleButton: function (parentDiv) {
            var buttonHolderDiv = document.createElement('div');
            buttonHolderDiv.style.marginTop = '20%';
            cycling_layer_toggle_button_1.default.addTo(buttonHolderDiv);
            parentDiv.appendChild(buttonHolderDiv);
            setTimeout(function () {
                cycling_layer_toggle_button_1.default.setInitialStyles();
            }, 50);
        },
        _addTravelModeToggleButton: function (parentDiv) {
            var buttonHolderDiv = document.createElement('div');
            travel_mode_toggle_button_1.default.addTo(buttonHolderDiv);
            parentDiv.appendChild(buttonHolderDiv);
        },
        _addSpeedInput: function (parentDiv) {
            var holderDiv = document.createElement('div');
            speed_input_1.default.addTo(holderDiv);
            parentDiv.appendChild(holderDiv);
        },
        toggleVisibility: function (event) {
            var menuBtnTextHolderDiv = event.target;
            if (Menu.isVisible) {
                Menu.isVisible = false;
                ui_1.default.removeElement(Menu.DIV_ID);
                menuBtnTextHolderDiv.textContent = menu_button_1.default.CLOSED_SYMBOL;
                menuBtnTextHolderDiv.style.fontSize = '26px';
            }
            else {
                Menu.isVisible = true;
                ui_1.default.addMenu();
                menuBtnTextHolderDiv.textContent = menu_button_1.default.OPEN_SYMBOL;
                menuBtnTextHolderDiv.style.fontSize = '20px';
            }
        }
    };
    exports.default = Menu;
});
