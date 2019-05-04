import App from '../app';

enum ClickType {

  SINGLE,
  DOUBLE,
  LONG_START,
  LONG_END
}

/**
 * Differentiates between single, double and long clicks on the map, so that only the appropriate
 * event gets fired.
 */
export default class ClickHandler {

  static get ClickType() {

    return ClickType;
  }

  private static readonly _DOUBLE_CLICK_TIMEOUT: number = 300;
  private static readonly _SINGLE_CLICK_TIMEOUT: number = 300;
  private static readonly _LONG_PRESS_TIMEOUT: number = 1500; // find the right value by experiment

  private _isLongPress: boolean = false;
  private _doubleClickInProgress: boolean = false;
  private _gMapClickEvent: any;

  // needed in order not to fire a superfluous route fetch on long press 
  private _markerDragEventJustStopped: boolean = false;

  /**
   * Handle each click event (single, double, etc) according to 
   * its specific logic (which depends on the interplay between Google Map events and regular DOM events).
  */
  handle(event: any): void{

    switch (event.id) {
      case ClickHandler.ClickType.SINGLE:
        
        // capture the google map event so that it can be used in the LONG_START case that fires afterwards
        this._gMapClickEvent = event; 
        // do not delete! single clicks will perhaps be used later
        /* setTimeout(() => {
          
          if (!ClickHandler._doubleClickInProgress) {
            
            Route.to(event);
          }
        }, ClickHandler._singleClickTimeOut); */
        break;
      case ClickHandler.ClickType.DOUBLE:

        // if there is an active destination, it adds a waypoint
        App.onGoogleMapDoubleClick(event);

        this._doubleClickInProgress = true;

        setTimeout(() => {

          this._doubleClickInProgress = false;
        }, ClickHandler._DOUBLE_CLICK_TIMEOUT);
        break; 
      case ClickHandler.ClickType.LONG_START:
          
        this._isLongPress = false;

        setTimeout(() => {
          
            this._isLongPress = true;
        }, ClickHandler._LONG_PRESS_TIMEOUT);
        break;
      case ClickHandler.ClickType.LONG_END:

        // do not re-fetch route if the marker drag event just did it
        if ( !this._isLongPress || this._markerDragEventJustStopped ) return;  
        
        // set by the google map click event (first case) that fires just before this regular DOM event.
        // fetches new route
        App.onGoogleMapLongPress(this._gMapClickEvent);
        break; 
      default:

        // it should be impossible
        console.log("error handling click (a Very Bad Thing)!");
        break;
    } // switch
  } // handle

  get isLongPress(): boolean {

    return this._isLongPress;
  }

  set isLongPress(value: boolean) {

    this._isLongPress = value;
  }

  get markerDragEventJustStopped(): boolean {

    return this._markerDragEventJustStopped;
  }

  set markerDragEventJustStopped(value: boolean) {

    this._markerDragEventJustStopped = value;
  }

} // ClickHandler