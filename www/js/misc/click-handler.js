
/**
 * Differentiates between single and double clicks on the map, so that only the appropriate
 * event gets fired (wtf Google?).
 */

const ClickHandler = {

  // accessed when sending the click events from GoogleMap
  SINGLE: 1,
  DOUBLE: 2,
  LONG_START: 3,
  LONG_END: 4,

  _doubleClickTimeOut: 300,
  _singleClickTimeOut: 300,
  _longPressTimeOut: 1500, // find the right value by experiment
  _doubleClickInProgress: false,
  _isLongPress: false,

  _gMapClickEvent: null,

  // i'm sure there's a simpler way to do it, but whatever, it works
  handle: function(event) {

    switch (event.id) {
      case ClickHandler.SINGLE:
        
        // capture the google map event so that it can be used in the LONG_START case that fires afterwards
        ClickHandler._gMapClickEvent = event; 
        // do not delete! single clicks will be used later!
        /* setTimeout(() => {
          
          if (!ClickHandler._doubleClickInProgress) {
            
            Route.to(event);
          }
        }, ClickHandler._singleClickTimeOut); */
        break;
      case ClickHandler.DOUBLE:
        
        ClickHandler._doubleClickInProgress = true;
        GoogleMap.clear(true); // full clear; i.e., reset the top info header
        Distance.currentDist = 0;
        Distance.currentSpeed = 0;
        setTimeout(() => {

          ClickHandler._doubleClickInProgress = false;
        }, ClickHandler._doubleClickTimeOut);
        break;
      case ClickHandler.LONG_START:
        
        ClickHandler._isLongPress = false;
        // console.log("started long click!");
        setTimeout(() => {
          
            ClickHandler._isLongPress = true;
            // console.log("set _isLongPress to: " + ClickHandler._isLongPress);

        }, ClickHandler._longPressTimeOut);
        break;
      case ClickHandler.LONG_END:
        
        // console.log("ended long click!");
        if (ClickHandler._isLongPress) {

          // console.log("fetching route");
          // set by the google map click event that fires before this regular DOM event
          Route.to(ClickHandler._gMapClickEvent);
          ClickHandler._isLongPress = false; // should not be needed, but leaving it for now, just in case
        }
        break; 
      default:

        console.log("error handling click (a Very Bad Thing)!");
        break;
    } // switch
  } // handle

}; // ClickHandler