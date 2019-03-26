/**
 * The heart of the app. The map and the various methods and actions on it.
 * NOTE: the 'this' keyword is causing some major headaches atm; there's no rhyme 
 * or reason as to when it works and when it does not. Fix asap !!
 */

const GoogleMap = {

  MAP_TYPE: {

    NORMAL: 0,
    SATELLITE: 1,
    TERRAIN: 2,
    CYCLING: 3
  },

  _DEFAULT_ZOOM: 8,
  _MIN_ZOOM: 5,

  _ROUTE_COLOR: '#2B7CFF', // darkish blue
  _PLACE_MARKER_URL: 'http://maps.google.com/mapfiles/kml/shapes/placemark_circle_highlight.png',

  _polyLines: [],
  // markers: [],
  _posMarker: null,
  _destMarker: null,
  _bikeLayer: null,
  _bikeLayerOn: false,

  // ui refs
  _menu: null,
  _menuButtonTextHolderDiv: null,
  _cyclingLayerToggleButton: null,
  _speedInput: null,

  _map: null,

  _firstMenuOpen: true,

  init: function () {

    // this.reCenter.bind(this); // useless for some reason -.-

    const mapOptions = {

      center: GeoLoc.currentPos,
      zoom: this._DEFAULT_ZOOM, 
      minZoom: this._MIN_ZOOM, 
      fullscreenControl: false,
      gestureHandling: 'greedy',
      mapTypeControl: false,
      // mapTypeControlOptions: { style: google.maps.MapTypeControlStyle.DROPDOWN_MENU },
      rotateControl: false,
      scaleControl: false,
      tilt: 0,
      disableDoubleClickZoom: true // it needs to be disabled because doubletap is used to clear the map
    }; // mapOptions

    this._map = new App.google.maps.Map(document.getElementById('map'), mapOptions);

    this._map.addListener('click', function(e) {
      e.id = ClickHandler.SINGLE;
      ClickHandler.handle(e);
    });
    this._map.addListener('dblclick', function(e) { 
      e.id = ClickHandler.DOUBLE;
      ClickHandler.handle(e);
    });
  }, // init

  // must be called after UI.init in app.js, to prevent dependency issues
  setUIrefs: function() {

    this._menu = document.getElementById(Menu.DIV_ID);
    this._menuButtonTextHolderDiv = document.getElementById(MenuButton.INNER_DIV_ID); // .childNodes[0].childNodes[0];
    this._cyclingLayerToggleButton = document.getElementById(CyclingLayerToggleButton.BORDER_DIV_ID);
    this._speedInput = document.getElementById(SpeedInput.DIV_ID);
    // this._speedInput = document.getElementById(SpeedInput.DIV_ID);
  },

  reCenter: function (pos) {
    
    this._map.setCenter(pos);
  },

  onMapStyleToggleButtonClick: function (event) {
    
    switch (event.id) {
      case GoogleMap.MAP_TYPE.NORMAL:
        
        GoogleMap._map.setMapTypeId(App.google.maps.MapTypeId.ROADMAP);
        break;
      case GoogleMap.MAP_TYPE.SATELLITE:
        
        GoogleMap._map.setMapTypeId(App.google.maps.MapTypeId.HYBRID);
        break;
      case GoogleMap.MAP_TYPE.TERRAIN:
        
        GoogleMap._map.setMapTypeId(App.google.maps.MapTypeId.TERRAIN);
        break;
      default:

        console.log("something is badly wrong with map style toggle clicks...");
        break;
    } // switch
  }, // onMapStyleToggleButtonClick

  onLocButtonClick: () => {

    GoogleMap.reCenter(GeoLoc.currentPos);
    // this.reCenter(GeoLoc.currentPos);
  },

  // toggles the right-hand corner menu
  onMenuButtonClick: function() {

    GoogleMap._toggleMenuVisibility();
  },

  // TODO: clean up this mess asap...
  _toggleMenuVisibility: function() {

    //console.log("called toggle visib!");
    
    // GoogleMap._menu.style.top = '15%'; // needs to be set here to work; there's some weird issue with auto-derived styles

    const visib = GoogleMap._menu.style.visibility;
    // console.log("visibility: " + visib);
    
    // bandaid to prevent an issue with the menu displaying incorrectly. fix ASAP!
    if (this._firstMenuOpen) {

      this._firstMenuOpen = false;
      // console.log("trying to show menu!");
      GoogleMap._menu.style.visibility = 'visible';
      this._menu.style.display = 'flex';
      GoogleMap._menuButtonTextHolderDiv.textContent = MenuButton.openSymbol;

    } else if (visib === 'visible' || visib === null || visib === undefined || visib === "") {

      // console.log("trying to hide menu!");
      GoogleMap._menu.style.visibility = 'hidden';
      GoogleMap._menuButtonTextHolderDiv.textContent = MenuButton.closedSymbol;
    } else {
      // console.log("trying to show menu!");
      GoogleMap._menu.style.visibility = 'visible';
      GoogleMap._menuButtonTextHolderDiv.textContent = MenuButton.openSymbol;
    }
  }, // _toggleMenuVisibility

  onCyclingLayerToggleButtonClick: function() {

    GoogleMap._toggleBikeLayer();
  },

  onSpeedInputValueChange: function(event) {

    const value = event.target.value;

    if (value > Distance.MAX_SPEED) {

      this._speedInput.value = Distance.MAX_SPEED;
    } else if (value < 0) {

      this._speedInput.value = 0;
    }

    Distance.currentSpeed = this._speedInput.value;
  }, // onSpeedInputValueChange

  onWalkingCyclingToggleButtonClick: function(event) {

    // TODO: use the selected travel mode in route fetching
    if (event.target.value === WalkingCyclingToggleButton.CYCLING_ID) {

      console.log("selected: " + event.target.value);
    } else {

      console.log("selected: " + event.target.value);
    }
  }, // onWalkingCyclingToggleButtonClick

  _toggleBikeLayer: function () {

    if (this._bikeLayerOn) {

      this._cyclingLayerToggleButton.style.backgroundColor = CyclingLayerToggleButton.BG_COLOR_OFF;
      this._cyclingLayerToggleButton.style.border = CyclingLayerToggleButton.BORDER_OFF;
      this._bikeLayer.setMap(null);
      this._bikeLayerOn = false;
    } else {

      if (this._bikeLayer === null) {

        this._bikeLayer = new App.google.maps.BicyclingLayer();
      }
      this._cyclingLayerToggleButton.style.backgroundColor = CyclingLayerToggleButton.BG_COLOR_ON;
      this._cyclingLayerToggleButton.style.border = CyclingLayerToggleButton.BORDER_ON;
      this._bikeLayer.setMap(this._map);
      this._bikeLayerOn = true;
    }
  }, // toggleBikeLayer

  updateDestMarker: function (position) {

    if (this._destMarker !== null) {
      
      this._destMarker.setPosition(position);
    } else {
    
      this._destMarker = new App.google.maps.Marker({ position: position, map: this._map, draggable: true, crossOnDrag: false });
      this._destMarker.addListener('dragend', GoogleMap.onMarkerDragEnd);
      this._destMarker.addListener('click', GoogleMap.onMarkerTap);
    }
    // this.markers.push(marker); // the array is unnecessary i guess... keeping it for now
  }, // updateDestMarker

  updatePosMarker: function () {
    
    if (this._posMarker !== null) {

      this._posMarker.setPosition(GeoLoc.currentPos);
    } else {
      
      this._posMarker = new App.google.maps.Marker({ position: GeoLoc.currentPos, map: this._map, draggable: false, icon: GoogleMap._PLACE_MARKER_URL });
    }
  }, // updatePosMarker

  onMarkerDragEnd: function(event) {
    
    // console.log("called onMarkerDragEnd");

    GoogleMap.clear();
    Route.to(event);
  },

  onMarkerTap: function (event) {
    
    console.log("tap event: " + JSON.stringify(event));
    // TODO: open an info window with place info. where to get it though? 
    // the event object doesn't contain it...
  },

  clear: function() {

    if (this._destMarker === null) return; // this should always work, but i'm a bit wary about it still...
    
    App.google.maps.event.clearInstanceListeners(this._destMarker);
    this._destMarker.setMap(null);
    this._destMarker = null;

    this._polyLines.forEach(line => { 
      line.setMap(null);
    });
    this._polyLines.length = 0;
  }, // clear

  // should be somewhere else, perhaps
  decodePolyPoints: function(encodedPoints) {

    // console.log("decoded stuffs: " + app.google.maps.geometry.encoding.decodePath(encodedPoints));
    return App.google.maps.geometry.encoding.decodePath(encodedPoints);
  },

  drawPolyLine: function(points) {

    // should never happen, but just in case
    if (this._map === null) return;

    const line = new App.google.maps.Polyline({
      path: points,
      strokeColor: GoogleMap._ROUTE_COLOR,
      strokeOpacity: 1.0,
      strokeWeight: 4,
      zIndex: 5,
      map: this._map
    });

    this._polyLines.push(line);
  }, // drawPolyLine

  // called from ui.js to add the map ui controls
  addUIControl: function(position, control) {

    GoogleMap._map.controls[position].push(control);
  }

}; // GoogleMap