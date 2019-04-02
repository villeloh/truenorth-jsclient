
/**
 * For services related to route fetching (via Google Maps' Directions api).
 */

const Route = {

  constants: {

    _ROUTE_COLOR: '#2B7CFF', // darkish blue
    WALK_MODE: 'WALKING',
    CYCLE_MODE: 'BICYCLING'
  },


  DEFAULT_DIST: 0.0,
  DEFAULT_DURA: 0,
  DEFAULT_ADDR: 'n/a',
  DEFAULT_SPEED: 15, // km/h
  MAX_SPEED: 50,

  _travelMode: null,

  _wayPoints: [], // array of objects that contain a WayPoint object and the WayPointMarker associated with it
  _currentDest: null, // LatLng

  _currentSpeed: null,
  _currentDist: null,
  _currentDura: 0,

  _directionsService: null,
  _directionsRenderer: null,

  init: function() {

    Route.setCurrentDist(Route.DEFAULT_DIST);
    Route.setCurrentSpeed(Route.DEFAULT_SPEED);
    Route.setTravelMode(Route.CYCLE_MODE);

    Route._directionsService = new App.google.maps.DirectionsService();
    Route._directionsRenderer = new App.google.maps.DirectionsRenderer({
      draggable: false, // the dragging is way too sensitive to light presses, so I'm disabling it for now
      suppressMarkers: true,
      suppressBicyclingLayer: true,
      map: GoogleMap.getMap(),
      preserveViewport: true, // stops the auto-zooming on completed fetch
      polylineOptions: {
        // path: points,
        strokeColor: Route.constants._ROUTE_COLOR,
        strokeOpacity: 1.0,
        strokeWeight: 4,
        zIndex: 5,
        map: GoogleMap.getMap(),
        // editable: true,
        geodesic: true    
      }
    });
  }, // init

  fetch: function(cyclist) {

    const destCoords = cyclist.getDestCoords();
    const wayPoints = cyclist.getAllWayPointCoords();

    const request = {

      origin: GoogleMap.getCurrentPos().coords,
      destination: destCoords,
      travelMode: cyclist.getTravelMode(), // comes from the travel mode toggle button
      optimizeWaypoints: false,
      avoidHighways: true,
      waypoints: wayPoints
    };
  
    Route._directionsService.route(request, function(result, status) {

      if (status == 'OK') {

        GoogleMap.getDisplayedTrip().clear();
        GoogleMap.setDisplayedTrip(null);

        Route._directionsRenderer.setMap(GoogleMap.getMap()); // the map is set to null in GoogleMap.clearRoute
        Route._directionsRenderer.setDirections(result); // renders polyline on the map
        
        const route = result.routes[0];

        const dist = Route.distanceInKm(route);
        const dura = Utils.calcDuration(dist, cyclist.getSpeed());

        const tripToDisplay = new Trip(destCoords, wayPoints, dist, dura);

        GoogleMap.setDisplayedTrip(tripToDisplay);
        GoogleMap.getDisplayedTrip().displayOnMap();

        InfoHeader.updateDistance(dist);
        InfoHeader.updateDuration(dura);

      } else {

        console.log("Error fetching route: " + status);
      }
    }); // Route._directionsService.route
  }, // fetch

  distanceInKm: function(route) {

    let total = 0;
    for (let i = 0; i < route.legs.length; i++) {

      total += route.legs[i].distance.value;
    }
    return (total / 1000).toFixed(1);
  }, // distanceInKm

  // stops rendering the current route polyline on the map
  setRendererMapToNull: function() {

    Route._directionsRenderer.setMap(null);
  }

}; // Route