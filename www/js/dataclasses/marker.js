
/**
 * I put this in dataclasses for now; it's a bit of a hybrid between a visual element and a dataclass.
 */

class Marker {

  constructor(googleMap, position, label, isDraggable) {

    this.position = position;
    this.googleMap = googleMap;
    this.label = label;
    this.isDraggable = isDraggable;

    this.googleMapMarker = new App.google.maps.Marker({

      position: position,
      map: googleMap,
      draggable: isDraggable,
      label: label,
      crossOnDrag: false
    });

  } // constructor

  // we need to make a new marker with each move, as otherwise it 
  // refuses to render
  moveTo(newPos) {

    this.clearFromMap(); // erase the old marker

    this.googleMapMarker = new App.google.maps.Marker({

      position: newPos,
      map: this.googleMap,
      draggable: this.isDraggable,
      label: this.label,
      crossOnDrag: false
    });
  } // moveTo

  // takes a string and a function, like the underlying 
  // addListener method that it 'overrides'
  addListener(eventName, callback) {

    this.googleMapMarker.addListener(eventName, callback);
  }

  clearFromMap() {

    this.googleMapMarker.setMap(null);
    App.google.maps.event.clearInstanceListeners(this.googleMapMarker);
    this.googleMapMarker = null;
  }

  showOnMap(googleMap) {

    this.googleMapMarker.setMap(googleMap);
  }

} // Marker