import LatLng from '../dataclasses/latlng';

/**
 * For utility functions that don't really fit anywhere else.
 */

export default class Utils {

  // used for checking the user-inputted speed in the menu's speed box
  static isValidSpeed(speedInKmH: any): boolean {

    // values of less than 1 lead to a great number of digits in the duration display
    if (speedInKmH < 1 || speedInKmH === "" || speedInKmH === null || speedInKmH === undefined) { 
      return false;
    } else {
      return true;
    }
  } // isValidSpeed
  
  static calcDuration(distance: number, speed: number): number {

    let duraInDecimHours: number;

    if (Utils.isValidSpeed(speed)) {

      duraInDecimHours = distance / speed;
    } else {

      duraInDecimHours = 0;
    }
    return duraInDecimHours;
  } // calcDuration

  // convert the duration to a more readable format (hours + minutes)
  static formatDuration(duraInDecimHours: number, fallBackText: string): string {

    let text: string;

    // when arriving, the value should always be a Number (invalid values get converted to 0 beforehand)
    if (duraInDecimHours === 0) {

      text = fallBackText;
    } else {
      
      const hours = Math.trunc(duraInDecimHours);
      const decimPart = duraInDecimHours - hours;
      const minutes = Math.round(decimPart * 60);
      text = `${hours} h ${minutes} m`;
    }
    return text;
  } // formatDuration

  // takes a route object from a DirectionsService fetch result
  static distanceInKm(route: google.maps.DirectionsRoute): number {

    let total = 0;
    for (let i = 0; i < route.legs.length; i++) {

      total += route.legs[i].distance.value;
    }
    return parseFloat((total / 1000).toFixed(1));
  } // distanceInKm

  static latLngFromClickEvent(event: any): LatLng {
  
    return new LatLng(event.latLng.lat(), event.latLng.lng());
  }

  // not being used atm, but keeping it in case it's needed later on (for persistence it likely will be)
  /* decodePolyPoints: function(encodedPoints) {

    // console.log("decoded stuffs: " + app.google.maps.geometry.encoding.decodePath(encodedPoints));
    return App.google.maps.geometry.encoding.decodePath(encodedPoints);
  } */

} // Utils