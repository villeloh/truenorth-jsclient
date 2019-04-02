
/**
 * 'Class' that encapsulates the user's own position.
 */

function Position(latLng) {

  this.coords = latLng;

  this.marker = new App.google.maps.Marker({ 
    position: GoogleMap.getCurrentPosCoords(), 
    map: GoogleMap.getMap(), 
    draggable: false, 
    icon: GoogleMap.constants._PLACE_MARKER_URL 
  });

  // GeoLoc calls this (via cyclist)
  this.update = function(newCoords) {

    this.coords = newCoords;
    this.marker.position = newCoords;
  };

/* // it should not be needed, but leaving it for now, just in case
  this.clear = function() {

    this.coords = null;
    this.marker.setMap(null);
    App.google.maps.event.clearInstanceListeners(this.marker);
    this.marker = null;
  }; */

} // Position