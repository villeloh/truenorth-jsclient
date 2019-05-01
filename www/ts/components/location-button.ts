import App from '../app';
import Button from './base-abstract/button';
import { override } from '../misc/annotations';

/**
 * For making the location button that re-centers the map on the user's current location.
 */

// ideally, we'd extend HTMLElement here, but that causes an 'illegal constructor' error 
// which looks tricky enough to solve that i won't bother with it for now.
export default class LocationButton extends Button {

  private static readonly _OUTER_DIV_ID = 'loc-btn-outer';
  private static readonly _INNER_DIV_ID = 'loc-btn-inner';
 
  @override
  static build(onClick: any): HTMLDivElement {

    const outerDiv: HTMLDivElement = document.createElement('div');
    outerDiv.id = LocationButton._OUTER_DIV_ID;

    const innerDiv: HTMLDivElement = document.createElement('div');
    innerDiv.id = LocationButton._INNER_DIV_ID;

    outerDiv.addEventListener('click', onClick);
    
    outerDiv.appendChild(innerDiv);
    return outerDiv;
  } // build

} // LocationButton