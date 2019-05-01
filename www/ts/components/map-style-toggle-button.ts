import Button from './base-abstract/button';
import { override } from '../misc/annotations';

/**
 * These buttons toggle the map's display style (terrain / normal / satellite view).
 */

export default class MapStyleToggleButton extends Button {

  static readonly NORMAL_TXT = 'NORMAL';
  static readonly TERRAIN_TXT = 'TERRAIN';
  static readonly SAT_TXT = 'SAT.';

  private static readonly _OUTER_DIV_CLASS = 'map-style-btn-outer';
  private static readonly _INNER_DIV_CLASS = 'map-style-btn-inner';

  // btnTxt should be one of the texts above ('NORMAL_TXT', etc).
  // TODO: make an interface / enum that ensures it.
  /**
   * Static factory method that returns an HTMLDivElement.
   */
  @override
  static build(onClick: any, btnText: string): HTMLDivElement {
    
    const outerDiv: HTMLDivElement = document.createElement('div');
    outerDiv.className = MapStyleToggleButton._OUTER_DIV_CLASS;

    const innerDiv: HTMLDivElement = document.createElement('div');
    innerDiv.className = MapStyleToggleButton._INNER_DIV_CLASS;
    innerDiv.innerHTML = btnText;

    outerDiv.addEventListener('click', onClick);
    
    outerDiv.appendChild(innerDiv);
    return outerDiv;
  } // build

} // MapStyleToggleButton