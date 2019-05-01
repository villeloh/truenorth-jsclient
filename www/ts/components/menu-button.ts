import App from '../app';
import Button from './base-abstract/button';
import { override } from '../misc/annotations';

/**
 * Make the main right-hand corner menu button.
 */

export default class MenuButton extends Button {

  static readonly CLOSED_SYMBOL = 'ˇ';
  static readonly OPEN_SYMBOL = '^';

  private static readonly _OUTER_DIV_ID = 'menu-btn-outer';
  private static readonly _INNER_DIV_ID = 'menu-btn-inner';

  @override
  static build(onClick: any): HTMLDivElement {

    const outerDiv: HTMLDivElement = document.createElement('div');
    outerDiv.id = MenuButton._OUTER_DIV_ID;

    const innerDiv: HTMLDivElement = document.createElement('div');
    innerDiv.id = MenuButton._INNER_DIV_ID;
    innerDiv.innerHTML = MenuButton.CLOSED_SYMBOL;

    outerDiv.addEventListener('click', onClick);
    
    outerDiv.appendChild(innerDiv);
    return outerDiv;
  } // build

} // MenuButton