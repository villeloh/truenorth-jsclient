import Button from './base-abstract/button';
import { override } from '../misc/annotations';

/**
 * A button that re-centers the map on the user's current location.
 */

export default class LocationButton extends Button {

  private static readonly _OUTER_DIV_ID = 'loc-btn-outer';
  private static readonly _INNER_DIV_ID = 'loc-btn-inner';
 
  /**
   * Static factory method that returns an HTMLDivElement.
   */
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