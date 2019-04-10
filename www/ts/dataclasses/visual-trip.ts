import LatLng from "./latng";

/**
 * A VisualTrip contains all the relevant info for displaying valid (already fetched) routes on the map.
 */

// trips always start from the current position, so it's not necessary to have a start field here
export default class VisualTrip {

  constructor(routeFetchResult, destCoords: LatLng, wayPointCoordsArray, distance: number, duration: number) {

    // they're displayable quantities, only known after the route fetch completes, 
    // so it makes sense to have them here (rather than in PlannedTrip.js)
    this.distance = distance;
    this.duration = duration;

    this.fetchResult = routeFetchResult;

    this.destMarker = new Marker(null, destCoords, "", true);
    
    this.destMarker.addListener('dragend', App.onDestMarkerDragEnd);
    this.destMarker.addListener('click', App.onDestMarkerTap);

    this.wayPointMarkers = [];

    let labelNum = 1;

    for (let i = 0; i < wayPointCoordsArray.length; i++) {

      const marker = new Marker(null, wayPointCoordsArray[i], labelNum+"", true);

      labelNum++;

      marker.addListener('dragend', function (event) {
        event.wpIndex = i;
        App.onWayPointMarkerDragEnd(event);
      });

      marker.addListener('dblclick', function (event) {
        event.wpIndex = i;
        App.onWayPointDblClick(event);
      });

      this.wayPointMarkers.push(marker);
    } // for
  } // constructor

  clear() {

    this.distance = null;
    this.duration = null;

    this.destMarker.clearFromMap();
    this.wayPointMarkers.map(marker => {
      
      marker.clearFromMap();
      return null;
    });

    this.wayPointMarkers.length = 0;
  } // clear

  displayOnMap(googleMap) {

    // show the polyline on the map
    App.mapService.routeRenderer.renderOnMap(this.fetchResult);

    // show the dest marker and waypoints
    this.destMarker.showOnMap(googleMap);
    this.wayPointMarkers.forEach(marker => {

      marker.showOnMap(googleMap);
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