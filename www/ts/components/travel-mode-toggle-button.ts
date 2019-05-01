import App from '../app';
import Button from './base-abstract/button';
import { override } from '../misc/annotations';

/**
 * Menu button (switch) that toggles between cycling and walking mode for travel directions.
 * Useful when there's no cycling route available (e.g. when there's tunnels on the route).
 */

export default class TravelModeToggleButton extends Button {

  private static readonly _OUTER_DIV_ID = 'walk-cycle-btn-outer';
  private static readonly _SELECT_ID = 'walk-cycle-btn-select';

  private static readonly _CYCLE_TEXT = "cycle";
  private static readonly _WALK_TEXT = "walk";

  /**
   * Static factory method that returns an HTMLDivElement.
   */
  @override
  static build(onChange: any): HTMLDivElement {

    const pickedOption = App.travelMode;
    let unpickedOption: any; // can't use the TravelMode type in another class for some reason
    let pickedText: string;
    let unpickedText: string;

    // ugly af, but i can't think of another easy way to do this
    if (pickedOption === App.TravelMode.BICYCLING) {

      unpickedOption = App.TravelMode.WALKING;
      pickedText = TravelModeToggleButton._CYCLE_TEXT;
      unpickedText = TravelModeToggleButton._WALK_TEXT;
    } else {

      unpickedOption = App.TravelMode.BICYCLING;
      pickedText = TravelModeToggleButton._WALK_TEXT;
      unpickedText = TravelModeToggleButton._CYCLE_TEXT;
    }

    const outerDiv: HTMLDivElement = document.createElement('div');
    outerDiv.id = TravelModeToggleButton._OUTER_DIV_ID;

    const select: HTMLSelectElement = document.createElement('select');
    select.id = TravelModeToggleButton._SELECT_ID;
    select.addEventListener('change', onChange);

    const firstOption: HTMLOptionElement = document.createElement('option');
    firstOption.innerHTML = pickedText;
    firstOption.value = pickedOption;
    
    const secondOption: HTMLOptionElement = document.createElement('option');
    secondOption.innerHTML = unpickedText;
    secondOption.value = unpickedOption;
    
    select.appendChild(firstOption);
    select.appendChild(secondOption);
    outerDiv.appendChild(select);
    return outerDiv;
  } //build
  
} // TravelModeToggleButton