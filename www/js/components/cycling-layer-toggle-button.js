
/**
 * Button that toggles the cycling layer off/on. It's different from the MapStyleToggleButtons, because 
 * the cycling layer can be applied on top of them.
 */

const CyclingLayerToggleButton = {

  BORDER_ON: '2px solid green',
  BORDER_OFF: '2px solid #808080',
  BG_COLOR_ON: '#7CFFAC',
  BG_COLOR_OFF: '#fff',

  OUTER_DIV_ID: 'cyc-layer-btn-outer',
  INNER_DIV_ID: 'cyc-layer-btn-inner',

  TEXT: 'C.LAYER',

  addTo: function(parentDiv, mapService) {

    CyclingLayerToggleButton.mapService = mapService;

    parentDiv.innerHTML = `<div id=${CyclingLayerToggleButton.OUTER_DIV_ID} onclick="CyclingLayerToggleButton.mapService.onCyclingLayerToggleButtonClick(event)">
    <div id=${CyclingLayerToggleButton.INNER_DIV_ID}>${CyclingLayerToggleButton.TEXT}</div></div>`;
  }

}; // CyclingLayerToggleButton