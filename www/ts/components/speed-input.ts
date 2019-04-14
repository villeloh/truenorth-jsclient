
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
      max=${App.MAX_SPEED} 
      value=${App.speed} 
      oninput="SpeedInput.onValueChange(event)"
    >`;
  }, // addTo

  // technically it's a violation of the general design principle of the app to put this here, 
  // but I'm trying not to bloat App.ts and this is the best candidate to tuck away in its own file.
  onValueChange: function(event) {

    const value = event.target.value;

    if (value > App.MAX_SPEED) {

      event.target.value = App.MAX_SPEED;
    } else if (value < 0) {

      event.target.value = 0;
    }

    if (Utils.isValidSpeed(event.target.value)) {

      App.speed = event.target.value;
    } else {
      App.speed = 0;
    }

    if (App.noCurrentDest) return; // the planned trip always has a speed, but it's only used if there's a possible trip that's being displayed

    // update the top screen info header with the new duration.
    App.currentTrip.duration = Utils.calcDuration(App.currentTrip.distance, App.speed);
    InfoHeader.updateDuration(App.currentTrip.duration);
  } // onValueChange

}; // SpeedInput

export default SpeedInput;