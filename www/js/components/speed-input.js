
/**
 * A simple input box for giving the estimated (average) cycling speed.
 * May change it to a slider for the final version.
 */

const SpeedInput = {

  INPUT_ID: 'speed-input',

  addTo: function(parentDiv) {

    parentDiv.innerHTML = `<input 
      type="number" 
      id=${SpeedInput.INPUT_ID} 
      step=1
      max=${Route.constants.MAX_SPEED} 
      value=${GoogleMap.getCyclist().getSpeed()} 
      oninput="SpeedInput.onValueChange(event)"
    >`;
  },

  // it doesn't need to be a part of GoogleMap, so i'm putting it here.
  // technically it's a violation of the general design principle of the app, 
  // but GoogleMap is crowded enough already.
  onValueChange: function(event) {

    const value = event.target.value;

    if (value > Route.constants.MAX_SPEED) {

      event.target.value = Route.constants.MAX_SPEED;
    } else if (value < 0) {

      event.target.value = 0;
    }

    if (Utils.isValidSpeed(event.target.value)) {

      GoogleMap.getCyclist().setSpeed(event.target.value);
    } else {
      GoogleMap.getCyclist().setSpeed(0);
    }

    if (GoogleMap.noDisplayedTrip()) return; // the cyclist always has a speed, but it's only used if there's a possible trip that's being displayed

    // update the top screen info header with the new duration.
    GoogleMap.getDisplayedTrip().duration = Utils.calcDuration(GoogleMap.getDisplayedTrip().distance, GoogleMap.getCyclist().getSpeed());
    InfoHeader.updateDuration(GoogleMap.getDisplayedTrip().duration);
  } // onValueChange

}; // SpeedInput