
/**
 * A 'class' to associate an inner WayPointObject (used by the Google Maps API) and a waypoint marker with each other.
 */
/*
function WayPoint(latLng, label) {

  this.coords = latLng;
  this.object = new WayPointObject(latLng);

  this.marker = new App.google.maps.Marker({ 
    position: this.coords, 
    map: GoogleMap.getMap(), 
    draggable: true, 
    label: label, 
    crossOnDrag: false 
  });

  this.marker.addListener('dragend', function(event) {

    event.wpIndex = GoogleMap.getTrip().wayPoints.indexOf(this);
    // console.log("the added markerIndex: " + event.markerIndex);
    GoogleMap.onWayPointDragEnd(event);
  });

  this.marker.addListener('dblclick', function(event) {

    event.wpIndex = GoogleMap.getTrip().wayPoints.indexOf(this);
    GoogleMap.onWayPointDblClick(event);
  });

  this.clear = function() {

    this.coords = null;
    this.object = null;
    this.marker.setMap(null);
    App.google.maps.event.clearInstanceListeners(this.marker);
    this.marker = null;
  }; // clear

  this.updateLabel = function(newText) {

    this.marker.setLabel(newText);
  };
} // WayPoint */