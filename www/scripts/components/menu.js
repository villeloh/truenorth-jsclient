define(["require", "exports", "../misc/ui-builder", "../components/components"], function (require, exports, ui_builder_1, components_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Menu {
        static build() {
            const parentDiv = document.createElement('div');
            Menu._addMapStyleToggleButtons(parentDiv);
            Menu._addCyclingLayerToggleButton(parentDiv);
            Menu._addTravelModeToggleButton(parentDiv);
            Menu._addSpeedInput(parentDiv);
            return parentDiv;
        }
        static _addMapStyleToggleButtons(parentDiv) {
            const normBtn = components_1.MapStyleToggleButton.build(components_1.MapStyleToggleButton.NORMAL_TXT);
            const satBtn = components_1.MapStyleToggleButton.build(components_1.MapStyleToggleButton.SAT_TXT);
            const terrainBtn = components_1.MapStyleToggleButton.build(components_1.MapStyleToggleButton.TERRAIN_TXT);
            parentDiv.append(normBtn, satBtn, terrainBtn);
        }
        static _addCyclingLayerToggleButton(parentDiv) {
            const buttonHolderDiv = document.createElement('div');
            buttonHolderDiv.style.marginTop = '20%';
            const cyclingLayerBtn = components_1.CyclingLayerToggleButton.build();
            buttonHolderDiv.appendChild(cyclingLayerBtn);
            parentDiv.appendChild(buttonHolderDiv);
            setTimeout(() => {
                components_1.CyclingLayerToggleButton.setInitialStyles();
            }, 50);
        }
        static _addTravelModeToggleButton(parentDiv) {
            const buttonHolderDiv = document.createElement('div');
            const toggleBtn = components_1.TravelModeToggleButton.build();
            buttonHolderDiv.appendChild(toggleBtn);
            parentDiv.appendChild(buttonHolderDiv);
        }
        static _addSpeedInput(parentDiv) {
            const holderDiv = document.createElement('div');
            const speedInput = components_1.SpeedInput.build();
            holderDiv.appendChild(speedInput);
            parentDiv.appendChild(holderDiv);
        }
        static toggleVisibility(event) {
            const menuBtnTextHolderDiv = event.target;
            if (Menu._isVisible) {
                Menu._isVisible = false;
                ui_builder_1.default.removeElement(Menu.DIV_ID);
                menuBtnTextHolderDiv.textContent = components_1.MenuButton.CLOSED_SYMBOL;
                menuBtnTextHolderDiv.style.fontSize = '26px';
            }
            else {
                Menu._isVisible = true;
                ui_builder_1.default.addMenu();
                menuBtnTextHolderDiv.textContent = components_1.MenuButton.OPEN_SYMBOL;
                menuBtnTextHolderDiv.style.fontSize = '20px';
            }
        }
    }
    Menu.DIV_ID = 'menu';
    Menu._isVisible = false;
    exports.default = Menu;
});
