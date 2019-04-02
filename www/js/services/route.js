
/**
 * For services related to route fetching (via Google Maps' Directions api).
 */

const Route = {

  constants: {

    WALK_MODE: 'WALKING',
    CYCLE_MODE: 'BICYCLING',
    MAX_SPEED: 50, // km/h  
    DEFAULT_SPEED: 15 // km/h
  },

  _directionsService: null,

  init: function() {

    Route._directionsService = new App.google.maps.DirectionsService();
  }, // init

  fetch: function(cyclist) {

    const request = {

      origin: cyclist.getPosCoords(),
      destination: cyclist.getDestCoords(),
      travelMode: cyclist.getTravelMode(), // comes from the travel mode toggle button
      optimizeWaypoints: false,
      avoidHighways: true,
      waypoints: cyclist.getWayPointObjects()
    };
  
    Route._directionsService.route(request, function(result, status) {

      if (status == 'OK') {

        GoogleMap.onRouteFetchSuccess(result, cyclist);

      } else {

        console.log("Error fetching route: " + status);
      }
    }); // Route._directionsService.route
  }, // fetch

}; // Route