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
    }); // TODO: fix single click firing at the same time (if possible...)
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
      case GoogleMap.MAP_TYPE.CYCLING:
        
        GoogleMap._toggleBikeLayer();
        break;
      default:
        break;
    }
  }, // onMapStyleToggleButtonClick

  onLocButtonClick: () => {

    GoogleMap.reCenter(GeoLoc.currentPos);
    // this.reCenter(GeoLoc.currentPos);
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

  _toggleBikeLayer: function () {

    if (this._bikeLayerOn) {

      this._bikeLayer.setMap(null);
      this._bikeLayerOn = false;
    } else {

      if (this._bikeLayer === null) {

        this._bikeLayer = new App.google.maps.BicyclingLayer();
      }
      this._bikeLayer.setMap(this._map);
      this._bikeLayerOn = true;
    }
  }, // toggleBikeLayer

  updateDestMarker: function (position) {

    if (this._destMarker !== null) {
      
      this._destMarker.setPosition(position);
    } else {
    
      this._destMarker = new App.google.maps.Marker({ position: position, map: this._map, draggable: true, crossOnDrag: false });
      this._destMarker.addListener('dragend', GoogleMap.onMarkerDragEnd); // should these listeners be deleted explicitly when clearing the marker?
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