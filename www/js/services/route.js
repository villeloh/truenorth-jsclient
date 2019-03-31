
/**
 * For services related to route fetching (via Google Maps' Directions api).
 */

const Route = {

  WALK_MODE: 'WALKING',
  CYCLE_MODE: 'BICYCLING',
  _travelMode: null,

  _wayPoints: [],
  currentDest: null,

  DEFAULT_SPEED: 15, // km/h
  MAX_SPEED: 50,
  currentSpeed: 0,
  currentDist: 0,
  currentDura: 0,

  DEFAULT_DIST: 0.0,
  DEFAULT_DURA: 0,
  DEFAULT_ADDR: 'n/a',

  _directionsService: null,
  _directionsRenderer: null,

  init: function() {

    Route.currentDist = Route.DEFAULT_DIST;
    Route.currentSpeed = Route.DEFAULT_SPEED;
    Route._travelMode = Route.CYCLE_MODE;

    Route._directionsService = new App.google.maps.DirectionsService();
    Route._directionsRenderer = new App.google.maps.DirectionsRenderer({
      draggable: false, // the dragging is way too sensitive to light presses, so I'm disabling it for now
      suppressMarkers: true,
      suppressBicyclingLayer: true,
      map: GoogleMap.getMap(),
      preserveViewport: true, // stops the auto-zooming on completed fetch
      polylineOptions: {
        // path: points,
        strokeColor: GoogleMap._ROUTE_COLOR,
        strokeOpacity: 1.0,
        strokeWeight: 4,
        zIndex: 5,
        map: GoogleMap.getMap(),
        // editable: true,
        geodesic: true    
      }
    });
/*
    // dragging the route triggers this event
    Route._directionsRenderer.addListener('directions_changed', function() {

      const route = Route._directionsRenderer.getDirections().routes[0];

      Route.currentDist = Route.distanceInKm(route);
      InfoHeader.updateDistance(); // uses the currentDist

      Route.currentDura = Utils.calcDuration(Route.currentDist, Route.currentSpeed);
      InfoHeader.updateDuration(); // uses the currentDura
    }); */
  }, // init

  fetch: function(destination) {

    const request = {

      origin: GeoLoc.currentPos,
      destination: destination,
      travelMode: Route._travelMode, // comes from the travel mode toggle button
      optimizeWaypoints: false,
      avoidHighways: true,
      waypoints: Route._wayPoints
    };
  
    Route._directionsService.route(request, function(result, status) {

      if (status == 'OK') {

        // .routes[0].overview_polyline.points;
        // .routes[0].overview_path; // contains the LatLngs

        // .routes[0].legs; // array containing the legs from waypoint to waypoint

        // leg.distance.value; // the length of the leg in meters
        // leg.start_address;
        // leg.end_address;
        // leg.steps; // array containing the steps of the leg
        // step.path; // array of LatLngs that describe the actual polypath

        /**
         * waypoint: { location: LatLng }
         */
        Route.currentDest = destination;
        /* console.log("dest in fetch: " + Route.currentDest.lat + ", " + Route.currentDest.lng);

        console.log("wps in fetch: ");
        Route._wayPoints.forEach(wp => {

          console.log(wp.location.lat + ", " + wp.location.lng);
        }); */

        GoogleMap.clearRoute(); // this leads to double clears if you re-fetch after clearing the route manually, but ehh, whatever
        Route._directionsRenderer.setMap(GoogleMap.getMap()); // the map is set to null in GoogleMap.clearRoute
        Route._directionsRenderer.setDirections(result); // renders polyline on the map

        GoogleMap.updateDestMarker(Route.currentDest);

        const route = result.routes[0];
        Route.currentDist = Route.distanceInKm(route);
        InfoHeader.updateDistance(); // uses the currentDist

        Route.currentDura = Utils.calcDuration(Route.currentDist, Route.currentSpeed);
        InfoHeader.updateDuration(); // uses the currentDura

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

  getRenderer: function() {

    return Route._directionsRenderer;
  },

  addWayPointObject: function(wayPoint) {

    Route._wayPoints.push(wayPoint);
  },

  deleteWayPointObject: function(index) {

    Route._wayPoints.splice(index, 1);
  },

  clearWayPointObjects: function() {

    Route._wayPoints.length = 0;
  },

  getWayPointArrayLength: function() {

    return Route._wayPoints.length;
  },

  updateWayPoint: function(index, wayPoint) {

    Route._wayPoints[index] = wayPoint;
  },

  // called by the walking/cycling mode toggle button
  setTravelMode: function(travelMode) {

    Route._travelMode = travelMode;
  }

}; // Route