
/**
 * 'Class' that encapsulates the user's own position.
 */

function Position(latLng) {

  this.coords = latLng;

  this.marker = new App.google.maps.Marker({ 
    position: latLng, 
    map: GoogleMap.getMap(), 
    draggable: false, 
    icon: GoogleMap.constants._PLACE_MARKER_URL 
  });

  // GeoLoc calls this (via _plannedTrip, which contains the position object)
  this.update = function(newCoords) {

    this.coords = newCoords;
    this.marker.setMap(null); // to clear the old marker from the map

    // it needs to be recreated due to not being rendered on just moving it...
    // not sure what's wrong here tbh
    this.marker = new App.google.maps.Marker({ 
      position: newCoords, 
      map: GoogleMap.getMap(), 
      draggable: false, 
      icon: GoogleMap.constants._PLACE_MARKER_URL 
    });
  }; // update

/* // it should not be needed, but leaving it for now, just in case
  this.clear = function() {

    this.coords = null;
    this.marker.setMap(null);
    App.google.maps.event.clearInstanceListeners(this.marker);
    this.marker = null;
  }; */

} // Position