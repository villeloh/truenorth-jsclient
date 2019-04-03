
/**
 * A VisualTrip contains all the relevant info for displaying valid (already fetched) routes on the map.
 */

// trips always start from the current position, so it's not necessary to have a start field here
class VisualTrip {

  constructor(mapService, destCoords, wayPointCoordsArray, distance, duration) {

    // they're displayable quantities, only known after the route fetch completes, 
    // so it makes sense to have them here (rather than in PlannedTrip.js)
    this.distance = distance;
    this.duration = duration;

    this.destMarker = new App.google.maps.Marker({
      position: destCoords,
      map: null,
      draggable: true,
      crossOnDrag: false
    });

    this.destMarker.addListener('dragend', mapService.onDestMarkerDragEnd);
    this.destMarker.addListener('click', mapService.onDestMarkerTap);

    this.wayPointMarkers = [];

    let labelNum = 1;

    for (let i = 0; i < wayPointCoordsArray.length; i++) {

      const marker = new App.google.maps.Marker({
        position: wayPointCoordsArray[i],
        map: null,
        draggable: true,
        label: labelNum + "",
        crossOnDrag: false
      });

      labelNum++;

      marker.addListener('dragend', function (event) {
        event.wpIndex = i;
        mapService.onWayPointDragEnd(event);
      });

      marker.addListener('dblclick', function (event) {
        event.wpIndex = i;
        mapService.onWayPointDblClick(event);
      });

      this.wayPointMarkers.push(marker);
    } // for
  } // constructor

  clear() {

    this.distance = null;
    this.duration = null;

    this.destMarker.setMap(null);
    App.google.maps.event.clearInstanceListeners(this.destMarker);
    this.destMarker = null;
    this.wayPointMarkers.map(marker => {
      marker.setMap(null);
      App.google.maps.event.clearInstanceListeners(marker);
      return null;
    });

    this.wayPointMarkers.length = 0;
  } // clear

    // i'm not sure if this needs to exist, but it seems somehow
    // wrong to display the trip immediately on creation
  displayOnMap(googleMap) {

    this.destMarker.setMap(googleMap);
    this.wayPointMarkers.forEach(marker => {
      marker.setMap(googleMap);
    });
  }; // displayOnMap

  // to prevent infinite recursion when using get/set in classes, the underscore in property names is needed 
  // (it somehow automagically works under the hood). whoever designed this behaviour should be hung, drawn, and quartered! -.-
  get distance() {

    return this._distance;
  };

  set distance(value) {

    this._distance = value;
  }

  get duration() {

    return this._duration;
  }

  set duration(value) {

    this._duration = value;
  }
    
} // VisualTrip