import UIElement from "./ui-element";
import { override } from "../../misc/annotations";

/**
 * Base class for all UI buttons (with a mandatory onClick method).
 */

// NOTE: should never be instantiated, nor should build() be called!
export default class Button extends UIElement {

  // any = Function.
  // It should be an abstract method, but they can't be static...
  // the workarounds that exist for this are way too much to bother with.
  /**
   * Static factory method that returns an HTMLDivElement.
   */
  @override
  static build(onClick: any, text?: String): HTMLDivElement {
    
    return new HTMLDivElement()
  }

} // Button