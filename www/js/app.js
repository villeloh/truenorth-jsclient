const DEFAULT_ZOOM = 7;
const MIN_ZOOM = 4;
const ROUTE_COLOR = '#2B7CFF'; // darkish blue
const CAMERA_MOVE_THRESHOLD = 0.00001; // the right value must be found experimentally

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

  /*
  // called once to set up the map
  onInitialGeoLocSuccess: position => {

        app.currentPos.lat = position.coords.latitude;
        app.currentPos.lng = position.coords.longitude;
    
        if (app.map !== null) return;
    
        app.initMap(app.currentPos);
  }, */

  onGeoLocSuccess: position => {

    const newPos = {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    };

    if (app.diffIsOverCameraMoveThreshold(app.currentPos, newPos)) {

      app.reCenterMap(newPos); // must be called before resetting currentPos below!
    }

    app.currentPos = newPos;
    console.log("location: " + app.currentPos.lat + ", " + app.currentPos.lng);
  },

  onGeoLocError: function (error) {
      
    console.log("Error! Code: " + error.code);
    console.log("Error! Msg: " + error.message);
  },

  reCenterMap: function (pos) {
    
    app.map.setCenter(pos);
  },

  // make the camera auto-follow the user only if the change in position is significant enough (i.e., they're cycling).
  // TODO: implement Position objects which have a magnitude comparison method on them?
  diffIsOverCameraMoveThreshold: function(oldPos, newPos) {

    const absLatDiff = Math.abs(Math.abs(oldPos.lat) - Math.abs(newPos.lat));
    const absLngDiff = Math.abs(Math.abs(oldPos.lng) - Math.abs(newPos.lng));

    if ( absLatDiff > CAMERA_MOVE_THRESHOLD || absLngDiff > CAMERA_MOVE_THRESHOLD ) {
      return true;
    }
    return false;
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
        tilt: 0,
        disableDoubleClickZoom: true // it needs to be disabled because doubletap is used to clear the map
      };

      const map = new google.maps.Map(document.getElementById('map'), mapOptions);

      app.map = map;

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

    // buttonHolderDiv.index = 1; // wtf does this do ?? is it the same as z-index ?
    app.map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(buttonHolderDiv);
  },

  onLocButtonClick: function() {

    app.reCenterMap(app.currentPos);
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
      app.placeMarker({ lat: toLat, lng: toLng });

    }).catch(e => {
      console.log("error! " + e);
    })
  }, // fetchRouteTo

  // TODO: remove listeners also?
  clearMap: function() {

    app.markers.forEach(marker => {

      marker.setMap(null);
    });

    // removes the references to the markers
    app.markers.length = 0;

    app.polyLines.forEach(line => { 
      line.setMap(null);
    });
    app.polyLines.length = 0;
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
      strokeColor: ROUTE_COLOR,
      strokeOpacity: 1.0,
      strokeWeight: 4,
      zIndex: 5,
      map: app.map
    });

    app.polyLines.push(line);
  }, // drawPolyLine

  placeMarker: function (position) {
    
    const marker = new google.maps.Marker({ position: position, map: app.map, draggable: true });
    marker.addListener('dragend', app.onMarkerDragEnd);
    marker.addListener('click', app.onMarkerTap);

    app.markers.push(marker);
  },

  onMarkerDragEnd: function(event) {
    
    // console.log("called onMarkerDragEnd");

    app.clearMap();
    app.fetchRouteTo(event);
  },

  onMarkerTap: function (event) {
    
    console.log("tap event: " + JSON.stringify(event));
    // TODO: open an info window with place info. where to get it though? 
    // the event object doesn't contain it...
  },

  trackLocation: function() {

    app.locTracker = navigator.geolocation.watchPosition(app.onGeoLocSuccess, app.onGeoLocError, app.geoLocationOptions);
  },

  // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX LIFECYCLE METHODS ETC XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

  onDeviceReady: function() {

    this.receivedEvent('deviceready');

    document.addEventListener("pause", app.onPause, false);
    document.addEventListener("resume", app.onResume, false);

    // TODO: handle not having GPS on
    // navigator.geolocation.getCurrentPosition(this.onGeoLocSuccess, this.onGeoLocError, this.geoLocationOptions);
    app.trackLocation();
    app.initMap(app.currentPos);
  },

  onPause: function() {

    // stop tracking location
    navigator.geolocation.clearWatch(app.locTracker);
  },

  onResume: function () {
    
    app.trackLocation();
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