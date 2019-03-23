/**
 * For adding elements to the custom UI. The UI logic is contained elsewhere, in the relevant files.
 */

const UI = {

  init: function() {

    this._addLocationButton();
    this._addMapStyleToggleButtons();
  },

  // adds a custom ui button for recentering the map at the user's location
  _addLocationButton: function() {

    const buttonHolderDiv = document.createElement('div');
    LocationButton.make(buttonHolderDiv, GoogleMap.onLocButtonClick);

    // buttonHolderDiv.index = 1; // wtf does this do ?? is it the same as z-index ?
    GoogleMap.addUIControl(App.google.maps.ControlPosition.RIGHT_BOTTOM, buttonHolderDiv);
  },

  _addMapStyleToggleButtons: function () {
    
    const buttonHolderDiv = document.createElement('div');
    MapStyleToggleButton.make(buttonHolderDiv, 'NORMAL', GoogleMap.MAP_TYPE.NORMAL, GoogleMap.onMapStyleToggleButtonClick);
    MapStyleToggleButton.make(buttonHolderDiv, 'SAT.', GoogleMap.MAP_TYPE.SATELLITE, GoogleMap.onMapStyleToggleButtonClick);
    MapStyleToggleButton.make(buttonHolderDiv, 'TERRAIN', GoogleMap.MAP_TYPE.TERRAIN, GoogleMap.onMapStyleToggleButtonClick);
    MapStyleToggleButton.make(buttonHolderDiv, 'CYCL.', GoogleMap.MAP_TYPE.CYCLING, GoogleMap.onMapStyleToggleButtonClick);
    buttonHolderDiv.style.display = 'flex'; // to spread the buttons out horizontally
    buttonHolderDiv.style.justifyContent = 'space-evenly';
    buttonHolderDiv.style.width = '80%';
    buttonHolderDiv.style.marginTop = '0.6rem';

    GoogleMap.addUIControl(App.google.maps.ControlPosition.TOP_CENTER, buttonHolderDiv);
  } // addMapStyleToggleButtons

}; // UI