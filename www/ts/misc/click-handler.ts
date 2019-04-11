import App from '../app';

/**
 * Differentiates between single and double clicks on the map, so that only the appropriate
 * event gets fired (wtf Google?).
 */

enum ClickType {

  SINGLE,
  DOUBLE,
  LONG_START,
  LONG_END
}

export default class ClickHandler {

  static get ClickType() {
    return ClickType;
  }

  // accessed when sending the click events from GoogleMap
/*static get SINGLE() { return 1; }
  static get DOUBLE() { return 2; }
  static get LONG_START() { return 3; }
  static get LONG_END() { return 4; } */

  private static readonly _DOUBLE_CLICK_TIMEOUT: number = 300;
  private static readonly _SINGLE_CLICK_TIMEOUT: number = 300;
  private static readonly _LONG_PRESS_TIMEOUT: number = 1500; // find the right value by experiment

  private _isLongPress: boolean = false;
  private _doubleClickInProgress: boolean = false;
  private _gMapClickEvent: any = null;

  constructor() {
  }

  get isLongPress(): boolean {

    return this._isLongPress;
  }

  set isLongPress(value: boolean) {

    this._isLongPress = value;
  }

  // i'm sure there's a simpler way to do this, but whatever, it works
  handle(event: any) {

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

        // do not re-fetch if the marker drag event just did it
        if ( !this._isLongPress || App.mapService.markerDragEventJustStopped ) return;  
        
        // set by the google map click event that fires just before this regular DOM event
        App.onGoogleMapLongPress(this._gMapClickEvent);
        break; 
      default:

        console.log("error handling click (a Very Bad Thing)!");
        break;
    } // switch
  } // handle

} // ClickHandler