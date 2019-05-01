import Button from './base-abstract/button';
import { override } from '../misc/annotations';

/**
 * A button to clear the map with. 
 */

// NOTE: Ideally, a double-click would be used to clear the map, and single clicks
// for adding waypoints. However, accidental touches are a serious issue when using the app on cycling trips.
// So for now, this button clears the map and double clicks add waypoints.
export default class ClearButton extends Button {

  private static readonly _OUTER_DIV_ID = 'clear-btn-outer';
  private static readonly _INNER_DIV_ID = 'clear-btn-inner';
  private static readonly _TEXT = 'CLEAR';

  /** 
   * Static factory method that returns an HTMLDivElement.
  */
  @override
  static build(onClick: any): HTMLDivElement {

    const outerDiv: HTMLDivElement = document.createElement('div');
    outerDiv.id = ClearButton._OUTER_DIV_ID;

    const innerDiv: HTMLDivElement = document.createElement('div');
    innerDiv.id = ClearButton._INNER_DIV_ID;
    innerDiv.innerHTML = ClearButton._TEXT;
    
    outerDiv.appendChild(innerDiv);
    outerDiv.addEventListener('click', onClick);
    return outerDiv;
  } // build

} // ClearButton