import App from '../app';

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

  addTo: function(parentDiv: any) {

    const outerDiv = document.createElement('div');
    outerDiv.id = CyclingLayerToggleButton.OUTER_DIV_ID;
    const innerDiv = document.createElement('div');
    innerDiv.id = CyclingLayerToggleButton.INNER_DIV_ID;
    innerDiv.innerHTML = CyclingLayerToggleButton.TEXT;
    outerDiv.addEventListener('click', App.onCyclingLayerToggleButtonClick);
    outerDiv.appendChild(innerDiv);
    parentDiv.appendChild(outerDiv);
/*
    parentDiv.innerHTML = `<div id=${CyclingLayerToggleButton.OUTER_DIV_ID} onclick="App.onCyclingLayerToggleButtonClick(event)">
    <div id=${CyclingLayerToggleButton.INNER_DIV_ID}>${CyclingLayerToggleButton.TEXT}</div></div>`; */
  },

  // called when recreating the menu; it's a way to 'recall' its correct state after destruction
  setInitialStyles: function() {

    const toggleBtn = document.getElementById(CyclingLayerToggleButton.OUTER_DIV_ID);

    if (App.mapService.bikeLayerOn) {

      CyclingLayerToggleButton.applyOnStyles(toggleBtn);
    } else {

      CyclingLayerToggleButton.applyOffStyles(toggleBtn);
    } // if-else
  }, // setInitialStyles

  applyOffStyles: function(buttonDiv: any) {

    buttonDiv.style.backgroundColor = CyclingLayerToggleButton.BG_COLOR_OFF;
    buttonDiv.style.border = CyclingLayerToggleButton.BORDER_OFF;
  },

  applyOnStyles: function(buttonDiv: any) {

    buttonDiv.style.backgroundColor = CyclingLayerToggleButton.BG_COLOR_ON;
    buttonDiv.style.border = CyclingLayerToggleButton.BORDER_ON;
  }

}; // CyclingLayerToggleButton

export default CyclingLayerToggleButton;