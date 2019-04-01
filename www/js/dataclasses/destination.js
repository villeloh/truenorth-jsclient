/**
 * 'Class' that encapsulates the user's destination.
 */

function Destination(latLng) {

  this.coords = latLng;

  this.marker = null; // only make the marker if the route request succeeds

  // called on successful directions request
  this.renderOnMap = function() {

    this.marker = new App.google.maps.Marker({ 
      position: this.coords, 
      map: GoogleMap.getMap(), 
      draggable: true, 
      crossOnDrag: false 
    });

    this.marker.addListener('dragend', GoogleMap._onDestMarkerDragEnd);
    this.marker.addListener('click', GoogleMap._onDestMarkerTap);
  }; // renderOnMap

  this.clearMarker = function() {

    this.marker.setMap(null);
    App.google.maps.event.clearInstanceListeners(this.marker);
    this.marker = null;
  }; // clear

  this.update = function(newCoords) {

    this.coords = newCoords;
    this.marker.position = newCoords;
  };

} // Destination