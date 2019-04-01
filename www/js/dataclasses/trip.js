
/**
 * A Trip encapsulates all the relevant values of a journey on the Google Map.
 */

// trips always start from the current position, so it's not necessary to have a start field here
function Trip(dest, wayPoints, speed, travelMode) {
  
  this.dest = dest; // Destination object
  this.wayPoints = wayPoints; // array of WayPoints
  this.speed = speed;
  this.travelMode = travelMode;

  this.distance = null; // km; set later, after the route has been fetched
  this.duration = null; // decimal-hours

  this.addWayPoint = function(wp) {

    this.wayPoints.push(wp);
  };

  this.removeWayPoint = function(index) {

    this.wayPoints[index].clear();
    this.wayPoints.splice(index, 1);
  };

  this.getWayPointArrayLength = function() {

    return this.wayPoints.length;
  };
} // Trip