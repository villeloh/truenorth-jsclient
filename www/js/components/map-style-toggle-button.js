/**
 * These buttons toggle the map's style (terrain / normal / satellite).
 */

const MapStyleToggleButton = {

  NORMAL_TXT: 'NORMAL',
  TERRAIN_TXT: 'TERRAIN',
  SAT_TXT: 'SAT.',

  OUTER_DIV_CLASS: 'map-style-btn-outer',
  INNER_DIV_CLASS: 'map-style-btn-inner',

  // btnTxt should be one of the types above ('NORMAL_TXT', etc)
  addTo: function(parentDiv, btnText) {

    parentDiv.innerHTML += `<div class=${MapStyleToggleButton.OUTER_DIV_CLASS} onclick="App.mapService.onMapStyleToggleButtonClick(event)">
    <div class=${MapStyleToggleButton.INNER_DIV_CLASS}>${btnText}</div></div>`;
  }
  
}; // MapStyleToggleButton