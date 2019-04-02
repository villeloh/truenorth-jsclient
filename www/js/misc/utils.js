/**
 * For utility functions that don't really fit anywhere else.
 */

const Utils = {

  // used for checking the user-inputted speed in the menu's speed box
  isValidSpeed: function(speedInKmH) {

    if (speedInKmH <= 0 || speedInKmH === "" || speedInKmH === null || speedInKmH === undefined) { 
      return false;
    } else {
      return true;
    }
  }, // isValidSpeed
  calcDuration: function(distance, speed) {

    let duraInDecimHours;

    if (Utils.isValidSpeed(speed)) {

      duraInDecimHours = distance / speed;
    } else {

      duraInDecimHours = 0;
    }
    return duraInDecimHours;
  }, // calcDuration

  // convert the duration to a more readable format (hours + minutes)
  formatDuration: function(duraInDecimHours, fallBackText) {

    let text;

    // when arriving, the value should always be a Number (invalid values get converted to 0); 
    // but it can be less than 1, leading to a great number of digits
    if (duraInDecimHours < 1) {

      text = fallBackText;
    } else {
      
      const hours = Math.trunc(duraInDecimHours);
      const decimPart = duraInDecimHours - hours;
      const minutes = Math.round(decimPart * 60);
      text = `${hours} h ${minutes} m`;
    }
    return text;
  }, // formatDuration

  // takes a route object from a DirectionsService fetch result
  distanceInKm: function(route) {

    let total = 0;
    for (let i = 0; i < route.legs.length; i++) {

      total += route.legs[i].distance.value;
    }
    return (total / 1000).toFixed(1);
  }, // distanceInKm

  decodePolyPoints: function(encodedPoints) {

    // console.log("decoded stuffs: " + app.google.maps.geometry.encoding.decodePath(encodedPoints));
    return App.google.maps.geometry.encoding.decodePath(encodedPoints);
  },

}; // Utils