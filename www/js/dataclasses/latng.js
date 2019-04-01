
/**
 * For emulating the Google Maps LatLng format.
 */

function LatLng(lat, lng) {

  this.lat = lat;
  this.lng = lng;

  // 'extra' properties in the objects given to the Google Maps API are
  // apparently not a problem.
  this.toString = function() {

    return `lat.: ${this.lat}, lng.: ${this.lng}`;
  };

  // used for determining when the map recenters when the user moves
  this.differenceFrom = function(anotherLatLng) {

    const absLatDiff = Math.abs(Math.abs(this.lat) - Math.abs(anotherLatLng.lat));
    const absLngDiff = Math.abs(Math.abs(this.lng) - Math.abs(anotherLatLng.lng));

    return Math.max(absLatDiff, absLngDiff);
  };

} // LatLng