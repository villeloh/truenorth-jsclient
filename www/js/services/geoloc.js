/**
 * Updates the user's own position.
 */

// TODO: handle not having GPS on / turning it off while using the app (rn it crashes the app)

const GeoLoc = {

  currentPos: {
    lat: 0,
    lng: 0
  },

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

    const newPos = {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    };

    // must be called before resetting currentPos below!
    if (GeoLoc._diffIsOverCameraMoveThreshold(GeoLoc.currentPos, newPos)) {

      GoogleMap.reCenter(newPos); 
    }

    GeoLoc.currentPos = newPos;
    GoogleMap.updatePosMarker();
    // console.log("location: " + GeoLoc.currentPos.lat + ", " + GeoLoc.currentPos.lng);
  }, // _onSuccess

  _onError: function (error) {
      
    console.log("GeoLoc error! Code: " + error.code);
    console.log("GeoLoc error! Msg: " + error.message);
  },

  // make the camera auto-follow the user only if the change in position is significant enough (i.e., they're cycling).
  // TODO: implement Position objects which have a magnitude comparison method on them?
  _diffIsOverCameraMoveThreshold: function(oldPos, newPos) {

    const absLatDiff = Math.abs(Math.abs(oldPos.lat) - Math.abs(newPos.lat));
    const absLngDiff = Math.abs(Math.abs(oldPos.lng) - Math.abs(newPos.lng));

    if ( absLatDiff > this._CAMERA_MOVE_THRESHOLD || absLngDiff > this._CAMERA_MOVE_THRESHOLD ) {
      return true;
    }
    return false;
  } // _diffIsOverCameraMoveThreshold

}; // GeoLoc