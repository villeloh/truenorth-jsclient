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

  _wayPointmarkers: [],
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

  onWalkingCyclingToggleButtonClick: function(event) {

    // the values are the ones defined in Route.
    // the logic is still in flux, but I feel this 'detour' through GoogleMap
    // is justifiable due to handling a click event on the map.
    Route.setTravelMode(event.target.value); 
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

  updateDestMarker: function (position) {

    // for some reason, after adding the waypoint logic, the destination
    // marker disappears if it's not recreated with each drag/long press event.
    /*
    if (this._destMarker !== null) {
      
      console.log("moving dest marker");
      this._destMarker.setPosition(position);
    } else { */
    
    // console.log("dest marker coords: " + position.lat + ", " + position.lng);

    GoogleMap._clearDestMarker();
    
    GoogleMap._destMarker = new App.google.maps.Marker({ position: position, map: this._map, draggable: true, crossOnDrag: false });
    // this._destMarker.addListener('dragstart', GoogleMap.onMarkerDragStart);
    // this._destMarker.addListener('dragmove', GoogleMap.onMarkerDragMove);
    GoogleMap._destMarker.addListener('dragend', GoogleMap._onDestMarkerDragEnd);
    GoogleMap._destMarker.addListener('click', GoogleMap._onDestMarkerTap);
    // }
  }, // updateDestMarker

  updatePosMarker: function () {
    
    if (this._posMarker !== null) {

      this._posMarker.setPosition(GeoLoc.currentPos);
    } else {
      
      this._posMarker = new App.google.maps.Marker({ position: GeoLoc.currentPos, map: this._map, draggable: false, icon: GoogleMap._PLACE_MARKER_URL });
    }
  }, // updatePosMarker

  // takes a LatLng
  addWayPoint: function(position) {

    if (this._destMarker === null) return;
    
    const wayPoint = WayPoint(position);
    Route.addWayPointObject(wayPoint);

    const wayPointMarker = new App.google.maps.Marker({ 
      position: position, 
      map: this._map, 
      draggable: true, 
      label: ""+Route.getWayPointArrayLength(), 
      crossOnDrag: false 
    });

    GoogleMap._wayPointmarkers.push(wayPointMarker);

    wayPointMarker.addListener('dblclick', function(event) {

      event.markerIndex = GoogleMap._wayPointmarkers.indexOf(wayPointMarker);
      // console.log("the added markerIndex: " + event.markerIndex);
      GoogleMap.onWayPointMarkerDblClick(event);
    });
    wayPointMarker.addListener('dragend', function(event) {

      event.markerIndex = GoogleMap._wayPointmarkers.indexOf(wayPointMarker);
      // console.log("the added markerIndex: " + event.markerIndex);
      GoogleMap.onWayPointMarkerDragEnd(event);
    });

    // console.log("added waypoint; fetching route");
    Route.fetch(Route.currentDest);
  }, // addWayPoint

  onWayPointMarkerDragStart: function(event) {

    // console.log("dest in dragstart: " + Route.currentDest.lat + ", " + Route.currentDest.lng);
  },

  onWayPointMarkerDragEnd: function(event) {

    // console.log("dest when starting dragend: " + Route.currentDest.lat + ", " + Route.currentDest.lng);

    // console.log("waypoint drag event id: " + event.markerIndex);

    const index = event.markerIndex;
    // console.log("index in dragend: " + index);
    
    const toLat = event.latLng.lat();
    const toLng = event.latLng.lng();
    const newWayPoint = WayPoint(LatLng(toLat, toLng));
   /* console.log("dragged to: " + toLat + ", " + toLng);

    console.log('route.waypoints before altering:');

    Route.wayPoints.forEach(wp => {

      console.log(wp.location.lat + ", " + wp.location.lng);
    }); */

    Route.updateWayPoint(index, newWayPoint);

    /*console.log('route.waypoints after altering:');

    Route.wayPoints.forEach(wp => {

      console.log(wp.location.lat + ", " + wp.location.lng);
    }); */

    // console.log("dest before fetch in dragend: " + Route.currentDest.lat + ", " + Route.currentDest.lng);

    // console.log("dragged wp; fetching route");
    Route.fetch(Route.currentDest);

    GoogleMap.markerDragEventJustStopped = true; // needed in order not to tangle the logic with that of a long press
    setTimeout(() => {
      GoogleMap.markerDragEventJustStopped = false;
    }, 100);
  }, // onWayPointMarkerDragEnd

  onWayPointMarkerDblClick: function(event) {

    // console.log("waypoint marker dblclick event id: " + event.markerIndex);
    GoogleMap._deleteWayPoint(event);
  },

  _deleteWayPoint: function(event) {

    /*
    console.log("before deletion: ");
    Route.wayPoints.forEach(wp => {

      console.log(wp.location.lat + ", " + wp.location.lng);
    }); */

    const index = event.markerIndex;

   // console.log("index in deleteWp: " + index);

    Route.deleteWayPointObject(index);
    GoogleMap._clearWayPointMarker(GoogleMap._wayPointmarkers[index]);
/* 
    console.log("after deletion: ");
    Route.wayPoints.forEach(wp => {

      console.log(wp.location.lat + ", " + wp.location.lng);
    }); */

    GoogleMap._updateWayPointLabels(index+1); // the marker index is zero-based, while the marker labels start from 1

    console.log("deleted wp; fetching route");
    Route.fetch(Route.currentDest);
  }, // _deleteWayPoint

  // when a waypoint other than the last one is removed, 
  // the labels of all the waypoints that come
  // after it will need to be bumped down by 1
  _updateWayPointLabels(aboveLabelNum) {

    GoogleMap._wayPointmarkers.forEach(marker => {

      const labelAsNum = parseInt(marker.label);
      if (labelAsNum > aboveLabelNum) {

        marker.setLabel((labelAsNum-1)+"");
      }
    });
  }, // _updateWayPointLabels

  _onDestMarkerDragEnd: function(event) {
    
    // console.log("called _onDestMarkerDragEnd");

    GoogleMap.clearRoute();

    const toLat = event.latLng.lat();
    const toLng = event.latLng.lng();
    const destination = LatLng(toLat, toLng);

    console.log("dragged dest marker; fetching route");
    Route.fetch(destination);

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

    GoogleMap.fullClear();
    Route.currentDist = Route.DEFAULT_DIST;
    Route.currentDura = Route.DEFAULT_DURA;

    // reset the distance & duration in the upper screen display
    InfoHeader.updateDistance();
    InfoHeader.updateDuration();
  }, // onClearButtonClick

  fullClear: function() {

    if (this._destMarker === null) return; // this should always work, but i'm a bit wary about it still...

    GoogleMap.clearRoute();
    GoogleMap.clearWayPoints();
  }, // fullClear

  clearRoute: function() {

    if (this._destMarker === null) return;

    // it produces an error to call this with null. it seems it's not needed to clear the map, but i'm
    // leaving it for now in case it's needed later.
    // Route.getRenderer().setDirections(null);

    Route.getRenderer().setMap(null); // clear the old route
    
    GoogleMap._clearDestMarker();
  }, // clearRoute

  clearWayPoints: function() {
    
    Route.clearWayPointObjects();

    this._wayPointmarkers.forEach(marker => { 

      App.google.maps.event.clearInstanceListeners(marker);
      marker.setMap(null);
      marker = null;
    });
    this._wayPointmarkers.length = 0;
  }, // clearWayPoints

  _clearWayPointMarker: function(marker) {

    const index = GoogleMap._wayPointmarkers.indexOf(marker);

    GoogleMap._wayPointmarkers.splice(index, 1);
    
    App.google.maps.event.clearInstanceListeners(marker);
    marker.setMap(null);
    marker = null;
  }, // _clearWayPointMarker

  _clearDestMarker: function() {

    if (GoogleMap._destMarker === null) return;
    console.log("clearing dest marker...");

    App.google.maps.event.clearInstanceListeners(GoogleMap._destMarker);
    GoogleMap._destMarker.setMap(null);
    GoogleMap._destMarker = null;
  },

  // called from ui.js to add the map ui controls
  addUIControl: function(position, control) {

    GoogleMap._map.controls[position].push(control);
  },

  // called in Route.js to get a reference to the map
  getMap: function() {

    return GoogleMap._map;
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