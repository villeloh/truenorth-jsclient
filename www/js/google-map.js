/**
 * The heart of the app. The map and the various methods and actions on it.
 * NOTE: the 'this' keyword is causing some major headaches atm; there's no rhyme 
 * or reason as to when it works and when it does not. Fix asap !!
 */

const GoogleMap = {

  // needed in order not to fire a superfluous route fetch on long press
  markerDragEventJustStopped: false,

  constants: {

    _DEFAULT_ZOOM: 8,
    _MIN_ZOOM: 5,
    _PLACE_MARKER_URL: 'http://maps.google.com/mapfiles/kml/shapes/placemark_circle_highlight.png',

    /* MAP_TYPE: {

      NORMAL: 0,
      SATELLITE: 1,
      TERRAIN: 2,
      CYCLING: 3
    } */
  }, // constants

  _currentPos: null,

  _cyclist: null, // the cyclist object contains a *planned* speed, destination, etc.
  _displayedTrip: null, // one for which the route request was successful

  _bikeLayer: null,
  _bikeLayerOn: false,

  _mapHolderDiv: null,
  _map: null,

  _menuIsVisible: false,

  init: function () {

    const mapOptions = {

      center: this._currentPos,
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

    this._currentPos = new Position(new LatLng(0,0));

    this._cyclist = new Cyclist(Route.constants.CYCLE_MODE); // ideally, take it from localStorage

    GoogleMap.setListeners();
  }, // init

  // takes a LatLng
  addWayPoint: function(position) {

    if (this.noTrip()) return;

    const label = GoogleMap.getTrip().getWayPointArrayLength() + 1;
    
    const wayPoint = new WayPoint(position, label);
    GoogleMap.getTrip().addWayPoint(wayPoint);

    Route.fetch(GoogleMap.getTrip());
  }, // addWayPoint


  getCyclist: function() {

    return GoogleMap._cyclist;
  },


  /*
  _clearWayPointMarker: function(marker) {

    const index = GoogleMap._wayPointmarkers.indexOf(marker);

    GoogleMap._wayPointmarkers.splice(index, 1);
    
    App.google.maps.event.clearInstanceListeners(marker);
    marker.setMap(null);
    marker = null;
  }, // _clearWayPointMarker */

  // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX CHECKED XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

  

  /*
  updateDestMarker: function (position) {

    // for some reason, after adding the waypoint logic, the destination
    // marker disappears if it's not recreated with each drag/long press event.
    
    if (this._destMarker !== null) {
      
      console.log("moving dest marker");
      this._destMarker.setPosition(position);
    } else { 
    
    // console.log("dest marker coords: " + position.lat + ", " + position.lng);

    GoogleMap._clearDestMarker();
    
    GoogleMap._destMarker = new App.google.maps.Marker({ position: position, map: this._map, draggable: true, crossOnDrag: false });
    // this._destMarker.addListener('dragstart', GoogleMap.onMarkerDragStart);
    // this._destMarker.addListener('dragmove', GoogleMap.onMarkerDragMove);
    GoogleMap._destMarker.addListener('dragend', GoogleMap._onDestMarkerDragEnd);
    GoogleMap._destMarker.addListener('click', GoogleMap._onDestMarkerTap);
    // }
  }, // updateDestMarker */

  /*
  updatePosMarker: function () {
    
    if (this._posMarker !== null) {

      this._posMarker.setPosition(Route.getCurrentPos());
    } else {
      
      this._posMarker = new App.google.maps.Marker({ position: Route.getCurrentPos(), map: this._map, draggable: false, icon: GoogleMap.constants._PLACE_MARKER_URL });
    }
  }, // updatePosMarker */

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

    GoogleMap.reCenterToCurrentPos();
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
  
  onWayPointMarkerDragStart: function(event) {

    // console.log("dest in dragstart: " + Route.currentDest.lat + ", " + Route.currentDest.lng);
  },

  onWayPointMarkerDblClick: function(event) {

    GoogleMap._deleteWayPoint(event);
  },

  _deleteWayPoint: function(event) {

    const index = event.wpIndex;

    GoogleMap.getTrip().removeWayPoint(index);

    GoogleMap._updateWayPointLabels(index+1); // the marker index is zero-based, while the marker labels start from 1

    Route.fetch(GoogleMap.getTrip());
  }, // _deleteWayPoint

  // when a waypoint other than the last one is removed, 
  // the labels of all the waypoints that come
  // after it will need to be bumped down by 1
  _updateWayPointLabels(aboveLabelNum) {

    GoogleMap.getTrip().wayPoints.forEach(wp => {

      const labelAsNum = parseInt(wp.marker.label);
      if (labelAsNum > aboveLabelNum) {

        wp.marker.setLabel((labelAsNum-1)+"");
      }
    });
  }, // _updateWayPointLabels

  _onDestMarkerDragEnd: function(event) {
    
    // console.log("called _onDestMarkerDragEnd");

    GoogleMap.clearRoute();

    const toLat = event.latLng.lat();
    const toLng = event.latLng.lng();
    const destCoords = new LatLng(toLat, toLng);
    GoogleMap.getTrip().dest = new Destination(destCoords);

    Route.fetch(GoogleMap.getTrip());

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

    if (this.noTrip()) return;

    GoogleMap.fullClear();

    InfoHeader.reset();
  }, // onClearButtonClick

  fullClear: function() {

    if (this.noTrip()) return;

    GoogleMap.clearRoute();
    GoogleMap.clearWayPoints();
  }, // fullClear

  clearDisplayedTrip: function() {

    if (this.noDisplayedTrip()) return;

    // it produces an error to call this with null. it seems it's not needed to clear the map, but i'm
    // leaving it for now in case it's needed later.
    // Route.getRenderer().setDirections(null);

    Route.setRendererMapToNull(); // clear the polyline from the map
    
    GoogleMap.getDisplayedTrip().clear();
  }, // clearRoute

  // clears the stored waypoints and the destination coordinate from the cyclist object
  clearPlannedTrip: function() {

    this._cyclist.clearPlannedTrip();
  },

  clearWayPoints: function() {
    
    GoogleMap.getTrip().wayPoints.map(wp => {

      wp.clear();
      return null;
    });

    GoogleMap.getTrip().wayPoints.length = 0;
  }, // clearWayPoints

  noDisplayedTrip: function () {
    
    return this._displayedTrip === null;
  },

  onWayPointDragEnd: function(event) {

    const index = event.wpIndex;
    
    const toLat = event.latLng.lat();
    const toLng = event.latLng.lng();
    const latLng = new LatLng(toLat, toLng);

    GoogleMap._cyclist.updateWayPoint(index, latLng);
    
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

  setDisplayedTrip: function(trip) {

    GoogleMap._displayedTrip = trip;
  },

  getCurrentPosCoords: function() {

    return GoogleMap._currentPos.coords;
  },

  reCenter: function (newCoords) {
    
    this._map.setCenter(newCoords);
  },

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
  } // setListeners

}; // GoogleMap