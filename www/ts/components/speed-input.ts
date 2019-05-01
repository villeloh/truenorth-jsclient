import App from '../app';
import Utils from '../misc/utils';
import { InfoHeader } from '../components/components';
import UIElement from './base-abstract/ui-element';
import { override } from '../misc/annotations';

/**
 * A simple input box for giving the estimated (average) cycling speed.
 * May change it to a slider for the final version.
 */

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

  // technically it's a violation of the general design principle of the app to put this here, 
  // but I'm trying not to bloat App.ts and this is the best candidate to tuck away in its own file.
  static onValueChange(event: any): void {

    // TODO: the speed value and info header display logic is too convoluted atm; fix asap!

    const value = event.target.value;

    if (value > App.MAX_SPEED) {

      event.target.value = App.MAX_SPEED;
    } else if (value < 0) {

      event.target.value = 0;
    }

    if (Utils.isValidSpeed(event.target.value)) {

      App.speed = event.target.value;
    } else {
      App.speed = 0;
    }

    if (!App.hasVisualTrip) return; // there is always a speed value, but it's only used if there's a successfully fetched trip that's being displayed

    // update the top screen info header with the new duration.
    // Note: it seems the typescript compiler is not smart enough to recognize a null check by a method in another class
    const newDura = Utils.calcDuration(App.mapService.visualTrip!.distance, App.speed);
    InfoHeader.updateDuration(newDura);
  } // onValueChange

} // SpeedInput