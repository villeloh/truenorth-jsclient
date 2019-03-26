
/**
 * Differentiates between single and double clicks on the map, so that only the appropriate
 * event gets fired (wtf Google?).
 */

const ClickHandler = {

  // accessed when sending the click events from GoogleMap
  SINGLE: 1,
  DOUBLE: 2,

  _doubleClickTimeOut: 300,
  _singleClickTimeOut: 300,
  _doubleClickInProgress: false,

  // i'm sure there's a simpler way to do it, but whatever, it works
  handle: function(event) {

    if (event.id === ClickHandler.SINGLE) {

      setTimeout(() => {

        if (!ClickHandler._doubleClickInProgress) {
          
          Route.to(event);
        }
      }, ClickHandler._singleClickTimeOut);
    } else if (event.id === ClickHandler.DOUBLE) {

      ClickHandler._doubleClickInProgress = true;
      GoogleMap.clear();
      setTimeout(() => {

        ClickHandler._doubleClickInProgress = false;
      }, ClickHandler._doubleClickTimeOut);
    } else {
      console.log("error processing map click (should never happen...)!");
    }
  } // handle

}; // ClickHandler