
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
      min=${Distance.MIN_SPEED} 
      max=${Distance.MAX_SPEED} 
      value=${Distance.currentSpeed} 
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

      Distance.currentSpeed = event.target.value;
    } else {
      Distance.currentSpeed = 0;
    }
    // console.log("distance.currentSpeed: " + Distance.currentSpeed);
    // console.log("distance.currentDist: " + Distance.currentDist);

    // update the top screen info header with the new duration.
    // this should really be moved somewhere else... maybe make some kind of 
    // manager to manage speed, duration, distance, etc?
    const formattedDuraText = Duration.calc(Distance.currentDist, Distance.currentSpeed);
    const text = InfoHeader.formattedText(Distance.currentDist, formattedDuraText);
    InfoHeader.update(text);
  } // onValueChange

}; // SpeedInput