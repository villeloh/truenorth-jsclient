import App from '../app';
import UIElement from './base-abstract/ui-element';
import { override } from '../misc/annotations';
import Slider from './base-abstract/slider';

/**
 * A simple input box for giving the estimated (average) cycling speed (in km/h).
 * (May change it to a slider for the final version.)
 */

export default class SpeedChooser extends UIElement {

  private static readonly _HOLDER_DIV_ID = 'speed-chooser-holder-div';

  private static readonly _DISPLAY_P_ID = 'speed-chooser-display-p';

  /**
   * Static factory method that returns an HTMLDivElement.
   */
  @override
  static build(onValueChange: any): HTMLDivElement {

    const slider = Slider.build(onValueChange);
    slider.min = App.MIN_SPEED+"";
    slider.max = App.MAX_SPEED+"";
    slider.value = App.speed+"";

    const holderDiv: HTMLDivElement = document.createElement('div');
    holderDiv.id = SpeedChooser._HOLDER_DIV_ID;

    const displayP: HTMLParagraphElement = document.createElement('p');
    displayP.id = SpeedChooser._DISPLAY_P_ID;
    displayP.textContent = `Speed: ${App.speed} km/h`;

    holderDiv.appendChild(slider);
    holderDiv.appendChild(displayP);
    return holderDiv;
  } // build

  static updateDisplayedSpeed(newSpeed: number): void {

    const displayP = document.querySelector(`#${SpeedChooser._DISPLAY_P_ID}`) // can't use findElementById for some reason..?
    displayP!.textContent = `Speed: ${newSpeed} km/h`;
  }

} // SpeedChooser




/*
export default class SpeedInput extends UIElement {

  private static readonly _INPUT_ID = 'speed-input';

  @override
  static build(onValueChange: any): HTMLInputElement {

    const input: HTMLInputElement = document.createElement('input');
    input.type = "number";
    input.id = SpeedInput._INPUT_ID;
    input.step = "1";
    input.max = App.MAX_SPEED+"";
    input.value = App.speed+"";

    input.addEventListener('input', onValueChange);
    return input;
  } // build

} // SpeedInput */