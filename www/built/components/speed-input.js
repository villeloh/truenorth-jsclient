/**
 * A simple input box for giving the estimated (average) cycling speed.
 * May change it to a slider for the final version.
 */
var SpeedInput = {
    INPUT_ID: 'speed-input',
    addTo: function (parentDiv) {
        parentDiv.innerHTML = "<input \n      type=\"number\" \n      id=" + SpeedInput.INPUT_ID + " \n      step=1\n      max=" + PlannedTrip.MAX_SPEED + " \n      value=" + App.routeService.plannedTrip.speed + " \n      oninput=\"SpeedInput.onValueChange(event)\"\n    >";
    },
    // technically it's a violation of the general design principle of the app to put this here, 
    // but I'm trying not to bloat App.js and this is the best candidate to tuck away in its own file.
    onValueChange: function (event) {
        var value = event.target.value;
        if (value > PlannedTrip.MAX_SPEED) {
            event.target.value = PlannedTrip.MAX_SPEED;
        }
        else if (value < 0) {
            event.target.value = 0;
        }
        if (Utils.isValidSpeed(event.target.value)) {
            App.routeService.plannedTrip.speed = event.target.value;
        }
        else {
            App.routeService.plannedTrip.speed = 0;
        }
        if (App.mapService.noVisualTrip)
            return; // the plannedTrip always has a speed, but it's only used if there's a possible trip that's being displayed
        // update the top screen info header with the new duration.
        App.mapService.visualTrip.duration = Utils.calcDuration(App.mapService.visualTrip.distance, App.routeService.plannedTrip.speed);
        InfoHeader.updateDuration(App.mapService.visualTrip.duration);
    } // onValueChange
}; // SpeedInput
