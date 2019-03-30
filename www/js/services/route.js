
/**
 * For services related to route fetching (via Google Maps' Directions api).
 */

const Route = {

  wayPoints: [],
  destination: null,

  DEFAULT_SPEED: 15, // km/h
  MAX_SPEED: 50,
  currentSpeed: 0,
  currentDist: 0,
  currentDura: 0,

  DEFAULT_DIST: 0.0,
  DEFAULT_DUR: 0,
  DEFAULT_ADDR: 'n/a',

  _directionsService: null,
  _directionsRenderer: null,

  init: function() {

    Route.currentSpeed = Route.DEFAULT_SPEED;
    console.log("route.currenspeed: " + Route.currentSpeed);

    Route._directionsService = new App.google.maps.DirectionsService();
    Route._directionsRenderer = new App.google.maps.DirectionsRenderer({
      draggable: true,
      map: GoogleMap.getMap()
    });

    // dragging the route triggers this event, I guess
    Route._directionsRenderer.addListener('directions_changed', function() {

      const route = Route._directionsRenderer.getDirections().routes[0];

      Route.currentDist = Route.distanceInKm(route);
      InfoHeader.updateDistance(); // uses the currentDist

      Route.currentDura = Duration.calc(Route.currentDist, Route.currentSpeed);
      InfoHeader.updateDuration(); // uses the currentDura
    });  

  }, // init

  fetch: function(destination) {

    const request = {

      origin: GeoLoc.currentPos,
      destination: destination,
      travelMode: 'WALKING', // TODO: get it from the travel mode toggle button
      optimizeWaypoints: false,
      avoidHighways: true,
      waypoints: Route.wayPoints
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
        GoogleMap.clear(); // this leads to double clears if you re-fetch after clearing the route manually (with double click), but ehh, whatever
        Route._directionsRenderer.setMap(GoogleMap.getMap()); // the map is set to null in GoogleMap.clear
        Route._directionsRenderer.setDirections(result); // renders polyline on the map

        GoogleMap.updateDestMarker(destination);

        const route = result.routes[0];
        Route.currentDist = Route.distanceInKm(route);
        InfoHeader.updateDistance(); // uses the currentDist

        Route.currentDura = Duration.calc(Route.currentDist, Route.currentSpeed);
        InfoHeader.updateDuration(); // uses the currentDura

      } else {

        console.log("Error fetching route: " + status);
      }
    }); // Route._directionsService.route
  }, // fetch

  to: function(event) {

    const fromLat = GeoLoc.currentPos.lat;
    const fromLng = GeoLoc.currentPos.lng;
    const toLat = event.latLng.lat(); // why in blazes they are functions is anyone's guess...
    const toLng = event.latLng.lng();

    Distance.between({ lat: fromLat, lng: fromLng}, { lat: toLat, lng: toLng });

    // TODO: replace with client-side directions api call ??
    // ideally, objects would be used here, but i don't know how to properly include them in query strings like this one.
    // maybe try a POST query with an object body on it?
    const url = `https://us-central1-truenorth-backend.cloudfunctions.net/route/?fromLat=${fromLat}&fromLng=${fromLng}&toLat=${toLat}&toLng=${toLng}`;

    const options = {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json'
      }
    };

    fetch(url, options).then( res => res.json() )
    .then(resAsJson => {
      
      GoogleMap.clear(); // only clear on proper response (clicking on water won't lose the old route)
      // console.log("response: " + resAsJson.points);
      
      const decodedRoutePoints = Utils.decodePolyPoints(resAsJson.points);
      GoogleMap.drawPolyLine(decodedRoutePoints);
      GoogleMap.updateDestMarker({ lat: toLat, lng: toLng });

    }).catch(e => {

      console.log("error! " + e);
    })
  }, // to

  distanceInKm: function(route) {

    let total = 0;
    for (let i = 0; i < route.legs.length; i++) {

      total += route.legs[i].distance.value;
    }
    return (total / 1000).toFixed(1);
  }, // distanceInKm

  getRenderer: function() {

    return Route._directionsRenderer;
  }

}; // Route