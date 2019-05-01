
/**
 * Base class for all UI elements.
 */

// NOTE: should never be instantiated, nor should build() be called!
export default class UIElement { 

  // we can't have static methods in an interface, yet build() must be static 
  // due to the limitations of the 'plain js' component system. as a workaround,
  // make sure every inheriting class overrides this method (and marks it with @override()).
  // NOTE: the callback should ofc be a function; the 'any' type is a workaround due to 
  // the annoying EventHandlerObject requirements.
  static build(actionCallback?: any, text?: String): HTMLElement {

    return new HTMLElement()
  }

} // UIElement