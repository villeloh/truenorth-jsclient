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

  _mapHolderDiv: null,

  // needed in order not to fire a superfluous route fetch on long press
  markerDragEventJustStopped: false,

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

    this._mapHolderDiv = document.getElementById('map');

    this._map = new App.google.maps.Map(this._mapHolderDiv, mapOptions);

    this._bikeLayer = new App.google.maps.BicyclingLayer();

    GoogleMap.setListeners();
  }, // init

  reCenter: function (pos) {
    
    this._map.setCenter(pos);
  },

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

  onCyclingLayerToggleButtonClick: function(event) {

    GoogleMap._toggleBikeLayer(event);
  },

  onWalkingCyclingToggleButtonClick: function(event) {

    // TODO: use the selected travel mode in route fetching
    if (event.target.value === WalkingCyclingToggleButton.CYCLING_ID) {

      console.log("selected: " + event.target.value);
    } else {

      console.log("selected: " + event.target.value);
    }
  }, // onWalkingCyclingToggleButtonClick

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

  updateDestMarker: function (position) {

    if (this._destMarker !== null) {
      
      this._destMarker.setPosition(position);
    } else {
    
      this._destMarker = new App.google.maps.Marker({ position: position, map: this._map, draggable: true, crossOnDrag: false });
      // this._destMarker.addListener('dragstart', GoogleMap.onMarkerDragStart);
      // this._destMarker.addListener('dragmove', GoogleMap.onMarkerDragMove);
      this._destMarker.addListener('dragend', GoogleMap._onMarkerDragEnd);
      this._destMarker.addListener('click', GoogleMap._onMarkerTap);
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

  _onMarkerDragStart: function(event) {

  },

  _onMarkerDragMove: function(event) {

  },

  _onMarkerDragEnd: function(event) {
    
    // console.log("called _onMarkerDragEnd");

    GoogleMap.clear();

    const toLat = event.latLng.lat();
    const toLng = event.latLng.lng();
    const destination = { lat: toLat, lng: toLng };
    Route.fetch(destination);

    // Route.to(event);
    GoogleMap.markerDragEventJustStopped = true; // needed in order not to tangle the logic with that of a long press
    setTimeout(() => {
      GoogleMap.markerDragEventJustStopped = false;
    }, 100);
  }, // _onMarkerDragEnd

  _onMarkerTap: function (event) {
    
    console.log("tap event: " + JSON.stringify(event));
    // TODO: open an info window with place info. where to get it though? 
    // the event object doesn't contain it...
  },

  clear: function() {

    if (this._destMarker === null) return; // this should always work, but i'm a bit wary about it still...

    Route.getRenderer().setDirections(null);
    Route.getRenderer().setMap(null); // clear the old route
    
    App.google.maps.event.clearInstanceListeners(this._destMarker);
    this._destMarker.setMap(null);
    this._destMarker = null;

    /*
    this._polyLines.forEach(line => { 
      line.setMap(null);
    });
    this._polyLines.length = 0; */
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
      map: this._map,
      // editable: true,
      geodesic: true    
    });

    this._polyLines.push(line);
  }, // drawPolyLine

  // called from ui.js to add the map ui controls
  addUIControl: function(position, control) {

    GoogleMap._map.controls[position].push(control);
  },

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
    
    // DOM events seem to be the only option for listening to 'long press' type of events.
    // these fire on *every* click though, which makes things messy to say the least
    App.google.maps.event.addDomListener(GoogleMap._mapHolderDiv, 'touchstart', function(e) {

      e.id = ClickHandler.LONG_START;
      ClickHandler.handle(e);
    });

    App.google.maps.event.addDomListener(GoogleMap._mapHolderDiv, 'touchend', function(e) {
      
      e.id = ClickHandler.LONG_END;
      ClickHandler.handle(e);
    });
  }, // setListeners

  // called in Route.js to get a reference to the map
  getMap: function() {

    return GoogleMap._map;
  }

}; // GoogleMap