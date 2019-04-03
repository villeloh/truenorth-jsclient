
/**
 * For fetching the route (via Google Maps' Directions api).
 */

// it could be a static object, I guess. but in case it needs to be 
// set to null under some circumstances, I'm making it a function for now.
function RouteService(onFetchSuccessCallback, onFetchFailureCallback) {

  this._dirService = new App.google.maps.DirectionsService();

  this.fetchFor = function(plannedTrip) {

    const destCoords = plannedTrip.destCoords;

    // null destCoords sometimes reach this method (after clicking on water twice or more in a row).
    // for now, it's an unavoidable side effect of the way the plannedTrip state is managed.
    if (destCoords === null) return; 

    const request = {

      origin: plannedTrip.getPosCoords(),
      destination: destCoords,
      travelMode: plannedTrip.travelMode, // comes from the travel mode toggle button
      optimizeWaypoints: false,
      avoidHighways: true,
      waypoints: plannedTrip.wayPointObjects
    }; // request
  
    this._dirService.route(request, function(result, status) {

      if (status === 'OK') {

        // in practice, GoogleMap's onRouteFetchSuccess
        onFetchSuccessCallback(result, plannedTrip);

      } else {

        console.log("Error fetching route: " + status);
        onFetchFailureCallback();
      }
    }); // this._dirService.route
  } // fetchFor

} // RouteService