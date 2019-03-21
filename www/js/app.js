const DEFAULT_ZOOM = 7;
const MIN_ZOOM = 4;

const app = {

  google: null,
  map: null,
  currentPos: {
    lat: 0,
    lng: 0
  },
  polyLines: [],
  markers: [],
  locTracker: null,

  geoLocationOptions: { 
    maximumAge: 3000, // use cached results that are max this old
    timeout: 5000, // call onGeoLocError if no success in this amount of ms
    enableHighAccuracy: true 
  },

  onInitialGeoLocSuccess: position => {

        app.currentPos.lat = position.coords.latitude;
        app.currentPos.lng = position.coords.longitude;
    
        if (app.map !== null) return;
    
        app.initMap(app.currentPos);
  },

  onGeoLocSuccess: position => {

    app.currentPos.lat = position.coords.latitude;
    app.currentPos.lng = position.coords.longitude;
    console.log("location: " + app.currentPos.lat + ", " + app.currentPos.lng);
  },

  onGeoLocError: function (error) {
      
    console.log("Error! Code: " + error.code);
    console.log("Error! Msg: " + error.message);
  },

  // Application Constructor
  initialize: function() {

    document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
  },

  initMap: function(position) {

    // console.log("initMap called!");

    GoogleMapsLoader.KEY = API_KEY;
    GoogleMapsLoader.LANGUAGE = 'en';
    GoogleMapsLoader.LIBRARIES = ['geometry'];

    GoogleMapsLoader.load(google => {

      app.google = google;

      const mapOptions = {

        center: position,
        zoom: DEFAULT_ZOOM, 
        minZoom: MIN_ZOOM, 
        fullscreenControl: false,
        gestureHandling: 'greedy',
        mapTypeControlOptions: { style: google.maps.MapTypeControlStyle.DROPDOWN_MENU },
        rotateControl: false,
        scaleControl: false,
        tilt: 0
      };

      const map = new google.maps.Map(document.getElementById('map'), mapOptions);

      app.map = map;
      const marker = new google.maps.Marker({position: position, map: app.map});
      app.markers.push(marker);

      app.map.addListener('click', this.fetchRouteTo);
      app.map.addListener('dblclick', this.clearMap);

      const bikeLayer = new google.maps.BicyclingLayer();
      bikeLayer.setMap(app.map);

      app.addLocationButton();

        /*
      const mapDiv = document.getElementById('map');
      mapDiv.addEventListener('touchstart', app.onTouchStart, { passive: true });
      mapDiv.addEventListener('touchmove', app.onTouchMove, { passive: true });
      mapDiv.addEventListener('touchend', app.onTouchEnd, { passive: true }); */
    });
  }, // initMap

  addLocationButton: function() {

    const buttonHolderDiv = document.createElement('div');
    const locButton = new LocationButton(buttonHolderDiv, app.onLocButtonClick);

    buttonHolderDiv.index = 1; // wtf does this do ??
    app.map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(buttonHolderDiv);
  },

  onLocButtonClick: function() {

    app.map.setCenter(app.currentPos);
  },

  fetchRouteTo: function(event) {

    const fromLat = app.currentPos.lat;
    const fromLng = app.currentPos.lng;
    const toLat = event.latLng.lat(); // why in blazes they are functions is anyone's guess...
    const toLng = event.latLng.lng();

    // console.log("called fetchRouteTo");
    // ideally, objects would be used, but i don't know how to properly include them in query strings like this one.
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

      app.clearMap();
      
      const decodedRoutePoints = app.decodePolyPoints(resAsJson.points);
      app.drawPolyLine(decodedRoutePoints);
    }).catch(e => {
      console.log("error! " + e);
    })
  }, // fetchRouteTo

  clearMap: function() {

    app.markers.forEach(marker => {

      marker.setMap(null);
    });
    app.markers = [];

    app.polyLines.forEach(line => { 
      line.setMap(null);
    });
    app.polyLines = [];
  }, // clearMap

  decodePolyPoints: function(encodedPoints) {

    // console.log("decoded stuffs: " + app.google.maps.geometry.encoding.decodePath(encodedPoints));
    return app.google.maps.geometry.encoding.decodePath(encodedPoints);
  },

  drawPolyLine: function(points) {

    // should never happen, but just in case
    if (app.map === null) return;

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

    document.addEventListener("pause", app.onPause, false);
    document.addEventListener("resume", app.onResume, false);

    // TODO: handle not having GPS on
    navigator.geolocation.getCurrentPosition(this.onInitialGeoLocSuccess, this.onGeoLocError, this.geoLocationOptions);
    app.trackLocation();
  },

  onPause: function() {

    // stop tracking location
    navigator.geolocation.clearWatch(app.locTracker);
  },

  onResume: function () {
    
    app.trackLocation();
  },

  trackLocation: function() {

    app.locTracker = navigator.geolocation.watchPosition(app.onGeoLocSuccess, app.onGeoLocError, app.geoLocationOptions);
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
  }
};

app.initialize();