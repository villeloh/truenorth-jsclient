/**
 * For adding elements to the custom UI. The UI logic is contained elsewhere, in the relevant files.
 */

const UI = {

  init: function() {

    this._addLocationButton();
    this._addMenuButton();
    // this._addMenu(); // added from GoogleMap now, due to some issues with menu visibility
    this._addInfoHeader();
  },

  _addMenuButton: function() {

    const buttonHolderDiv = document.createElement('div');
    // buttonHolderDiv.id = MenuButton.DIV_ID; // it seems like it can just be an invisible holder, so no id is needed
    buttonHolderDiv.style.margin = '2.5%';
    MenuButton.make(buttonHolderDiv, GoogleMap.onMenuButtonClick);
    GoogleMap.addUIControl(App.google.maps.ControlPosition.TOP_RIGHT, buttonHolderDiv);
  },

  // called from GoogleMap on each menu click, as due to some visibility issues the menu has to be recreated
  // from scratch with each click of the menu button
  addMenu: function() {

    const menuHolderDiv = document.createElement('div');
    menuHolderDiv.id = Menu.DIV_ID;
    menuHolderDiv.style.marginRight = '2.5%';
    menuHolderDiv.style.display = 'flex';
    menuHolderDiv.style.flexDirection = 'column';
    menuHolderDiv.style.width = '30%';
    menuHolderDiv.style.alignItems = 'flex-end';
    menuHolderDiv.style.marginTop = '20%';
    menuHolderDiv.style.marginBottom = '75%';
    Menu.make(menuHolderDiv);
    GoogleMap.addUIControl(App.google.maps.ControlPosition.RIGHT_CENTER, menuHolderDiv);
  }, // _addMenu

  // adds a custom ui button for recentering the map at the user's location
  _addLocationButton: function() {

    const buttonHolderDiv = document.createElement('div');
    LocationButton.make(buttonHolderDiv, GoogleMap.onLocButtonClick);

    // buttonHolderDiv.index = 1; // wtf does this do ?? is it the same as z-index ?
    GoogleMap.addUIControl(App.google.maps.ControlPosition.RIGHT_BOTTOM, buttonHolderDiv);
  },

  _addInfoHeader: function() {

    const holderDiv = document.createElement('div');
    holderDiv.style.width = '65%';
    holderDiv.style.height = '8%';
    holderDiv.style.marginTop = '1.5%';
    InfoHeader.make(holderDiv);
    GoogleMap.addUIControl(App.google.maps.ControlPosition.TOP_CENTER, holderDiv);
  },

  removeElement: function(elementId) {
    // Removes an element from the document
    const element = document.getElementById(elementId);
    element.parentNode.removeChild(element);
  }

}; // UI