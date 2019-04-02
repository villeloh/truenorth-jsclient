
/**
 * A Trip contains all the relevant info for displaying  possible routes on the map.
 */

// trips always start from the current position, so it's not necessary to have a start field here
function Trip(destCoords, wayPointCoordsArray, distance, duration) {

  // they're displayable quantities, so it makes sense to have them here (rather than in Cyclist.js)
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

  for (let i = 0; wayPointCoordsArray.length; i++) {

    const marker = new App.google.maps.Marker({ 
      position: wayPointCoordsArray[i], 
      map: null, 
      draggable: true, 
      label: labelNum+"", 
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


  /*
  this.addWayPointMarker = function(wp) {

    this.wayPointMarkers.push(wp);
  };

  this.removeWayPoint = function(index) {

    this.wayPoints[index].clear();
    this.wayPoints.splice(index, 1);
  }; 

  this.getWayPointArrayLength = function() {

    return this.wayPoints.length;
  }; 
  
  this.updateMarkerLabels = function(aboveLabelNum) {

    this.wayPointMarkers.forEach(marker => {
      
      const labelAsNum = parseInt(marker.label);

      if (labelAsNum > aboveLabelNum) {

        marker.setLabel(labelAsNum-1);
      }
    });
  }; // updateMarkerLabels
  
  */

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