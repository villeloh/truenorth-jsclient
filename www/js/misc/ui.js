/**
 * For adding elements to the custom UI. The UI logic is contained elsewhere, in the relevant files.
 */

const UI = {

  init: function() {

    this._addLocationButton();
    this._addMenuButton();
    this._addMenu();
  },

  _addMenuButton: function() {

    const buttonHolderDiv = document.createElement('div');
    // buttonHolderDiv.id = MenuButton.DIV_ID; // it seems like it can just be an invisible holder, so no id is needed
    buttonHolderDiv.style.margin = '2.5%';
    MenuButton.make(buttonHolderDiv, GoogleMap.onMenuButtonClick);
    GoogleMap.addUIControl(App.google.maps.ControlPosition.TOP_RIGHT, buttonHolderDiv);
  },

  _addMenu: function() {

    const menuHolderDiv = document.createElement('div');
    menuHolderDiv.id = Menu.DIV_ID;
    menuHolderDiv.style.marginRight = '2.5%';
    menuHolderDiv.style.display = 'none';
    menuHolderDiv.style.flexDirection = 'column';
    menuHolderDiv.style.width = '30%';
    menuHolderDiv.style.alignItems = 'flex-end';
    menuHolderDiv.style.marginTop = '20%';
    menuHolderDiv.style.marginBottom = '75%'; // gets overridden on initial load... why tf ???
    Menu.make(menuHolderDiv);
    GoogleMap.addUIControl(App.google.maps.ControlPosition.RIGHT_CENTER, menuHolderDiv);
  }, // _addMenu

  // adds a custom ui button for recentering the map at the user's location
  _addLocationButton: function() {

    const buttonHolderDiv = document.createElement('div');
    LocationButton.make(buttonHolderDiv, GoogleMap.onLocButtonClick);

    // buttonHolderDiv.index = 1; // wtf does this do ?? is it the same as z-index ?
    GoogleMap.addUIControl(App.google.maps.ControlPosition.RIGHT_BOTTOM, buttonHolderDiv);
  }

}; // UI