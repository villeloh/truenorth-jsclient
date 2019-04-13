define(["require", "exports"], function (require, exports) {
    "use strict";
    var _this = this;
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
            MapStyleToggleButton.addTo(parentDiv, MapStyleToggleButton.NORMAL_TXT);
            MapStyleToggleButton.addTo(parentDiv, MapStyleToggleButton.SAT_TXT);
            MapStyleToggleButton.addTo(parentDiv, MapStyleToggleButton.TERRAIN_TXT);
        },
        _addCyclingLayerToggleButton: function (parentDiv) {
            var buttonHolderDiv = document.createElement('div');
            buttonHolderDiv.style.marginTop = '20%';
            CyclingLayerToggleButton.addTo(buttonHolderDiv);
            parentDiv.appendChild(buttonHolderDiv);
            setTimeout(function () {
                CyclingLayerToggleButton.setInitialStyles();
            }, 50);
        },
        _addTravelModeToggleButton: function (parentDiv) {
            var buttonHolderDiv = document.createElement('div');
            TravelModeToggleButton.addTo(buttonHolderDiv);
            parentDiv.appendChild(buttonHolderDiv);
        },
        _addSpeedInput: function (parentDiv) {
            var holderDiv = document.createElement('div');
            SpeedInput.addTo(holderDiv);
            parentDiv.appendChild(holderDiv);
        },
        toggleVisibility: function (event) {
            var menuBtnTextHolderDiv = event.target;
            if (_this.isVisible) {
                _this.isVisible = false;
                UI.removeElement(Menu.DIV_ID);
                menuBtnTextHolderDiv.textContent = MenuButton.CLOSED_SYMBOL;
                menuBtnTextHolderDiv.style.fontSize = '26px';
            }
            else {
                _this.isVisible = true;
                UI.addMenu();
                menuBtnTextHolderDiv.textContent = MenuButton.OPEN_SYMBOL;
                menuBtnTextHolderDiv.style.fontSize = '20px';
            }
        }
    };
    exports.default = Menu;
});
