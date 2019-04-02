/**
 * The heart of the app. The map and the various methods and actions on it.
 * NOTE: the 'this' keyword is causing some major headaches atm; there's no rhyme 
 * or reason as to when it works and when it does not. Fix asap !!
 */

const GoogleMap = {

  // needed in ClickHandler in order not to fire a superfluous route fetch on long press
  markerDragEventJustStopped: false,

  constants: {

    _DEFAULT_ZOOM: 8,
    _MIN_ZOOM: 5,
    _PLACE_MARKER_URL: 'http://maps.google.com/mapfiles/kml/shapes/placemark_circle_highlight.png',
  }, // constants

  _cyclist: null, // the cyclist object contains a *planned* speed, destination, etc.
  _displayedTrip: null, // one for which the route request was successful

  _bikeLayer: null,
  _bikeLayerOn: false,

  _mapHolderDiv: null,
  _map: null,

  _menuIsVisible: false,

  _routeRenderer: null,

  init: function () {

    const initialPosCoords = new LatLng(0,0);

    const mapOptions = {

      center: initialPosCoords,
      zoom: this.constants._DEFAULT_ZOOM, 
      minZoom: this.constants._MIN_ZOOM, 
      fullscreenControl: false,
      gestureHandling: 'greedy',
      mapTypeControl: false,
      // mapTypeControlOptions: { style: google.maps.MapTypeControlStyle.DROPDOWN_MENU },
      rotateControl: false,
      scaleControl: false,
      tilt: 0,
      disableDoubleClickZoom: true // it needs to be disabled because doubletap is used to clear the map
    }; // mapOptions

    this._mapHolderDiv = document.getElementById('map');

    this._map = new App.google.maps.Map(this._mapHolderDiv, mapOptions);

    this._bikeLayer = new App.google.maps.BicyclingLayer();
    
    this._cyclist = new Cyclist(Route.constants.CYCLE_MODE); // ideally, take it from localStorage

    this._cyclist.position = new Position(initialPosCoords); // GeoLoc.js periodically updates this

    this._routeRenderer = new RouteRenderer(this._map); // for showing fetched routes on the map

    GoogleMap.setListeners();
  }, // init

  // takes a LatLng
  addWayPoint: function(position) {

    if (this.noDisplayedTrip()) return;
    
    GoogleMap._cyclist.addWayPointObject(position);

    Route.fetch(GoogleMap._cyclist);
  }, // addWayPoint


  getCyclist: function() {

    return GoogleMap._cyclist;
  },

  onRouteFetchSuccess: function(fetchResult, cyclist) {

    GoogleMap.deleteDisplayedTrip();

    GoogleMap._routeRenderer.renderOnMap(fetchResult);
    
    const route = fetchResult.routes[0];

    const dist = Utils.distanceInKm(route);
    const dura = Utils.calcDuration(dist, cyclist.getSpeed());

    const destCoords = cyclist.getDestCoords();
    const wayPointCoords = cyclist.getAllWayPointCoords();

    const tripToDisplay = new Trip(destCoords, wayPointCoords, dist, dura);

    GoogleMap.setDisplayedTrip(tripToDisplay);
    GoogleMap.getDisplayedTrip().displayOnMap();

    InfoHeader.updateDistance(dist);
    InfoHeader.updateDuration(dura);
  }, // onRouteFetchSuccess

  onMapStyleToggleButtonClick: function (event) {
    
    const textHolderDiv = event.target;
    const value = textHolderDiv.innerText; // supposedly expensive... but .textContent refuses to work with the switch, even though the type is string!
 
    switch (value) {
      case MapStyleToggleButton.NORMAL_TXT:
        
        GoogleMap._map.setMapTypeId(App.google.maps.MapTypeId.ROADMAP);
        break;
      case MapStyleToggleButton.SAT_TXT:
        
        GoogleMap._map.setMapTypeId(App.google.maps.MapTypeId.HYBRID);
        break;
      case MapStyleToggleButton.TERRAIN_TXT:
        
        GoogleMap._map.setMapTypeId(App.google.maps.MapTypeId.TERRAIN);
        break;
      default:

        console.log("something is badly wrong with map style toggle clicks...");
        console.log("text value in default statement: " + value);
        break;
    } // switch
  }, // onMapStyleToggleButtonClick

  onLocButtonClick: () => {

    GoogleMap.reCenter(GoogleMap._cyclist.getPosCoords());
  },

  // toggles the right-hand corner menu
  onMenuButtonClick: function(event) {

    GoogleMap._toggleMenuVisibility(event);
  },

  // technically, it removes / recreates the menu with each click.
  // this is needed because zoom events 'reset' the map, which makes 
  // the menu become visible with each zoom if it's present in the DOM.
  _toggleMenuVisibility: function(event) {

    const menuBtnTextHolderDiv = event.target;

    if (this._menuIsVisible) {

      this._menuIsVisible = false;
      UI.removeElement(Menu.DIV_ID);
      menuBtnTextHolderDiv.textContent = MenuButton.CLOSED_SYMBOL;
      menuBtnTextHolderDiv.style.fontSize = '26px';
    } else {

      this._menuIsVisible = true;
      UI.addMenu();
      menuBtnTextHolderDiv.textContent = MenuButton.OPEN_SYMBOL;
      menuBtnTextHolderDiv.style.fontSize = '20px';
    }
  }, // _toggleMenuVisibility

  onWalkingCyclingToggleButtonClick: function(event) {

    // the values come from Route.js (via the toggle button)
    GoogleMap._cyclist.travelMode = event.target.value; 
  },

  onCyclingLayerToggleButtonClick: function(event) {

    GoogleMap._toggleBikeLayer(event);
  },

  _toggleBikeLayer: function (event) {

    const toggleBtn = event.target.parentElement;

    if (this._bikeLayerOn) {

      toggleBtn.style.backgroundColor = CyclingLayerToggleButton.BG_COLOR_OFF;
      toggleBtn.style.border = CyclingLayerToggleButton.BORDER_OFF;
      this._bikeLayer.setMap(null);
      this._bikeLayerOn = false;
    } else {

      toggleBtn.style.backgroundColor = CyclingLayerToggleButton.BG_COLOR_ON;
      toggleBtn.style.border = CyclingLayerToggleButton.BORDER_ON;
      this._bikeLayer.setMap(this._map);
      this._bikeLayerOn = true;
    }
  }, // _toggleBikeLayer

  onWayPointDblClick: function(event) {

    GoogleMap._deleteWayPoint(event);
  },

  _deleteWayPoint: function(event) {

    const index = event.wpIndex;
    GoogleMap._cyclist.removeWayPointObject(index);

    Route.fetch(GoogleMap._cyclist);
  }, // _deleteWayPoint

  _onDestMarkerDragEnd: function(event) {

    // this bit of code id duplicated in a lot of place; but
    // i feel it'd make things too nebulous to move it to its own method
    const toLat = event.latLng.lat();
    const toLng = event.latLng.lng();
    const destCoords = new LatLng(toLat, toLng);
    GoogleMap._cyclist.setDestCoords(destCoords);

    Route.fetch(GoogleMap._cyclist);

    GoogleMap.markerDragEventJustStopped = true; // needed in order not to tangle the logic with that of a long press
    setTimeout(() => {
      GoogleMap.markerDragEventJustStopped = false;
    }, 100);
  }, // _onDestMarkerDragEnd

  _onDestMarkerTap: function (event) {
    
    console.log("tap event: " + JSON.stringify(event));
    // TODO: open an info window with place info. where to get it though? 
    // the event object doesn't contain it...
  },

  onClearButtonClick: function() {

    if (this.noDisplayedTrip()) return;

    GoogleMap._fullClear();
  }, // onClearButtonClick

  _fullClear: function() {

    GoogleMap._deletePlannedTrip();
    GoogleMap.deleteDisplayedTrip();

    InfoHeader.reset();
  }, // fullClear

  // called from Route.js on every route fetch
  deleteDisplayedTrip: function() {

    if (this.noDisplayedTrip()) return;

    GoogleMap._routeRenderer.clearPolyLine();
    
    GoogleMap._displayedTrip.clear();
    GoogleMap._displayedTrip = null;
  }, // deleteDisplayedTrip

  // clears the stored waypoints and the destination coordinate from the cyclist object
  _deletePlannedTrip: function() {

    this._cyclist.clearPlannedTrip();
  },

  onGoogleMapLongPress: function(event) {

    const toLat = event.latLng.lat();
    const toLng = event.latLng.lng();
    const destCoords = new LatLng(toLat, toLng);

    GoogleMap._cyclist.setDestCoords(destCoords);

    Route.fetch(GoogleMap._cyclist);
  },

  onGoogleMapDoubleClick: function(event) {

    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    const clickedPos = new LatLng(lat, lng);
    GoogleMap._cyclist.addWayPointObject(clickedPos);

    Route.fetch(GoogleMap._cyclist);
  },

  onWayPointDragEnd: function(event) {

    const index = event.wpIndex;
    
    const toLat = event.latLng.lat();
    const toLng = event.latLng.lng();
    const latLng = new LatLng(toLat, toLng);

    GoogleMap._cyclist.updateWayPointObject(index, latLng);
    
    Route.fetch(GoogleMap._cyclist);

    GoogleMap.markerDragEventJustStopped = true; // needed in order not to tangle the logic with that of a long press
    setTimeout(() => {
      GoogleMap.markerDragEventJustStopped = false;
    }, 100);
  }, // onWayPointDragEnd

  getMap: function() {

    return GoogleMap._map;
  },

  getDisplayedTrip: function() {

    return GoogleMap._displayedTrip;
  },

  // NOTE: before calling this, the existing trip's 
  // clear method should be called (to get rid of all the objects within it for sure)
  setDisplayedTrip: function(trip) {

    GoogleMap._displayedTrip = trip;
  },

  noDisplayedTrip: function () {
    
    return this._displayedTrip === null;
  },

  reCenter: function (newCoords) {
    
    this._map.setCenter(newCoords);
  },

  // called from ui.js to add the map ui controls
  addUIControl: function(position, control) {

    GoogleMap._map.controls[position].push(control);
  },

  // does what it says... called when recreating the menu
  // (as it's not a click event, it needs its own method)
  setInitialCyclingLayerToggleButtonStyles: function() {

    const toggleBtn = document.getElementById('cyc-layer-btn-outer');

    if (this._bikeLayerOn) { 

      toggleBtn.style.backgroundColor = CyclingLayerToggleButton.BG_COLOR_ON;
      toggleBtn.style.border = CyclingLayerToggleButton.BORDER_ON;
      // this._bikeLayer.setMap(this._map); // should not be needed
    } else {

      toggleBtn.style.backgroundColor = CyclingLayerToggleButton.BG_COLOR_OFF;
      toggleBtn.style.border = CyclingLayerToggleButton.BORDER_OFF;
      // this._bikeLayer.setMap(null);
    } // if-else
  }, // setInitialCyclingLayerToggleButtonStyles

  // tucking this mess away at the bottom
  setListeners: function() {

    this._map.addListener('click', function(e) {
      e.id = ClickHandler.SINGLE;
      ClickHandler.handle(e);
    });
    this._map.addListener('dblclick', function(e) { 
      e.id = ClickHandler.DOUBLE;
      ClickHandler.handle(e);
    });

    this._map.addListener('heading_changed', function(e) {

      console.log("heading changed event: " + JSON.stringify(e)); // doesn't seem to work... read up on it
    });

    this._map.addListener('zoom_changed', function(e) {

      ClickHandler.isLongPress = false;
    });

    this._map.addListener('dragstart', function() {

      ClickHandler.isLongPress = false;
    });

    this._map.addListener('drag', function() {

      ClickHandler.isLongPress = false;
    });

    this._map.addListener('dragend', function() {

      ClickHandler.isLongPress = false;
    });
    
    // DOM events seem to be the only option for listening for 'long press' type of events.
    // these fire on *every* click though, which makes things messy to say the least
    App.google.maps.event.addDomListener(GoogleMap._mapHolderDiv, 'touchstart', function(e) {

      e.id = ClickHandler.LONG_START;
      ClickHandler.handle(e);
    });

    App.google.maps.event.addDomListener(GoogleMap._mapHolderDiv, 'touchend', function(e) {
      
      e.id = ClickHandler.LONG_END;
      ClickHandler.handle(e);
    });
  } // setListeners

}; // GoogleMap