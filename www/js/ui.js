/**
 * For adding elements to the custom UI. The UI logic is contained elsewhere, in the relevant files.
 */

const UI = {

  init: function() {

    this._addLocationButton();
    this._addMenuButton();
    this._addMenu();
    // this._addMapStyleToggleButtons();
  },

  _addMenuButton: function() {

    const buttonHolderDiv = document.createElement('div');
    buttonHolderDiv.id = MenuButton.DIV_ID;
    buttonHolderDiv.style.margin = '2.5%';
    MenuButton.make(buttonHolderDiv, GoogleMap.onMenuButtonClick);
    GoogleMap.addUIControl(App.google.maps.ControlPosition.TOP_RIGHT, buttonHolderDiv);
  },

  _addMenu: function() {

    const menuHolderDiv = document.createElement('div');
    menuHolderDiv.id = Menu.DIV_ID;
    menuHolderDiv.style.marginBottom = '75%';
    menuHolderDiv.style.marginRight = '2.5%';
    // TODO: style the parent div appropriately to hold the buttons in it vertically
    Menu.make(menuHolderDiv);
    GoogleMap.addUIControl(App.google.maps.ControlPosition.RIGHT_CENTER, menuHolderDiv);
  },

  // adds a custom ui button for recentering the map at the user's location
  _addLocationButton: function() {

    const buttonHolderDiv = document.createElement('div');
    LocationButton.make(buttonHolderDiv, GoogleMap.onLocButtonClick);

    // buttonHolderDiv.index = 1; // wtf does this do ?? is it the same as z-index ?
    GoogleMap.addUIControl(App.google.maps.ControlPosition.RIGHT_BOTTOM, buttonHolderDiv);
  }

}; // UI