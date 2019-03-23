
/**
 * For services related to route fetching (via Google Maps' Directions api).
 */

const Route = {

  to: function(event) {

    const fromLat = GeoLoc.currentPos.lat;
    const fromLng = GeoLoc.currentPos.lng;
    const toLat = event.latLng.lat(); // why in blazes they are functions is anyone's guess...
    const toLng = event.latLng.lng();

    // rn it only console.logs stuff. TODO: display distance & duration in ui
    Distance.between({ lat: fromLat, lng: fromLng}, { lat: toLat, lng: toLng }, 15);

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
      
      // console.log("response: " + resAsJson.points);

      GoogleMap.clear();
      
      const decodedRoutePoints = GoogleMap.decodePolyPoints(resAsJson.points);
      GoogleMap.drawPolyLine(decodedRoutePoints);
      GoogleMap.updateDestMarker({ lat: toLat, lng: toLng });

    }).catch(e => {

      console.log("error! " + e);
    })
  } // to

}; // Route