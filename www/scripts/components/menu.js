var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "../misc/ui-builder", "../components/components", "../app", "./base-abstract/ui-element", "../misc/annotations"], function (require, exports, ui_builder_1, components_1, app_1, ui_element_1, annotations_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Menu extends ui_element_1.default {
        static build() {
            const parentDiv = document.createElement('div');
            Menu._addMapStyleToggleButtons(parentDiv);
            Menu._addCyclingLayerToggleButton(parentDiv);
            Menu._addTravelModeToggleButton(parentDiv);
            Menu._addSpeedChooser(parentDiv);
            parentDiv.addEventListener('click', function (e) {
                e.stopPropagation();
            });
            return parentDiv;
        }
        static _addMapStyleToggleButtons(parentDiv) {
            const normBtn = components_1.MapStyleToggleButton.build(app_1.default.onMapStyleToggleButtonClick, components_1.MapStyleToggleButton.NORMAL_TXT);
            const satBtn = components_1.MapStyleToggleButton.build(app_1.default.onMapStyleToggleButtonClick, components_1.MapStyleToggleButton.SAT_TXT);
            const terrainBtn = components_1.MapStyleToggleButton.build(app_1.default.onMapStyleToggleButtonClick, components_1.MapStyleToggleButton.TERRAIN_TXT);
            parentDiv.append(normBtn, satBtn, terrainBtn);
        }
        static _addCyclingLayerToggleButton(parentDiv) {
            const buttonHolderDiv = document.createElement('div');
            buttonHolderDiv.style.marginTop = '20%';
            const cyclingLayerBtn = components_1.CyclingLayerToggleButton.build(app_1.default.onCyclingLayerToggleButtonClick);
            buttonHolderDiv.appendChild(cyclingLayerBtn);
            parentDiv.appendChild(buttonHolderDiv);
            setTimeout(() => {
                components_1.CyclingLayerToggleButton.setInitialStyles(app_1.default.mapService.bikeLayerOn);
            }, 50);
        }
        static _addTravelModeToggleButton(parentDiv) {
            const buttonHolderDiv = document.createElement('div');
            const toggleBtn = components_1.TravelModeToggleButton.build(app_1.default.onTravelModeToggleButtonClick);
            buttonHolderDiv.appendChild(toggleBtn);
            parentDiv.appendChild(buttonHolderDiv);
        }
        static _addSpeedChooser(parentDiv) {
            const speedChooser = components_1.SpeedChooser.build(app_1.default.onSpeedChooserValueChange);
            parentDiv.appendChild(speedChooser);
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
    __decorate([
        annotations_1.override
    ], Menu, "build", null);
    exports.default = Menu;
});
