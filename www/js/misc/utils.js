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

  decodePolyPoints: function(encodedPoints) {

    // console.log("decoded stuffs: " + app.google.maps.geometry.encoding.decodePath(encodedPoints));
    return App.google.maps.geometry.encoding.decodePath(encodedPoints);
  },

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
  formatDuration: function(duraInDecimHours) {

    let text;

    // all invalid speed values should lead to 0 here
    if (duraInDecimHours === 0) {

      text = InfoHeader.DEFAULT_DURA;
    } else {
      
      const hours = Math.trunc(duraInDecimHours);
      const decimPart = duraInDecimHours - hours;
      const minutes = Math.round(decimPart * 60);
      text = `${hours} h ${minutes} m`;
    }
    return text;
  } // formatDuration

}; // Utils