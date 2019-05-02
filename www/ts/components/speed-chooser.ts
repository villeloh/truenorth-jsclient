import App from '../app';
import UIElement from './base-abstract/ui-element';
import { override } from '../misc/annotations';
import Slider from './base-abstract/slider';

/**
 * A slider for giving the estimated (average) cycling speed (in km/h).
 * Also contains a paragraph element for displaying the chosen speed.
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
    displayP.textContent = `${App.speed} km/h`;

    holderDiv.appendChild(slider);
    holderDiv.appendChild(displayP);
    return holderDiv;
  } // build

  /**
   * Updates the speed that's displayed in the paragraph component of the SpeedChooser.
  */
  static updateDisplayedSpeed(newSpeed: number): void {

    const displayP = document.getElementById(SpeedChooser._DISPLAY_P_ID);
    displayP!.textContent = `${newSpeed} km/h`;
  }

} // SpeedChooser