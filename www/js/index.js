const app = {

  google: null,
  map: null,
  currentPos: {
    lat: 0,
    lng: 0
  },
  polyLines: [],

  geoLocationOptions: { 
    maximumAge: 3000, // use cached results that are max this old
    timeout: 5000, // call onGeoLocError if no success in this amount of ms
    enableHighAccuracy: true 
  },

  onGeoLocSuccess: position => {

    // i've no idea why tf 'this' doesn't work here
    app.currentPos.lat = position.coords.latitude;
    app.currentPos.lng = position.coords.longitude;
    console.log("position lat: " + app.currentPos.lat);
    app.initMap(app.currentPos);
  },

  onGeoLocError: function (error) {
      
    console.log("Error! Code: " + error.code);
    console.log("Error! Msg: " + error.message);
  },

  // Application Constructor
  initialize: function() {

    document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    const appDiv = document.getElementsByClassName('app')[0];
    // appDiv.addEventListener('touchstart', app.disableTouchStuffs);
    // document.body.addEventListener('touchstart', app.onTouchStart, { passive: true });
    // document.body.addEventListener('touchmove', app.onTouchMove, { passive: true });
    // document.body.addEventListener('touchend', app.onTouchEnd, { passive: true });
    // window.addEventListener('scroll', app.onScroll, { passive: true });
  },
  
  onScroll: function(event) {

    // event.preventDefault();
    console.log("scrolling: " + event);
  },

  onTouchStart: function(event) {

    // event.preventDefault();
    console.log("touch start: " + event);
  },

  onTouchMove: function(event) {

    // event.preventDefault();
    console.log("touch move: " + event);
  },

  onTouchEnd: function(event) {

    // event.preventDefault();
    console.log("touch end: " + event);
  },

  initMap: function(position) {

    // console.log("initMap called!");

    
    GoogleMapsLoader.KEY = API_KEY;
    GoogleMapsLoader.LANGUAGE = 'en';
    GoogleMapsLoader.LIBRARIES = ['geometry'];

    GoogleMapsLoader.load(google => {

      app.google = google;
      
      console.log("type of _: " + typeof window._);

      const map = new google.maps.Map(document.getElementById('map'), {zoom: 4, center: position, minZoom: 4});
      app.map = map;
      const marker = new google.maps.Marker({position: position, map: app.map});
      app.map.addListener('click', this.fetchRouteTo);

      const mapDiv = document.getElementById('map');
      mapDiv.addEventListener('touchstart', app.onTouchStart, { passive: true });
      mapDiv.addEventListener('touchmove', app.onTouchMove, { passive: true });
      mapDiv.addEventListener('touchend', app.onTouchEnd, { passive: true });
      
    });
  }, // initMap

  fetchRouteTo: function(event) {

    const fromLat = app.currentPos.lat;
    const fromLng = app.currentPos.lng;
    const toLat = event.latLng.lat(); // why in blazes they are functions is anyone's guess...
    const toLng = event.latLng.lng();

    console.log("called fetchRouteTo");
    // ideally, objects would be used, but i don't know how to properly include them in query strings like this one.
    // maybe try a POST query with an object body on it?
    const url = `https://us-central1-truenorth-backend.cloudfunctions.net/route/?fromLat=${fromLat}&fromLng=${fromLng}&toLat=${toLat}&toLng=${toLng}`;
    // const url = 'https://us-central1-truenorth-backend.cloudfunctions.net/test'

    const options = {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json'
      }
    };

    fetch(url, options).then( res => res.json() )
    .then(resAsJson => {
      
      console.log("response: " + resAsJson.points);

      app.clearMap();
      
      const decodedRoutePoints = app.decodePolyPoints(resAsJson.points);
      app.drawPolyLine(decodedRoutePoints);
    }).catch(e => {
      console.log("error! " + e);
    })
  }, // fetchRouteTo

  clearMap: function() {

    app.polyLines.forEach(line => { 
      line.setMap(null)
    });
    app.polyLines = [];
  },

  decodePolyPoints: function(encodedPoints) {

    // console.log("decoded stuffs: " + app.google.maps.geometry.encoding.decodePath(encodedPoints));
    return app.google.maps.geometry.encoding.decodePath(encodedPoints);
  },

  drawPolyLine: function(points) {

    const line = new google.maps.Polyline({
      path: points,
      strokeColor: '#FF0000',
      strokeOpacity: 1.0,
      strokeWeight: 4,
      zIndex: 5,
      map: app.map
    });

    app.polyLines.push(line);
  }, // drawPolyLine

  // Bind any cordova events here. Common events are:
  // 'pause', 'resume', etc.
  onDeviceReady: function() {
    this.receivedEvent('deviceready');

    // TODO: handle not having GPS on
    // console.log("api key: " + API_KEY);
    navigator.geolocation.getCurrentPosition(this.onGeoLocSuccess, this.onGeoLocError, this.geoLocationOptions);
  },

  // Update DOM on a Received Event
  receivedEvent: function(id) {
    
  // used to make the cordova logo blink in the demo app. USEFUL STUFF; DO NOT DELETE !!
  /*  const parentElement = document.getElementById(id);
    const listeningElement = parentElement.querySelector('.listening');
    const receivedElement = parentElement.querySelector('.received');

    listeningElement.setAttribute('style', 'display:none;');
    receivedElement.setAttribute('style', 'display:block;'); */

    console.log('Received Event: ' + id);
  }
};

app.initialize();