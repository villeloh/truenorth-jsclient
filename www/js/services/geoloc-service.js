/**
 * Periodically updates the user's own position (via GPS).
 */

// TODO: handle not having GPS on / turning it off while using the app (rn it crashes the app)

class GeoLocService {

  static get _CAMERA_MOVE_THRESHOLD() { return 0.001; };
  static get _MAX_AGE() { return 3000; };
  static get _TIME_OUT() { return 5000; };

  constructor(mapService) {

    this._mapService = mapService;
    this._locTracker = null;
    this._options = { 
      maximumAge: GeoLocService._MAX_AGE, // use cached results that are max this old
      timeout: GeoLocService._TIME_OUT, // call onError if no success in this amount of ms
      enableHighAccuracy: true
    }
  } // constructor

  start() {

    const that = this;

    this._locTracker = navigator.geolocation.watchPosition(
      function(pos) {

        that._onSuccess.bind(that); // for some odd reason, this trick is needed for the function to retain the correct 'this' reference
        that._onSuccess(pos);
      }, 
      this._onError, 
      this._options);
  } // start

  stop() {

    navigator.geolocation.clearWatch(this._locTracker);
  }

  _onSuccess(pos) {

    const newCoords = new LatLng(pos.coords.latitude, pos.coords.longitude);
    const oldCoords = this._mapService.plannedTrip.getPosCoords();
    
    this._mapService.plannedTrip.updatePosition(newCoords);

    if (this._diffIsOverCameraMoveThreshold(oldCoords, newCoords)) {

      this._mapService.reCenter(newCoords); 
    }
  } // _onSuccess

  _onError(error) {
      
    console.log("GeoLoc error! Code: " + error.code);
    console.log("GeoLoc error! Msg: " + error.message);
  }

  // make the camera auto-follow the user only if the change in position is significant enough (i.e., they're cycling).
  _diffIsOverCameraMoveThreshold(oldPos, newPos) {

    const diff = oldPos.differenceFrom(newPos);

    return diff > GeoLocService._CAMERA_MOVE_THRESHOLD;
  } // _diffIsOverCameraMoveThreshold

} // GeoLocService