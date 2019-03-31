
/**
 * For emulating the Google Maps LatLng format. 
 * (Could just call google.maps.<something>.LatLng, but it's just as simple to do this.)
 */

function LatLng(lat, lng) {

  return { lat: lat, lng: lng };
}