
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
      min=${Route.MIN_SPEED} 
      max=${Route.MAX_SPEED} 
      value=${Route.currentSpeed} 
      oninput="SpeedInput.onValueChange(event)"
    >`;
  },

  // it doesn't need to be a part of GoogleMap, so i'm putting it here.
  // maybe App.js should be the 'central hub' of the app though... creating
  // instances of the components and having references to them?
  onValueChange: function(event) {

    const value = event.target.value;

    if (value > Distance.MAX_SPEED) {

      event.target.value = Distance.MAX_SPEED;
    } else if (value < 0) {

      event.target.value = 0;
    }

    if (Utils.isValidSpeed(event.target.value)) {

      Route.currentSpeed = event.target.value;
    } else {
      Route.currentSpeed = 0;
    }
    // console.log("distance.currentSpeed: " + Distance.currentSpeed);
    // console.log("distance.currentDist: " + Distance.currentDist);

    // update the top screen info header with the new duration.
    Route.currentDura = Duration.calc(Route.currentDist, Route.currentSpeed);
    InfoHeader.updateDuration(); // uses the currentDura
  } // onValueChange

}; // SpeedInput