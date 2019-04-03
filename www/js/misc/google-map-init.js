
/**
 * A convenience file for tucking away the lengthy setup operations for the GoogleMap.
 */

const GoogleMapInit = {

  readyAll: function(mapService) {


    GoogleMapInit._setListeners(mapService);
  }, // readyMap



  _setListeners: function(mapService) {

    const gMap = mapService.map;

    gMap.addListener('click', function(e) {

      e.id = ClickHandler.SINGLE;
      mapService.clickHandler.handle(e);
    });
    gMap.addListener('dblclick', function(e) { 

      e.id = ClickHandler.DOUBLE;
      mapService.clickHandler.handle(e);
    });

    gMap.addListener('heading_changed', function(e) {

      console.log("heading changed event: " + JSON.stringify(e)); // doesn't seem to work... read up on it
    });

    gMap.addListener('zoom_changed', function(e) {

      mapService.clickHandler.isLongPress = false;
    });

    gMap.addListener('dragstart', function() {

      mapService.clickHandler.isLongPress = false;
    });

    gMap.addListener('drag', function() {

      mapService.clickHandler.isLongPress = false;
    });

    gMap.addListener('dragend', function() {

      mapService.clickHandler.isLongPress = false;
    });
    
    // DOM events seem to be the only option for listening for 'long press' type of events.
    // these fire on *every* click though, which makes things messy to say the least
    App.google.maps.event.addDomListener(mapService.mapHolderDiv, 'touchstart', function(e) {

      e.id = ClickHandler.LONG_START;
      mapService.clickHandler.handle(e);
    });

    App.google.maps.event.addDomListener(mapService.mapHolderDiv, 'touchend', function(e) {
      
      e.id = ClickHandler.LONG_END;
      mapService.clickHandler.handle(e);
    });
  } // _setListeners

}; // GoogleMapInit