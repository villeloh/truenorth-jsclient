
/**
 * A Trip contains all the relevant info for displaying valid (already fetched) routes on the map.
 */

// trips always start from the current position, so it's not necessary to have a start field here
function Trip(destCoords, wayPointCoordsArray, distance, duration) {

  // they're displayable quantities, only known after the route fetch completes, 
  // so it makes sense to have them here (rather than in Cyclist.js)
  this.distance = distance;
  this.duration = duration;
  
  this.destMarker = new App.google.maps.Marker({ 
    position: destCoords, 
    map: null, 
    draggable: true, 
    crossOnDrag: false 
  });
  this.destMarker.addListener('dragend', GoogleMap._onDestMarkerDragEnd);
  this.destMarker.addListener('click', GoogleMap._onDestMarkerTap);

  let labelNum = 1;
  this.wayPointMarkers = [];

  for (let i = 0; i < wayPointCoordsArray.length; i++) {

    const marker = new App.google.maps.Marker({ 
      position: wayPointCoordsArray[i], 
      map: null, 
      draggable: true, 
      label: labelNum+"", // must be a string
      crossOnDrag: false 
    });

    labelNum++;

    marker.addListener('dragend', function(event) {

      event.wpIndex = i;
      GoogleMap.onWayPointDragEnd(event);
    });
  
    marker.addListener('dblclick', function(event) {
  
      event.wpIndex = i;
      GoogleMap.onWayPointDblClick(event);
    });

    this.wayPointMarkers.push(marker);
  } // for

  this.clear = function() {

    this.distance = null;
    this.duration = null;

    this.destMarker.setMap(null);
    App.google.maps.event.clearInstanceListeners(this.destMarker);
    this.destMarker = null;

    this.wayPointMarkers.map(marker => {

      marker.setMap(null);
      App.google.maps.event.clearInstanceListeners(marker);
      return null;
    })
    this.wayPointMarkers.length = 0;
  }; // clear

  // i'm not sure if this needs to exist, but it seems somehow
  // wrong to display a Trip immediately on creation
  this.displayOnMap = function() {

    this.destMarker.setMap(GoogleMap.getMap());
    this.wayPointMarkers.forEach(marker => {

      marker.setMap(GoogleMap.getMap());
    });
  };

  this.getDistance = function() {

    return this.distance;
  };

  this.getDuration = function() {

    return this.duration;
  };

} // Trip