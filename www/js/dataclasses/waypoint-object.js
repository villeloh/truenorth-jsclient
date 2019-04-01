
/**
 * For storing waypoint objects that are needed by the fetch method in Route.js
 */

function WayPointObject(latLng) {

  this.location = latLng;

  this.toString = function() {

    return `WP: ( lat.: ${this.location.lat}, lng.: ${this.location.lng} )`;
  };
} // WayPointObject