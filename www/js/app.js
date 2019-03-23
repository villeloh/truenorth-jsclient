
/**
 * Overall holder for app initialization. GoogleMap.js is the real heart of the app.
 * @author Ville Lohkovuori (2019)
 */

const App = {

  google: null,

  // Application Constructor
  _initialize: function() {

    document.addEventListener('deviceready', this._onDeviceReady.bind(this), false);
  },

  _initServices: function() {

    GeoLoc.start(); // should be called first, as the location is needed below

    GoogleMapsLoader.KEY = Env.API_KEY;
    GoogleMapsLoader.LANGUAGE = 'en';
    GoogleMapsLoader.LIBRARIES = ['geometry', 'places'];

    GoogleMapsLoader.load(google => {

      this.google = google; // to be used throughout the app, so there's no need to pass it around

      Distance.init();
      GoogleMap.init();
      UI.init();
    }); // GoogleMapsLoader.load
  }, // _initServices

  // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX LIFECYCLE METHODS XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

  _onDeviceReady: function() {

    this._receivedEvent('deviceready');

    document.addEventListener("pause", this._onPause, false);
    document.addEventListener("resume", this._onResume, false);

    this._initServices();
  }, // _onDeviceReady

  _onPause: function() {

    GeoLoc.stop();
  },

  _onResume: function () {
    
    GeoLoc.start();
  },

  // Update DOM on a Received Event
  _receivedEvent: function(id) {
    
  // used to make the cordova logo blink in the demo app. USEFUL STUFF; DO NOT DELETE !!
  /*  const parentElement = document.getElementById(id);
    const listeningElement = parentElement.querySelector('.listening');
    const receivedElement = parentElement.querySelector('.received');

    listeningElement.setAttribute('style', 'display:none;');
    receivedElement.setAttribute('style', 'display:block;'); */

    // console.log('Received Event: ' + id);
  } // _receivedEvent

}; // App

App._initialize();