
/**
 * Button that toggles the cycling layer off/on. It's different from the MapStyleToggleButtons, because 
 * the cycling layer can be applied on top of them.
 */

 // extends UIButton
const CyclingLayerToggleButton = {

  BORDER_ON: '2px solid green',
  BORDER_OFF: '2px solid #808080',
  BG_COLOR_ON: '#7CFFAC',
  BG_COLOR_OFF: '#fff',

  BORDER_DIV_ID: 'cyc-layer-btn-border',
  INNER_DIV_ID: 'cyc-layer-btn-inner',

  TEXT: 'C.LAYER',

  make: function(parentDiv, text, callback) {

    // for now, it looks identical to other buttons; style it properly asap
    const outerStyles = new Map();
    outerStyles.set('backgroundColor', CyclingLayerToggleButton.BG_COLOR_OFF);
    outerStyles.set('border', CyclingLayerToggleButton.BORDER_OFF);
    outerStyles.set('boxShadow', '0 2px 6px rgba(0,0,0,.3)');
    outerStyles.set('width', '4.3rem'); // TODO: adapt it to various screens based on their size
    outerStyles.set('height', '2.2rem');
    outerStyles.set('textAlign', 'center');
    outerStyles.set('borderRadius', '5%');
    outerStyles.set('marginTop', '20%'); // separate it from the other buttons
  
    const innerStyles = new Map();
    innerStyles.set('display', 'inline-block');
    innerStyles.set('color', 'rgb(25,25,25)');
    innerStyles.set('fontFamily', 'Roboto,Arial,sans-serif');
    innerStyles.set('fontSize', '14px');
    innerStyles.set('lineHeight', '38px');
  
    UIButton.make(parentDiv, outerStyles, innerStyles, null, callback, text, CyclingLayerToggleButton.BORDER_DIV_ID, CyclingLayerToggleButton.INNER_DIV_ID);
  } // make
};