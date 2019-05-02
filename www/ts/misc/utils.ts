import LatLng from '../dataclasses/latlng';

/**
 * For utility functions that don't really fit anywhere else.
 */

export default class Utils {
  
  /**
  * Divides a distance (in km) with a speed (in km/h) and returns the resulting
  * duration (in 'decimal hours').
  */
  static duraInDecimHours(distance: number, speed: number): number {

    return distance / speed; // both are always valid, so no checks are needed
  } // calcDuration

  /**
   * Takes a route object from a DirectionsService fetch result
   * and returns a distance (xx.x km/h).
  */
  static distanceInKm(route: google.maps.DirectionsRoute): number {

    let total = 0;
    for (let i = 0; i < route.legs.length; i++) {

      total += route.legs[i].distance.value;
    }
    return parseFloat((total / 1000).toFixed(1));
  } // distanceInKm

  /**
   * Takes a Google Maps click event and returns a new LatLng
   * based on the contained latitude and longitude values.
  */
  static latLngFromClickEvent(event: any): LatLng {
  
    return new LatLng(event.latLng.lat(), event.latLng.lng());
  }

  // not being used atm, but keeping it in case it's needed later on (for persistence it likely will be)
  /* decodePolyPoints: function(encodedPoints) {

    // console.log("decoded stuffs: " + app.google.maps.geometry.encoding.decodePath(encodedPoints));
    return App.google.maps.geometry.encoding.decodePath(encodedPoints);
  } */

} // Utils