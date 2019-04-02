
/**
 * Overall holder for app initialization. GoogleMap.js is the real heart of the app.
 * @author Ville Lohkovuori (2019)
 */

const App = {

  google: null,
  geoLocService: null,

  // Application Constructor
  _initialize: function() {

    document.addEventListener('deviceready', this._onDeviceReady.bind(this), false);
  },

  _initServices: function() {

    // GeoLoc.start(); // should be called first, as the location is needed below

    GoogleMapsLoader.KEY = Env.API_KEY;
    GoogleMapsLoader.LANGUAGE = 'en';
    GoogleMapsLoader.LIBRARIES = ['geometry', 'places'];

    GoogleMapsLoader.load(google => {

      this.google = google; // to be used throughout the app, so there's no need to pass it around

      GoogleMap.init();
      UI.init();

      this.geoLocService = new GeoLocService(GoogleMap);
      this.geoLocService.start();
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

    this.geoLocService.stop();
  },

  _onResume: function () {
    
    this.geoLocService.start();
  },

  // Update DOM on a received event
  _receivedEvent: function(id) {

    // console.log('Received Event: ' + id);
  } // _receivedEvent

}; // App

App._initialize();