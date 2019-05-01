import Button from './base-abstract/button';
import { override } from '../misc/annotations';

/**
 * Button that toggles the cycling layer off/on. It's different from the MapStyleToggleButtons, because 
 * the cycling layer can be applied on top of them.
 */

export default class CyclingLayerToggleButton extends Button {

  private static readonly _BORDER_ON = '2px solid green';
  private static readonly _BORDER_OFF = '2px solid #808080';
  private static readonly _BG_COLOR_ON = '#7CFFAC';
  private static readonly _BG_COLOR_OFF = '#fff';

  private static readonly _OUTER_DIV_ID = 'cyc-layer-btn-outer';
  private static readonly _INNER_DIV_ID = 'cyc-layer-btn-inner';

  private static readonly _TEXT = 'C.LAYER';

  @override
  static build(onClick: any): HTMLDivElement {

    const outerDiv: HTMLDivElement = document.createElement('div');
    outerDiv.id = CyclingLayerToggleButton._OUTER_DIV_ID;

    const innerDiv: HTMLDivElement = document.createElement('div');
    innerDiv.id = CyclingLayerToggleButton._INNER_DIV_ID;
    innerDiv.innerHTML = CyclingLayerToggleButton._TEXT;

    outerDiv.addEventListener('click', onClick);

    outerDiv.appendChild(innerDiv);
    return outerDiv;
  } // build

  // called when recreating the menu; it's a way to 'recall' its correct state after destruction
  static setInitialStyles(bikeLayerOn: Boolean): void {

    const toggleBtn = document.getElementById(CyclingLayerToggleButton._OUTER_DIV_ID);

    if (bikeLayerOn) {

      CyclingLayerToggleButton.applyOnStyles(toggleBtn);
    } else {

      CyclingLayerToggleButton.applyOffStyles(toggleBtn);
    } // if-else
  } // setInitialStyles

  static applyOffStyles(buttonDiv: any): void {

    buttonDiv.style.backgroundColor = CyclingLayerToggleButton._BG_COLOR_OFF;
    buttonDiv.style.border = CyclingLayerToggleButton._BORDER_OFF;
  }

  static applyOnStyles(buttonDiv: any): void {

    buttonDiv.style.backgroundColor = CyclingLayerToggleButton._BG_COLOR_ON;
    buttonDiv.style.border = CyclingLayerToggleButton._BORDER_ON;
  }
} // CyclingLayerToggleButton