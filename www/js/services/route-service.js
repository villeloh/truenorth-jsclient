
/**
 * For fetching the route (via Google Maps' Directions api).
 */

// it could be a static object, I guess. but in case it needs to be 
// set to null under some circumstances, I'm making it a function for now.
function RouteService(onFetchSuccessCallback, onFetchFailureCallback) {

  this._dirService = new App.google.maps.DirectionsService();

  this.fetchFor = function(plannedTrip) {

    const request = {

      origin: plannedTrip.getPosCoords(),
      destination: plannedTrip.getDestCoords(),
      travelMode: plannedTrip.getTravelMode(), // comes from the travel mode toggle button
      optimizeWaypoints: false,
      avoidHighways: true,
      waypoints: plannedTrip.getWayPointObjects()
    };
  
    this._dirService.route(request, function(result, status) {

      if (status === 'OK') {

        // in practice, GoogleMap's onRouteFetchSuccess
        onFetchSuccessCallback(result, plannedTrip);

      } else {

        console.log("Error fetching route: " + status);
        onFetchFailureCallback();
      }
    }); // Route._directionsService.route
  } // fetchFor

} // RouteService