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

};