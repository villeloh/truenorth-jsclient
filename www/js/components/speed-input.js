
/**
 * A simple input box for giving the estimated (average) cycling speed.
 * May change it to a slider for the final version.
 */

const SpeedInput = {

  INPUT_ID: 'speed-input',

  mapService: null,

  addTo: function(parentDiv, mapService) {

    this.mapService = mapService;

    parentDiv.innerHTML = `<input 
      type="number" 
      id=${SpeedInput.INPUT_ID} 
      step=1
      max=${PlannedTrip.MAX_SPEED} 
      value=${this.mapService.plannedTrip.speed} 
      oninput="SpeedInput.onValueChange(event)"
    >`;
  }, // addTo

  // it doesn't need to be a part of MapService, so i'm putting it here.
  // technically it's a violation of the general design principle of the app, 
  // but MapService is crowded enough already.
  onValueChange: function(event) {

    const value = event.target.value;

    if (value > PlannedTrip.MAX_SPEED) {

      event.target.value = PlannedTrip.MAX_SPEED;
    } else if (value < 0) {

      event.target.value = 0;
    }

    if (Utils.isValidSpeed(event.target.value)) {

      this.mapService.plannedTrip.speed = event.target.value;
    } else {
      this.mapService.plannedTrip.speed = 0;
    }

    if (this.mapService.noVisualTrip()) return; // the PlannedTrip always has a speed, but it's only used if there's a possible trip that's being displayed

    // update the top screen info header with the new duration.
    this.mapService.visualTrip.duration = Utils.calcDuration(this.mapService.visualTrip.distance, this.mapService.plannedTrip.speed);
    InfoHeader.updateDuration(this.mapService.visualTrip.duration);
  } // onValueChange

}; // SpeedInput