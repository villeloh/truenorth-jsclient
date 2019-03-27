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

  _map: null,

  _menuIsVisible: false,

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
  onMenuButtonClick: function(event) {

    GoogleMap._toggleMenuVisibility(event);
  },

  // technically, it removes / recreates the menu with each click.
  // this is needed because zoom events 'reset' the map, which makes 
  // the menu become visible with each zoom if it's present in the DOM.
  _toggleMenuVisibility: function(event) {

    const menuBtnTextHolderDiv = event.target.childNodes[0];

    if (this._menuIsVisible) {

      this._menuIsVisible = false;
      UI.removeElement(Menu.DIV_ID);
      menuBtnTextHolderDiv.textContent = MenuButton.closedSymbol;
    } else {

      this._menuIsVisible = true;
      UI.addMenu();
      menuBtnTextHolderDiv.textContent = MenuButton.openSymbol;
    }
  }, // _toggleMenuVisibility

  onCyclingLayerToggleButtonClick: function(event) {

    GoogleMap._toggleBikeLayer(event);
  },

  onSpeedInputValueChange: function(event) {

    const value = event.target.value;

    if (value > Distance.MAX_SPEED) {

      event.target.value = Distance.MAX_SPEED;
    } else if (value < 0) {

      event.target.value = 0;
    }

    if (Utils.isValidSpeed(event.target.value)) {

      Distance.currentSpeed = event.target.value;
    } else {
      Distance.currentSpeed = 0;
    }
    console.log("distance.currentSpeed: " + Distance.currentSpeed);
    console.log("distance.currentDist: " + Distance.currentDist);

    const formattedDuraText = Duration.calc(Distance.currentDist, Distance.currentSpeed);
    const text = InfoHeader.formattedText(Distance.currentDist, formattedDuraText);
    InfoHeader.update(text);
  }, // onSpeedInputValueChange

  onWalkingCyclingToggleButtonClick: function(event) {

    // TODO: use the selected travel mode in route fetching
    if (event.target.value === WalkingCyclingToggleButton.CYCLING_ID) {

      console.log("selected: " + event.target.value);
    } else {

      console.log("selected: " + event.target.value);
    }
  }, // onWalkingCyclingToggleButtonClick

  _toggleBikeLayer: function (event) {

    const toggleBtn = event.target.parentNode; // the target is the inner text div for some reason

    if (this._bikeLayerOn) {

      toggleBtn.style.backgroundColor = CyclingLayerToggleButton.BG_COLOR_OFF;
      toggleBtn.style.border = CyclingLayerToggleButton.BORDER_OFF;
      this._bikeLayer.setMap(null);
      this._bikeLayerOn = false;
    } else {

      if (this._bikeLayer === null) {

        this._bikeLayer = new App.google.maps.BicyclingLayer();
      }
      toggleBtn.style.backgroundColor = CyclingLayerToggleButton.BG_COLOR_ON;
      toggleBtn.style.border = CyclingLayerToggleButton.BORDER_ON;
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

    GoogleMap.clear(false);
    Route.to(event);
  },

  onMarkerTap: function (event) {
    
    console.log("tap event: " + JSON.stringify(event));
    // TODO: open an info window with place info. where to get it though? 
    // the event object doesn't contain it...
  },

  clear: function(fullClear) {

    if (this._destMarker === null) return; // this should always work, but i'm a bit wary about it still...
    
    App.google.maps.event.clearInstanceListeners(this._destMarker);
    this._destMarker.setMap(null);
    this._destMarker = null;

    this._polyLines.forEach(line => { 
      line.setMap(null);
    });
    this._polyLines.length = 0;

    // the header should only be reset on clearing all routes -- not when
    // clearing an old route and recalculating a new one
    if (fullClear) {

      // reset the distance & duration in the upper screen display
      InfoHeader.update(InfoHeader.DEFAULT_TEXT);
    }
  }, // clear

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