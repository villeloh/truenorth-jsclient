/**
 * These buttons toggle the map's style (terrain / normal / satellite).
 */

// extends UIButton
const MapStyleToggleButton = {

  NORMAL_TXT: 'NORMAL',
  TERRAIN_TXT: 'TERRAIN',
  SAT_TXT: 'SAT.',

  BORDER_DIV_ID: 'map-style-btn-border',
  INNER_DIV_ID: 'map-style-btn-inner',

  make: function(parentDiv, text, id, callback) {

    const outerStyles = new Map();
    outerStyles.set('backgroundColor', '#fff');
    outerStyles.set('border', '2px solid #808080');
    outerStyles.set('boxShadow', '0 2px 6px rgba(0,0,0,.3)');
    outerStyles.set('width', '4.3rem'); // TODO: adapt it to various screens based on their size
    outerStyles.set('height', '2.2rem');
    outerStyles.set('textAlign', 'center');
    outerStyles.set('borderRadius', '5%');
  
    const innerStyles = new Map();
    innerStyles.set('display', 'inline-block');
    innerStyles.set('color', 'rgb(25,25,25)');
    innerStyles.set('fontFamily', 'Roboto,Arial,sans-serif');
    innerStyles.set('fontSize', '14px');
    innerStyles.set('lineHeight', '38px');
  
    UIButton.make(parentDiv, outerStyles, innerStyles, id, callback, text, MapStyleToggleButton.BORDER_DIV_ID, MapStyleToggleButton.INNER_DIV_ID);
  } // make
  
}; // MapStyleToggleButton