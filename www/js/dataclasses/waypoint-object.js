
/**
 * For storing the inner waypoint objects that are needed by the fetch method in Route.js.
 * Actual WayPoints (defined in waypoint.js) contain one of these along with a waypoint marker.
 */

function WayPointObject(latLng) {

  this.location = latLng;

  this.toString = function() {

    return `WP Object: ( lat.: ${this.location.lat}, lng.: ${this.location.lng} )`;
  };
} // WayPointObject