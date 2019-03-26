/**
 * For making the location button that re-centers the map on the user's current location.
 */

 // extends UIButton
const LocationButton = {

  BORDER_DIV_ID: 'loc-btn-border',
  INNER_DIV_ID: 'loc-btn-inner',

  make: function(parentDiv, callback) {

    const outerStyles = new Map();
    outerStyles.set('backgroundColor', '#fff');
    outerStyles.set('border', '2px solid #808080');
    outerStyles.set('boxShadow', '0 2px 6px rgba(0,0,0,.3)');
    outerStyles.set('cursor', 'pointer'); // not sure if it does anything
    outerStyles.set('width', '2.2rem'); // TODO: adapt it to various screens based on their size
    outerStyles.set('height', '2.2rem');
    outerStyles.set('textAlign', 'center');
    outerStyles.set('borderRadius', '50%');
    outerStyles.set('marginRight', '0.75rem');
  
    const innerStyles = new Map();
    innerStyles.set('backgroundColor', 'black');
    innerStyles.set('width', '1.2rem');
    innerStyles.set('height', '1.2rem');
    innerStyles.set('display', 'inline-block'); // centers it within the parent div (together with the parent's 'textAlign = center' property)
    innerStyles.set('margin', '20%');
    innerStyles.set('borderRadius', '50%');

    // pass null for id and text, as neither is needed with this button
    UIButton.make(parentDiv, outerStyles, innerStyles, null, callback, null, LocationButton.BORDER_DIV_ID, LocationButton.INNER_DIV_ID);
  } // make
  
}; // LocationButton