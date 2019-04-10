/**
 * Make the main right hand corner menu (containing the map type controls etc).
 */
var _this = this;
var Menu = {
    DIV_ID: 'menu',
    isVisible: false,
    addTo: function (parentDiv) {
        Menu._addMapStyleToggleButtons(parentDiv);
        Menu._addCyclingLayerToggleButton(parentDiv);
        Menu._addTravelModeToggleButton(parentDiv);
        Menu._addSpeedInput(parentDiv);
    },
    // if called first, no extra holder div is needed
    _addMapStyleToggleButtons: function (parentDiv) {
        MapStyleToggleButton.addTo(parentDiv, MapStyleToggleButton.NORMAL_TXT);
        MapStyleToggleButton.addTo(parentDiv, MapStyleToggleButton.SAT_TXT);
        MapStyleToggleButton.addTo(parentDiv, MapStyleToggleButton.TERRAIN_TXT);
    },
    _addCyclingLayerToggleButton: function (parentDiv) {
        var buttonHolderDiv = document.createElement('div');
        buttonHolderDiv.style.marginTop = '20%'; // separate it from the other buttons
        CyclingLayerToggleButton.addTo(buttonHolderDiv);
        parentDiv.appendChild(buttonHolderDiv);
        // this call is needed to 'remember' the state of the cycling layer button on each menu recreation...
        // not ideal and should be fixed; the menu's visibility should be altered instead of destroying or
        // recreating it with every click.
        setTimeout(function () {
            CyclingLayerToggleButton.setInitialStyles(); // wait for the DOM to update...
        }, 50);
    },
    _addTravelModeToggleButton: function (parentDiv) {
        // we need a holder div because otherwise the .innerHTML assignment in addTo() erases all other menu items
        var buttonHolderDiv = document.createElement('div');
        TravelModeToggleButton.addTo(buttonHolderDiv);
        parentDiv.appendChild(buttonHolderDiv);
    },
    _addSpeedInput: function (parentDiv) {
        var holderDiv = document.createElement('div');
        SpeedInput.addTo(holderDiv);
        parentDiv.appendChild(holderDiv);
    },
    // technically, it removes / recreates the menu with each click.
    // this is needed because zoom events 'reset' the map, which makes 
    // the menu become visible with each zoom if it's present in the DOM.
    toggleVisibility: function (event) {
        var menuBtnTextHolderDiv = event.target;
        if (_this.isVisible) {
            _this.isVisible = false;
            UI.removeElement(Menu.DIV_ID);
            menuBtnTextHolderDiv.textContent = MenuButton.CLOSED_SYMBOL;
            menuBtnTextHolderDiv.style.fontSize = '26px'; // the symbols for the open and closed menu are of different sizes in the same font, so the other one has to be made larger
        }
        else {
            _this.isVisible = true;
            UI.addMenu();
            menuBtnTextHolderDiv.textContent = MenuButton.OPEN_SYMBOL;
            menuBtnTextHolderDiv.style.fontSize = '20px';
        } // if-else
    } // toggleVisibility
}; // Menu
