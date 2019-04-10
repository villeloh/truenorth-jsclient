/**
 * For storing the inner waypoint objects that are needed by the fetchFor method in route-service.js.
 */
function WayPointObject(latLng) {
    this.location = latLng;
    this.toString = function () {
        return "WP Object: ( lat.: " + this.location.lat + ", lng.: " + this.location.lng + " )";
    };
} // WayPointObject
