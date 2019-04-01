
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
        /* setTimeout(() => {
          
          if (!ClickHandler._doubleClickInProgress) {
            
            Route.to(event);
          }
        }, ClickHandler._singleClickTimeOut); */
        break;
      case ClickHandler.DOUBLE:
      
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();
        const clickedPos = new LatLng(lat, lng);
        GoogleMap.addWayPoint(clickedPos);

        ClickHandler._doubleClickInProgress = true;

        setTimeout(() => {

          ClickHandler._doubleClickInProgress = false;
        }, ClickHandler._doubleClickTimeOut);
        break; 
      case ClickHandler.LONG_START:
         
        // console.log("markerDrag in LONG_START: " + GoogleMap.markerDragInProgress);
        // if (GoogleMap.markerDragInProgress) return;

        // console.log("called LONG_START");
        
        ClickHandler.isLongPress = false;
        // console.log("set isLongPress to: " + ClickHandler._isLongPress);
        setTimeout(() => {
          
            ClickHandler.isLongPress = true;
            // console.log("set _isLongPress to: " + ClickHandler._isLongPress);

        }, ClickHandler._longPressTimeOut);
        break;
      case ClickHandler.LONG_END:
        
        // console.log("called LONG_END");

        if ( !ClickHandler.isLongPress || GoogleMap.markerDragEventJustStopped ) return;  // do not re-fetch if the marker drag event just did it

        // console.log("fetching route");

        // set by the google map click event that fires just before this regular DOM event
        const toLat = ClickHandler._gMapClickEvent.latLng.lat();
        const toLng = ClickHandler._gMapClickEvent.latLng.lng();
        const destCoords = new LatLng(toLat, toLng);

        GoogleMap.getTrip().dest = new Destination(destCoords);

        // console.log("fetching route after LONG PRESS!");
        Route.fetch(GoogleMap.getTrip());
        
        break; 
      default:

        console.log("error handling click (a Very Bad Thing)!");
        break;
    } // switch
  }, // handle

}; // ClickHandler