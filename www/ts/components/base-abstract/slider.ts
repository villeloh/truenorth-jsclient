import UIElement from "./ui-element";
import { override } from "../../misc/annotations";

/**
 * Base class for slider-type UI elements.
 */

// NOTE: not an abstract class, but should only be instantiated as part
// of a composite UI element (one that displays the adjusted input value).
export default class Slider extends UIElement {

  private static readonly _SLIDER_CLASS = 'slider';

  /**
   * Static factory method that returns an HTMLInputElement.
   */
  @override
  static build(onValueChange: any): HTMLInputElement {

    const input: HTMLInputElement = document.createElement('input');
    input.type = 'range';
    input.className = Slider._SLIDER_CLASS;
    input.step = '1';
    // note: min, max and value props should be set from the containing class

    input.addEventListener('input', onValueChange);
    return input;
  } // build

} // Slider