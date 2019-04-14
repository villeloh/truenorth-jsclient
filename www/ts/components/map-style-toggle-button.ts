import App from '../app';

/**
 * These buttons toggle the map's style (terrain / normal / satellite).
 */

const MapStyleToggleButton = {

  NORMAL_TXT: 'NORMAL',
  TERRAIN_TXT: 'TERRAIN',
  SAT_TXT: 'SAT.',

  OUTER_DIV_CLASS: 'map-style-btn-outer',
  INNER_DIV_CLASS: 'map-style-btn-inner',

  // btnTxt should be one of the texts above ('NORMAL_TXT', etc)
  addTo: function(parentDiv: any, btnText: string) {

    
    const outerDiv = document.createElement('div');
    outerDiv.className = MapStyleToggleButton.OUTER_DIV_CLASS;

    const innerDiv = document.createElement('div');
    innerDiv.className = MapStyleToggleButton.INNER_DIV_CLASS;
    innerDiv.innerHTML = btnText;

    outerDiv.addEventListener('click', App.onMapStyleToggleButtonClick);
    
    outerDiv.appendChild(innerDiv);
    parentDiv.appendChild(outerDiv);
/*
    parentDiv.innerHTML += `<div class=${MapStyleToggleButton.OUTER_DIV_CLASS} onclick="App.onMapStyleToggleButtonClick(event)">
    <div class=${MapStyleToggleButton.INNER_DIV_CLASS}>${btnText}</div></div>`; */
  }
  
}; // MapStyleToggleButton

export default MapStyleToggleButton;