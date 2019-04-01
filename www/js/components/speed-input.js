
/**
 * A simple input box for giving the estimated (average) cycling speed.
 * May change it to a slider for the final version.
 */

const SpeedInput = {

  INPUT_ID: 'speed-input',

  addTo: function(parentDiv) {

    let speed;
    if (GoogleMap.noTrip()) {

      speed = Constants.DEFAULT_SPEED;
    } else {
      speed = GoogleMap.getTrip().speed
    }

    parentDiv.innerHTML = `<input 
      type="number" 
      id=${SpeedInput.INPUT_ID} 
      step=1
      max=${Constants.MAX_SPEED} 
      value=${speed} 
      oninput="SpeedInput.onValueChange(event)"
    >`;
  },

  // it doesn't need to be a part of GoogleMap, so i'm putting it here.
  onValueChange: function(event) {

    const value = event.target.value;

    if (value > Constants.MAX_SPEED) {

      event.target.value = Constants.MAX_SPEED;
    } else if (value < 0) {

      event.target.value = 0;
    }

    if (Utils.isValidSpeed(event.target.value)) {

      GoogleMap.getTrip().speed = event.target.value;
    } else {
      GoogleMap.getTrip().speed = 0;
    }
    // console.log("distance.currentSpeed: " + Distance.currentSpeed);
    // console.log("distance.currentDist: " + Distance.currentDist);

    // update the top screen info header with the new duration.
    GoogleMap.getTrip().duration = Duration.calc(GoogleMap.getTrip().distance, GoogleMap.getTrip().speed);
    InfoHeader.updateDuration(GoogleMap.getTrip().duration);
  } // onValueChange

}; // SpeedInput