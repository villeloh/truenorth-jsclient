
/**
 * Differentiates between single and double clicks on the map, so that only the appropriate
 * event gets fired (wtf Google?).
 */

class ClickHandler {

  // accessed when sending the click events from GoogleMap
  static get SINGLE() { return 1; }
  static get DOUBLE() { return 2; }
  static get LONG_START() { return 3; }
  static get LONG_END() { return 4; }

  static _doubleClickTimeOut = 300;
  static _singleClickTimeOut = 300;
  static _longPressTimeOut = 1500; // find the right value by experiment

  constructor(mapService) {

    this._mapService = mapService;
    this.isLongPress = false;
    this._doubleClickInProgress = false;
    this._gMapClickEvent = null;
  }

  get isLongPress() {

    return this._isLongPress;
  }

  set isLongPress(value) {

    this._isLongPress = value;
  }

  // i'm sure there's a simpler way to do this, but whatever, it works
  handle(event) {

    switch (event.id) {
      case ClickHandler.SINGLE:
        
        // capture the google map event so that it can be used in the LONG_START case that fires afterwards
        this._gMapClickEvent = event; 
        // do not delete! single clicks will perhaps be used later
        /* setTimeout(() => {
          
          if (!ClickHandler._doubleClickInProgress) {
            
            Route.to(event);
          }
        }, ClickHandler._singleClickTimeOut); */
        break;
      case ClickHandler.DOUBLE:

        this._mapService.onGoogleMapDoubleClick(event);

        this._doubleClickInProgress = true;

        setTimeout(() => {

          this._doubleClickInProgress = false;
        }, ClickHandler._doubleClickTimeOut);
        break; 
      case ClickHandler.LONG_START:
          
        this.isLongPress = false;

        setTimeout(() => {
          
            this.isLongPress = true;
        }, ClickHandler._longPressTimeOut);
        break;
      case ClickHandler.LONG_END:

        if ( !this.isLongPress || this._mapService.markerDragEventJustStopped ) return;  // do not re-fetch if the marker drag event just did it

        // set by the google map click event that fires just before this regular DOM event
        this._mapService.onGoogleMapLongPress(this._gMapClickEvent);
        break; 
      default:

        console.log("error handling click (a Very Bad Thing)!");
        break;
    } // switch
  } // handle

} // ClickHandler

// Do NOT delete this for now !!!!!!!!!!!!!!!!!!!!!!!
/*
const ClickHandler = {

  // accessed when sending the click events from GoogleMap
  SINGLE: 1,
  DOUBLE: 2,
  LONG_START: 3,
  LONG_END: 4,

  // set from GoogleMap on various events, as a guard against the
  // interference of DOM touch events with map click events
  isLongPress: false,

  _doubleClickTimeOut: 300,
  _singleClickTimeOut: 300,
  _longPressTimeOut: 1500, // find the right value by experiment
  _doubleClickInProgress: false,

  _gMapClickEvent: null,

  // i'm sure there's a simpler way to do it, but whatever, it works
  handle: function(event) {

    switch (event.id) {
      case ClickHandler.SINGLE:
        
        // capture the google map event so that it can be used in the LONG_START case that fires afterwards
        ClickHandler._gMapClickEvent = event; 
        // do not delete! single clicks will perhaps be used later
         setTimeout(() => {
          
          if (!ClickHandler._doubleClickInProgress) {
            
            Route.to(event);
          }
        }, ClickHandler._singleClickTimeOut);
        break;
      case ClickHandler.DOUBLE:

        GoogleMap.onGoogleMapDoubleClick(event);

        ClickHandler._doubleClickInProgress = true;

        setTimeout(() => {

          ClickHandler._doubleClickInProgress = false;
        }, ClickHandler._doubleClickTimeOut);
        break; 
      case ClickHandler.LONG_START:
         
        ClickHandler.isLongPress = false;

        setTimeout(() => {
          
            ClickHandler.isLongPress = true;
        }, ClickHandler._longPressTimeOut);
        break;
      case ClickHandler.LONG_END:

        if ( !ClickHandler.isLongPress || GoogleMap.markerDragEventJustStopped ) return;  // do not re-fetch if the marker drag event just did it

        // set by the google map click event that fires just before this regular DOM event
        GoogleMap.onGoogleMapLongPress(ClickHandler._gMapClickEvent);
        break; 
      default:

        console.log("error handling click (a Very Bad Thing)!");
        break;
    } // switch
  }, // handle

}; // ClickHandler */