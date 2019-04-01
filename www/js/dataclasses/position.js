
/**
 * 'Class' that encapsulates the user's own position.
 */

function Position(latLng) {

  this.coords = latLng;

  this.marker = new App.google.maps.Marker({ 
    position: GoogleMap.getCurrentPos(), 
    map: GoogleMap.getMap(), 
    draggable: false, 
    icon: GoogleMap.constants._PLACE_MARKER_URL 
  });

  // GeoLoc calls this
  this.update = function(newCoords) {

    this.coords = newCoords;
    this.marker.position = newCoords;
  };
} // Position