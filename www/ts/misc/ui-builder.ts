import App from '../app';
import { InfoHeader, MenuButton, LocationButton, Menu, ClearButton } from '../components/components';

/**
 * For adding elements to the custom UI. The UI logic is contained elsewhere, in the relevant files.
 */

const UIBuilder = {

  buildUI: function(): void {

    this._addLocationButton();
    this._addMenuButton();
    // this._addMenu(); // added from GoogleMap now, due to some issues with menu visibility
    this._addInfoHeader();
    this._addClearButton();
  }, // init

  _addMenuButton: function(): void {

    const buttonHolderDiv = document.createElement('div');
    // buttonHolderDiv.id = MenuButton.DIV_ID; // it seems like it can just be an invisible holder, so no id is needed
    buttonHolderDiv.style.margin = '2.5%';
    MenuButton.addTo(buttonHolderDiv);
    
    App.mapService.addUIControl(App.google.maps.ControlPosition.TOP_RIGHT, buttonHolderDiv);
  },

  // called from App on each menu button click, as due to some visibility issues the menu has to be recreated
  // from scratch with each click of the menu button
  addMenu: function(): void {

    const menuHolderDiv = document.createElement('div');
    menuHolderDiv.id = Menu.DIV_ID;
    menuHolderDiv.style.marginRight = '2.5%';
    menuHolderDiv.style.display = 'flex';
    menuHolderDiv.style.flexDirection = 'column';
    menuHolderDiv.style.width = '30%';
    menuHolderDiv.style.alignItems = 'flex-end';
    menuHolderDiv.style.marginTop = '20%';
    menuHolderDiv.style.marginBottom = '75%';

    Menu.addTo(menuHolderDiv);

    App.mapService.addUIControl(App.google.maps.ControlPosition.RIGHT_CENTER, menuHolderDiv);
  }, // _addMenu

  // adds a custom ui button for recentering the map at the user's location
  _addLocationButton: function(): void {

    const buttonHolderDiv = document.createElement('div');
    const locButton = LocationButton.build();
    buttonHolderDiv.appendChild(locButton);

    App.mapService.addUIControl(App.google.maps.ControlPosition.RIGHT_BOTTOM, buttonHolderDiv);
  },

  _addClearButton: function(): void {

    const buttonHolderDiv = document.createElement('div');
    buttonHolderDiv.style.margin = '2.5%';
    ClearButton.addTo(buttonHolderDiv);

    App.mapService.addUIControl(App.google.maps.ControlPosition.TOP_LEFT, buttonHolderDiv);
  },

  _addInfoHeader: function(): void {

    const holderDiv = document.createElement('div');
    holderDiv.style.width = '65%';
    holderDiv.style.height = '8%';
    holderDiv.style.marginTop = '1.5%';
    InfoHeader.addTo(holderDiv);

    App.mapService.addUIControl(App.google.maps.ControlPosition.TOP_CENTER, holderDiv);
  }, // _addInfoHeader

  removeElement: function(elementId: string): void {

    // Removes an element from the document
    const element = document.getElementById(elementId);
    element!.parentNode!.removeChild(element!);
  }

}; // UIBuilder

export default UIBuilder;