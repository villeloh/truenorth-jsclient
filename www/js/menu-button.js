
/**
 * Make the main right-hand corner menu button.
 */

const MenuButton = {

  DIV_ID: 'menu-button',
  closedSymbol: 'ˇ',
  openSymbol: '^',

  make: function(parentDiv, callback) { 

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

    UIButton.make(parentDiv, outerStyles, innerStyles, null, callback, MenuButton.closedSymbol);
  } // make

}; // MenuButton