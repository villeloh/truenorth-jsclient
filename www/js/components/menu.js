
/**
 * Make the main right hand corner menu (containing the map type controls etc).
 */

const Menu = {

  DIV_ID: 'menu',

  make: function(parentDiv) {

    Menu._addMapStyleToggleButtons(parentDiv);
    Menu._addCyclingLayerToggleButton(parentDiv);
    Menu._addWalkingCyclingToggleButton(parentDiv);
    Menu._addSpeedInput(parentDiv);
  }, // make

  _addMapStyleToggleButtons: function (parentDiv) {
    
    MapStyleToggleButton.make(parentDiv, MapStyleToggleButton.NORMAL_TXT, GoogleMap.MAP_TYPE.NORMAL, GoogleMap.onMapStyleToggleButtonClick);
    MapStyleToggleButton.make(parentDiv, MapStyleToggleButton.SAT_TXT, GoogleMap.MAP_TYPE.SATELLITE, GoogleMap.onMapStyleToggleButtonClick);
    MapStyleToggleButton.make(parentDiv, MapStyleToggleButton.TERRAIN_TXT, GoogleMap.MAP_TYPE.TERRAIN, GoogleMap.onMapStyleToggleButtonClick);
  }, // addMapStyleToggleButtons

  _addCyclingLayerToggleButton: function(parentDiv) {

    /*
    const buttonHolderDiv = document.createElement('div');
    // buttonHolderDiv.id = CyclingLayerToggleButton.DIV_ID;
    buttonHolderDiv.style.marginTop = '20%'; // separate it from the other buttons
    parentDiv.appendChild(buttonHolderDiv); */
    CyclingLayerToggleButton.make(parentDiv, CyclingLayerToggleButton.TEXT, GoogleMap.onCyclingLayerToggleButtonClick);
  },

  _addWalkingCyclingToggleButton: function(parentDiv) {

    WalkingCyclingToggleButton.make(parentDiv);
  },

  _addSpeedInput: function(parentDiv) {

    SpeedInput.make(parentDiv);
  }

}; // Menu