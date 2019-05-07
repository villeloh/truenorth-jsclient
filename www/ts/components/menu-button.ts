import App from '../app';
import Button from './base-abstract/button';
import { override } from '../misc/annotations';

/**
 * A button that toggles the main menu's visibility.
 */

export default class MenuButton extends Button {

  // it's far from ideal that these are being accessed from the outside.
  // the problem would go away if we didn't have to destroy and recreate
  // the menu with each open/close.
  static readonly CLOSED_SYMBOL = 'ˇ';
  static readonly OPEN_SYMBOL = '^';

  private static readonly _OUTER_DIV_ID = 'menu-btn-outer';
  private static readonly _INNER_DIV_ID = 'menu-btn-inner';

  /**
   * Static factory method that returns an HTMLDivElement.
   */
  @override
  static build(onClick: any): HTMLDivElement {

    const outerDiv: HTMLDivElement = document.createElement('div');
    outerDiv.id = MenuButton._OUTER_DIV_ID;

    const innerDiv: HTMLDivElement = document.createElement('div');
    innerDiv.id = MenuButton._INNER_DIV_ID;
    innerDiv.innerHTML = MenuButton.CLOSED_SYMBOL;

    outerDiv.addEventListener('click', onClick);
    outerDiv.addEventListener('touchend', function(e: any) {

      e.stopPropagation(); // to stop clicks from bubbling through to the underlying map (seems to work)
    })
    
    outerDiv.appendChild(innerDiv);
    return outerDiv;
  } // build

} // MenuButton