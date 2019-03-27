
/**
 * Deals with calculating the distance (and travel duration) between two locations.
 */

const Distance = {

  DEFAULT_SPEED: 15, // km/h
  MAX_SPEED: 50,
  currentSpeed: 0,
  currentDist: 0,

  DEFAULT_DIST: 0.0,
  DEFAULT_DUR: 0,
  DEFAULT_ADDR: 'n/a',

  service: null,
  options: null,

  init: function() {

    this.currentSpeed = this.DEFAULT_SPEED;
    this.service = new App.google.maps.DistanceMatrixService();
    this.options = {
      origins: [],
      destinations: [],
      travelMode: 'BICYCLING',
      unitSystem: App.google.maps.UnitSystem.METRIC,
      avoidHighways: true,
      avoidTolls: false
    };
  }, // init

  // takes latLngs
  between: function(from, to) {

    this.options.origins[0] = from;
    this.options.destinations[0] = to;

    let distance = Distance.DEFAULT_DIST;
    let duration = Distance.DEFAULT_DUR;
    let address = Distance.DEFAULT_ADDR;
  
    this.service.getDistanceMatrix(this.options, function(response, status) {

      const responseStatus = response.rows[0].elements[0].status;

      if (status !== 'OK' || responseStatus !== 'OK') {
  
        console.log('Error calculating distance!');
        console.log('status: ' + status);
        console.log('response status: ' + responseStatus);
        duration = Duration.calc(0, 0); // the 'calculation' is needed in order to format the result correctly
      } else {

        // console.log("res: " + JSON.stringify(response));
  
        address = response.destinationAddresses[0];
        // distance = response.rows[0].elements[0].distance.text;
        distance = response.rows[0].elements[0].distance.value / 1000; // it arrives as meters
        Distance.currentDist = distance;

        duration = Duration.calc(distance, Distance.currentSpeed);
          
        // the async / obscure nature of getDistanceMatrix means this has to be done here.
        // only update the dist/dura if the new route is valid (otherwise the old one remains active)
        const infoText = InfoHeader.formattedText(distance, duration);
        InfoHeader.update(infoText); // between() could take this as a callback, but it's more confusing that way imo
      } // if-else
    }); // getDistanceMatrix
  }, // between

}; // Distance