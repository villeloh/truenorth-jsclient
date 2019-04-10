import { Nullable } from './../misc/types';
import LatLng from '../dataclasses/latng';
import App from '../app';

/**
 * Periodically updates the user's own position (via GPS).
 */

// TODO: handle not having GPS on / turning it off while using the app (rn it crashes the app)

export default class GeoLocService {

  private static readonly _CAMERA_MOVE_THRESHOLD = 0.001;
  private static readonly _MAX_AGE = 3000;
  private static readonly _TIME_OUT = 5000;
  private static readonly _OPTIONS = { 

    maximumAge: GeoLocService._MAX_AGE, // use cached results that are max this old
    timeout: GeoLocService._TIME_OUT, // call onError if no success in this amount of ms
    enableHighAccuracy: true
  };

  private _locTracker: number; // why it returns number is baffling tbh

  constructor() {

  } // constructor

  start() {

    const that = this;

    this._locTracker = navigator.geolocation.watchPosition(

      // its type comes from Cordova, I guess
      function(pos: Position) {

        that._onSuccess.bind(that); // for some odd reason, this trick is needed for the function to retain the correct 'this' reference
        that._onSuccess(pos);
      }, 
      this._onError, 
      GeoLocService._OPTIONS);
  } // start

  stop() {

    navigator.geolocation.clearWatch(this._locTracker);
  }

  _onSuccess(pos: Position) {

    const newCoords = new LatLng(pos.coords.latitude, pos.coords.longitude);
    const oldCoords = App.currentTrip.getPosCoords(); // TODO: update this
    
    App.routeService.plannedTrip.updatePosition(newCoords);

    if (this._diffIsOverCameraMoveThreshold(oldCoords, newCoords)) {

      App.mapService.reCenter(newCoords); 
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