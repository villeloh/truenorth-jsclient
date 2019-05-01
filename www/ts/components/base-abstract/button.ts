import UIElement from "./ui-element";
import { override } from "../../misc/annotations";

/**
 * Base class for all UI buttons (with a mandatory onClick method).
 */

// NOTE: should never be instantiated, nor should build() be called!
export default class Button extends UIElement {

  // any = Function
  @override
  static build(actionCallback: any, text?: String): HTMLDivElement {
    
    return new HTMLDivElement()
  }

} // Button