import App from '../app';

/**
 * For making the location button that re-centers the map on the user's current location.
 */

// ideally, we'd extend HTMLElement here, but that causes an 'illegal constructor' error 
// which looks tricky enough to solve that i won't bother with it for now.
export default class LocationButton {

  private static readonly _OUTER_DIV_ID = 'loc-btn-outer';
  private static readonly _INNER_DIV_ID = 'loc-btn-inner';
 
  static build(): HTMLDivElement {

    const outerDiv = document.createElement('div');
    outerDiv.id = LocationButton._OUTER_DIV_ID;

    const innerDiv = document.createElement('div');
    innerDiv.id = LocationButton._INNER_DIV_ID;

    outerDiv.addEventListener('click', App.onLocButtonClick);
    
    outerDiv.appendChild(innerDiv);
    // parentDiv.appendChild(outerDiv);
    return outerDiv;
  } // build

} // LocationButton