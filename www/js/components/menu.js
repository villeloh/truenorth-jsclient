
/**
 * Make the main right hand corner menu (containing the map type controls etc).
 */

const Menu = {

  DIV_ID: 'menu',

  mapService: null,

  addTo: function(parentDiv, mapService) {

    this.mapService = mapService;

    Menu._addMapStyleToggleButtons(parentDiv);
    Menu._addCyclingLayerToggleButton(parentDiv);
    Menu._addTravelModeToggleButton(parentDiv);
    Menu._addSpeedInput(parentDiv);
  }, // make

  // if called first, no extra holder div is needed
  _addMapStyleToggleButtons: function (parentDiv) {
    
    MapStyleToggleButton.addTo(parentDiv, MapStyleToggleButton.NORMAL_TXT, this.mapService);
    MapStyleToggleButton.addTo(parentDiv, MapStyleToggleButton.SAT_TXT, this.mapService);
    MapStyleToggleButton.addTo(parentDiv, MapStyleToggleButton.TERRAIN_TXT, this.mapService);
  }, // addMapStyleToggleButtons

  _addCyclingLayerToggleButton: function(parentDiv) {
    
    const buttonHolderDiv = document.createElement('div');
    buttonHolderDiv.style.marginTop = '20%'; // separate it from the other buttons
    CyclingLayerToggleButton.addTo(buttonHolderDiv, this.mapService);
    parentDiv.appendChild(buttonHolderDiv);

    // this call is needed to 'remember' the state of the cycling layer button on each menu recreation...
    // not ideal and should be fixed; the menu's visibility should be altered instead of destroying or
    // recreating it with every click.
    setTimeout(() => {
      
      this.mapService.setInitialCyclingLayerToggleButtonStyles(); // wait for the DOM to update...
    }, 50);
  }, // _addCyclingLayerToggleButton

  _addTravelModeToggleButton: function(parentDiv) {

    // we need a holder div because otherwise the .innerHTML assignment in addTo() erases all other menu items
    const buttonHolderDiv = document.createElement('div'); 
    TravelModeToggleButton.addTo(buttonHolderDiv, this.mapService);
    parentDiv.appendChild(buttonHolderDiv);
  },

  _addSpeedInput: function(parentDiv) {

    const holderDiv = document.createElement('div');
    SpeedInput.addTo(holderDiv, this.mapService);
    parentDiv.appendChild(holderDiv);
  }

}; // Menu