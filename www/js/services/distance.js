
/**
 * Deals with calculating the distance (and travel duration) between two locations.
 */

const Distance = {

  DEFAULT_SPEED: 15, // km/h
  MAX_SPEED: 50,
  currentSpeed: null,

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

  // takes latLngs, and the speed in km/h
  between: function(from, to) {

    this.options.origins[0] = from;
    this.options.destinations[0] = to;
    let distance = 'N/A';
    let duration = 'N/A';
    let address = 'N/A';
  
    this.service.getDistanceMatrix(this.options, function(response, status) {

      const responseStatus = response.rows[0].elements[0].status;

      if (status !== 'OK' || responseStatus !== 'OK') {
  
        console.log('Error calculating distance!');
        console.log('status: ' + status);
        console.log('response status: ' + responseStatus);
      } else {

        // console.log("res: " + JSON.stringify(response));
  
        address = response.destinationAddresses[0];
        distance = response.rows[0].elements[0].distance.text;

        const distInKm = response.rows[0].elements[0].distance.value / 1000; // it arrives as meters

        let duraInDecimHours = 0;

        if (Distance.currentSpeed < 1 || Distance.currentSpeed === null || Distance.currentSpeed === "" || Distance.currentSpeed === undefined) {

          duraInDecimHours = 'N/A';
          console.log("distance: " + distance + "; " + "duration: " + duraInDecimHours);

        } else {
          duraInDecimHours = distInKm / Distance.currentSpeed;
          duration = Distance._formatDuration(duraInDecimHours);
          console.log("distance: " + distance + "; " + "duration: " + duration);
        }
      }}); // getDistanceMatrix
    
      return { distance: distance, duration: duration, address: address };
  }, // between

  // convert the duration to a more readable format (hours + minutes)
  _formatDuration: function(duraInDecimHours) {
    
    const hours = Math.trunc(duraInDecimHours);
    const decimPart = duraInDecimHours - hours;
    const minutes = Math.round(decimPart * 60);
    return `${hours} h ${minutes} m`;
  }

}; // Distance