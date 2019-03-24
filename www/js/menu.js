
/**
 * Make the main right hand corner menu (containing the map type controls etc).
 */

const Menu = {

  DIV_ID: 'menu',

  make: function(parentDiv) {

    Menu._addMapStyleToggleButtons(parentDiv);
  }, // make

  _addMapStyleToggleButtons: function (parentDiv) {
    
    MapStyleToggleButton.make(parentDiv, 'NORMAL', GoogleMap.MAP_TYPE.NORMAL, GoogleMap.onMapStyleToggleButtonClick);
    MapStyleToggleButton.make(parentDiv, 'SAT.', GoogleMap.MAP_TYPE.SATELLITE, GoogleMap.onMapStyleToggleButtonClick);
    MapStyleToggleButton.make(parentDiv, 'TERRAIN', GoogleMap.MAP_TYPE.TERRAIN, GoogleMap.onMapStyleToggleButtonClick);
    MapStyleToggleButton.make(parentDiv, 'CYCL.', GoogleMap.MAP_TYPE.CYCLING, GoogleMap.onMapStyleToggleButtonClick);
    // buttonHolderDiv.style.display = 'flex'; // to spread the buttons out horizontally
    // buttonHolderDiv.style.justifyContent = 'space-evenly';
    // buttonHolderDiv.style.width = '80%';
    // buttonHolderDiv.style.marginTop = '0.6rem';

  } // addMapStyleToggleButtons

}; // Menu