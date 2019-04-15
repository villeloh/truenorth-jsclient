define(["require", "exports", "../misc/ui-builder", "../components/components"], function (require, exports, ui_builder_1, components_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Menu = {
        DIV_ID: 'menu',
        isVisible: false,
        addTo: function (parentDiv) {
            Menu._addMapStyleToggleButtons(parentDiv);
            Menu._addCyclingLayerToggleButton(parentDiv);
            Menu._addTravelModeToggleButton(parentDiv);
            Menu._addSpeedInput(parentDiv);
        },
        _addMapStyleToggleButtons: function (parentDiv) {
            components_1.MapStyleToggleButton.addTo(parentDiv, components_1.MapStyleToggleButton.NORMAL_TXT);
            components_1.MapStyleToggleButton.addTo(parentDiv, components_1.MapStyleToggleButton.SAT_TXT);
            components_1.MapStyleToggleButton.addTo(parentDiv, components_1.MapStyleToggleButton.TERRAIN_TXT);
        },
        _addCyclingLayerToggleButton: function (parentDiv) {
            const buttonHolderDiv = document.createElement('div');
            buttonHolderDiv.style.marginTop = '20%';
            components_1.CyclingLayerToggleButton.addTo(buttonHolderDiv);
            parentDiv.appendChild(buttonHolderDiv);
            setTimeout(() => {
                components_1.CyclingLayerToggleButton.setInitialStyles();
            }, 50);
        },
        _addTravelModeToggleButton: function (parentDiv) {
            const buttonHolderDiv = document.createElement('div');
            components_1.TravelModeToggleButton.addTo(buttonHolderDiv);
            parentDiv.appendChild(buttonHolderDiv);
        },
        _addSpeedInput: function (parentDiv) {
            const holderDiv = document.createElement('div');
            components_1.SpeedInput.addTo(holderDiv);
            parentDiv.appendChild(holderDiv);
        },
        toggleVisibility: (event) => {
            const menuBtnTextHolderDiv = event.target;
            if (Menu.isVisible) {
                Menu.isVisible = false;
                ui_builder_1.default.removeElement(Menu.DIV_ID);
                menuBtnTextHolderDiv.textContent = components_1.MenuButton.CLOSED_SYMBOL;
                menuBtnTextHolderDiv.style.fontSize = '26px';
            }
            else {
                Menu.isVisible = true;
                ui_builder_1.default.addMenu();
                menuBtnTextHolderDiv.textContent = components_1.MenuButton.OPEN_SYMBOL;
                menuBtnTextHolderDiv.style.fontSize = '20px';
            }
        }
    };
    exports.default = Menu;
});
