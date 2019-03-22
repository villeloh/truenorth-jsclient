const DEFAULT_ZOOM = 7;
const MIN_ZOOM = 4;
const ROUTE_COLOR = '#2B7CFF'; // darkish blue
const CAMERA_MOVE_THRESHOLD = 0.001; // the right value must be found experimentally
const PLACE_MARKER_URL = 'http://maps.google.com/mapfiles/kml/shapes/placemark_circle_highlight.png';

const MAP_TYPE = {

  NORMAL: 0,
  SATELLITE: 1,
  TERRAIN: 2,
  CYCLING: 3
};

// I guess things don't really need to be a part of it, but it's too much trouble to move
// everything out now
const app = {

  google: null,
  map: null,
  currentPos: {
    lat: 0,
    lng: 0
  },
  polyLines: [],
  markers: [],
  posMarker: null,
  destMarker: null,
  locTracker: null,
  bikeLayer: null,
  bikeLayerOn: false,

  geoLocationOptions: { 
    maximumAge: 3000, // use cached results that are max this old
    timeout: 5000, // call onGeoLocError if no success in this amount of ms
    enableHighAccuracy: true 
  },

  onGeoLocSuccess: position => {

    const newPos = {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    };

    // must be called before resetting currentPos below!
    if (app.diffIsOverCameraMoveThreshold(app.currentPos, newPos)) {

      app.reCenterMap(newPos); 
    }

    app.currentPos = newPos;
    app.updatePosMarker();
    console.log("location: " + app.currentPos.lat + ", " + app.currentPos.lng);
  }, // onGeoLocSuccess

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
        // mapTypeControlOptions: { style: google.maps.MapTypeControlStyle.DROPDOWN_MENU },
        mapTypeControl: false,
        rotateControl: false,
        scaleControl: false,
        tilt: 0,
        disableDoubleClickZoom: true // it needs to be disabled because doubletap is used to clear the map
      };

      const map = new google.maps.Map(document.getElementById('map'), mapOptions);

      app.map = map;

      app.map.addListener('click', this.fetchRouteTo);
      app.map.addListener('dblclick', this.clearMap);

      app.addLocationButton();
      app.addMapStyleToggleButtons();

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

  addMapStyleToggleButtons: function () {
    
    const buttonHolderDiv = document.createElement('div');
    MapStyleToggleButton(buttonHolderDiv, 'NORMAL', MAP_TYPE.NORMAL, app.onMapStyleToggleButtonClick);
    MapStyleToggleButton(buttonHolderDiv, 'SAT.', MAP_TYPE.SATELLITE, app.onMapStyleToggleButtonClick);
    MapStyleToggleButton(buttonHolderDiv, 'TERRAIN', MAP_TYPE.TERRAIN, app.onMapStyleToggleButtonClick);
    MapStyleToggleButton(buttonHolderDiv, 'CYCL.', MAP_TYPE.CYCLING, app.onMapStyleToggleButtonClick);
    buttonHolderDiv.style.display = 'flex'; // to spread the buttons out horizontally
    buttonHolderDiv.style.justifyContent = 'space-evenly';
    buttonHolderDiv.style.width = '80%';
    buttonHolderDiv.style.marginTop = '0.6rem';
    app.map.controls[google.maps.ControlPosition.TOP_CENTER].push(buttonHolderDiv);
  },

  onMapStyleToggleButtonClick: function (event) {

    console.log("clicked on a map style button!");
    console.log("button id: " + event.id);
    
    switch (event.id) {
      case MAP_TYPE.NORMAL:
        
        app.map.setMapTypeId(app.google.maps.MapTypeId.ROAD_MAP);
        break;
      case MAP_TYPE.SATELLITE:
        
        app.map.setMapTypeId(app.google.maps.MapTypeId.HYBRID);
        break;
      case MAP_TYPE.TERRAIN:
        
        app.map.setMapTypeId(app.google.maps.MapTypeId.TERRAIN);
        break;
      case MAP_TYPE.CYCLING:
        
        app.toggleBikeLayer();
        break;
    
      default:
        break;
    }
  }, // onMapStyleToggleButtonClick

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
      app.updateDestMarker({ lat: toLat, lng: toLng });

    }).catch(e => {
      console.log("error! " + e);
    })
  }, // fetchRouteTo

  // TODO: remove listeners also?
  clearMap: function() {

    /*
    app.markers.forEach(marker => {

      marker.setMap(null);
    }); */

    // removes the references to the markers
    // app.markers.length = 0;

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

  updateDestMarker: function (position) {

    if (app.destMarker !== null) {
      
      app.destMarker.setPosition(position);
    } else {
    
      app.destMarker = new google.maps.Marker({ position: position, map: app.map, draggable: true, crossOnDrag: false });
      app.destMarker.addListener('dragend', app.onMarkerDragEnd); // should these listeners be deleted explicitly when clearing the marker?
      app.destMarker.addListener('click', app.onMarkerTap);
    }
    // app.markers.push(marker); // the array is unnecessary i guess... keeping it for now
  }, // updateDestMarker

  updatePosMarker: function () {
    
    if (app.posMarker !== null) {

      app.posMarker.setPosition(app.currentPos);
    } else {
      
      app.posMarker = new google.maps.Marker({ position: app.currentPos, map: app.map, draggable: false, icon: PLACE_MARKER_URL });
    }
  }, // updatePosMarker

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

  toggleBikeLayer: function () {

    if (app.bikeLayerOn) {

      app.bikeLayer.setMap(null);
      app.bikeLayerOn = false;
    } else {

      if (app.bikeLayer === null) {

        app.bikeLayer = new google.maps.BicyclingLayer();
      }
      app.bikeLayer.setMap(app.map);
      app.bikeLayerOn = true;
    }
  },

  // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX HELPERS XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

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
}; // app

app.initialize();