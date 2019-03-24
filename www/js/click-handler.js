
/**
 * Differentiates between single and double clicks on the map, so that only the appropriate
 * event gets fired (wtf google?).
 */

const ClickHandler = {

  doubleClickTimeOut: 500,
  singleClickTimeOut: 300,
  SINGLE: 1,
  DOUBLE: 2,
  doubleClickInProgress: false,

  // i'm sure there's a simpler way to do it, but whatever, it works
  handle: function(event) {

    if (event.id === ClickHandler.SINGLE) {

      setTimeout(() => {

        if (!ClickHandler.doubleClickInProgress) {
          
          Route.to(event);
        }
      }, ClickHandler.singleClickTimeOut);
    } else if (event.id === ClickHandler.DOUBLE) {

      ClickHandler.doubleClickInProgress = true;
      GoogleMap.clear();
      setTimeout(() => {

        ClickHandler.doubleClickInProgress = false;
      }, ClickHandler.doubleClickTimeOut);
    } else {
      console.log("error processing click (should never happen...)!");
    }
  } // handle

}; // ClickHandler