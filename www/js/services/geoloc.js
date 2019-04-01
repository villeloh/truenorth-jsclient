/**
 * Updates the user's own position.
 */

// TODO: handle not having GPS on / turning it off while using the app (rn it crashes the app)

const GeoLoc = {

  _CAMERA_MOVE_THRESHOLD: 0.001, // the right value must be found experimentally
  _locTracker: null,

  _options: { 
    maximumAge: 3000, // use cached results that are max this old
    timeout: 5000, // call onError if no success in this amount of ms
    enableHighAccuracy: true 
  },

  start: function() {

    this._locTracker = navigator.geolocation.watchPosition(this._onSuccess, this._onError, this._options);
  },

  stop: function() {

    navigator.geolocation.clearWatch(this._locTracker);
  },

  // for some reason, 'this' refuses to work with this function
  _onSuccess: function(position) {

    const newCoords = new LatLng(position.coords.latitude, position.coords.longitude);
    const oldCoords = GoogleMap.getCurrentPos().coords;
    
    GoogleMap.getCurrentPos().update(newCoords);

    if (GeoLoc._diffIsOverCameraMoveThreshold(oldCoords, newCoords)) {

      GoogleMap.reCenterToCurrentPos(); 
    }
  }, // _onSuccess

  _onError: function (error) {
      
    console.log("GeoLoc error! Code: " + error.code);
    console.log("GeoLoc error! Msg: " + error.message);
  },

  // make the camera auto-follow the user only if the change in position is significant enough (i.e., they're cycling).
  _diffIsOverCameraMoveThreshold: function(oldPos, newPos) {

    const diff = oldPos.differenceFrom(newPos);

    return diff > this._CAMERA_MOVE_THRESHOLD;
  } // _diffIsOverCameraMoveThreshold

}; // GeoLoc