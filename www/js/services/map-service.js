/**
 * The map and the various methods and actions on it.
 */

// I couldn't think of a better name for it. 'Container' would imply it's a pure ui element;
// 'GoogleMap' confuses it with the embedded map element. 'Service' is really supposed to be 
// something that does things periodically, but for now this will have to do. 
class MapService {

  static get MARKER_DRAG_TIMEOUT() { return 100; }

  static get _DEFAULT_ZOOM() { return 8; }
  static get _MIN_ZOOM() { return 5; }
  static get _INITIAL_CENTER_COORDS() { return new LatLng(0,0); }

  constructor() {

    // needed in ClickHandler in order not to fire a superfluous route fetch on long press  
    this.markerDragEventJustStopped = false;

    const mapOptions = {

      center: MapService._INITIAL_CENTER_COORDS,
      zoom: MapService._DEFAULT_ZOOM, 
      minZoom: MapService._MIN_ZOOM,
      fullscreenControl: false,
      gestureHandling: 'greedy',
      mapTypeControl: false,
      // mapTypeControlOptions: { style: google.maps.MapTypeControlStyle.DROPDOWN_MENU },
      rotateControl: false,
      scaleControl: false,
      tilt: 0,
      disableDoubleClickZoom: true // it needs to be disabled because doubletap is used to add waypoints
    }; // mapOptions

    this.mapHolderDiv = document.getElementById('map');

    this.map = new App.google.maps.Map(this.mapHolderDiv, mapOptions);

    this.visualTrip = null;

    this.bikeLayer = new App.google.maps.BicyclingLayer();
    this.bikeLayerOn = false;

    this.routeRenderer = new RouteRenderer(this.map); // for showing fetched routes on the map

    this.clickHandler = new ClickHandler();

    this._setListeners();
  } // constructor

  fullClear = () => {

    App.routeService.deletePlannedTrips();
    this.deleteVisualTrip();

    InfoHeader.reset();
  } // fullClear

  showVisualTripOnMap = () => {

    this.visualTrip.displayOnMap(this.map);
  }
  
  // called from Route.js on every route fetch
  deleteVisualTrip = () => {

    if (this.noVisualTrip) return;

    this.routeRenderer.clearPolyLine();
    
    this.visualTrip.clear();
    this.visualTrip = null;
  } // deleteVisualTrip

  get noVisualTrip() {
    
    return this.visualTrip === null;
  }

  reCenter = (newCoords) => {
    
    this.map.setCenter(newCoords);
  }
  
  // called from ui.js to add the map ui controls
  addUIControl = (position, control) => {

    this.map.controls[position].push(control);
  }

  toggleBikeLayer = (event) => {

    const toggleBtn = event.target.parentElement;

    if (this.bikeLayerOn) {

      CyclingLayerToggleButton.applyOffStyles(toggleBtn);
      this.bikeLayer.setMap(null);
      this.bikeLayerOn = false;
    } else {

      CyclingLayerToggleButton.applyOnStyles(toggleBtn);
      this.bikeLayer.setMap(this.map);
      this.bikeLayerOn = true;
    }
  } // toggleBikeLayer

  // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX GETTERS & SETTERS XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

  get markerDragEventJustStopped() {

    return this._markerDragEventJustStopped;
  }

  set markerDragEventJustStopped(value) {

    this._markerDragEventJustStopped = value;
  }

  get visualTrip() {

    return this._visualTrip;
  }

  set visualTrip(trip) {

    this._visualTrip = trip;
  }

  get map() {

    return this._map;
  }

  set map(value) {

    this._map = value;
  }
  
  get clickHandler() {

    return this._clickHandler;
  }

  set clickHandler(handler) {

    this._clickHandler = handler;
  }

  _setListeners() {

    this.map.addListener('click', function(e) {

      e.id = ClickHandler.SINGLE;
      App.mapService.clickHandler.handle(e);
    });
    this.map.addListener('dblclick', function(e) { 

      e.id = ClickHandler.DOUBLE;
      App.mapService.clickHandler.handle(e);
    });

    this.map.addListener('heading_changed', function(e) {

      console.log("heading changed event: " + JSON.stringify(e)); // doesn't seem to work... read up on it
    });

    this.map.addListener('zoom_changed', function(e) {

      App.mapService.clickHandler.isLongPress = false; // 'this' doesn't work here because of lost context in html (I guess)
    });

    this.map.addListener('dragstart', function() {

      App.mapService.clickHandler.isLongPress = false;
    });

    this.map.addListener('drag', function() {

      App.mapService.clickHandler.isLongPress = false;
    });

    this.map.addListener('dragend', function() {

      App.mapService.clickHandler.isLongPress = false;
    });
    
    // DOM events seem to be the only option for listening for 'long press' type of events.
    // these fire on *every* click though, which makes things messy to say the least
    App.google.maps.event.addDomListener(this.mapHolderDiv, 'touchstart', function(e) {

      e.id = ClickHandler.LONG_START;
      App.mapService.clickHandler.handle(e); 
    });

    App.google.maps.event.addDomListener(this.mapHolderDiv, 'touchend', function(e) {
      
      e.id = ClickHandler.LONG_END;
      App.mapService.clickHandler.handle(e);
    });
  } // _setListeners

} // MapService