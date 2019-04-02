
/**
 * Renders routes on the map.
 */

function RouteRenderer(map) {

  this._ROUTE_COLOR = '#2B7CFF'; // darkish blue
  this._map = map;

  this._renderer = new App.google.maps.DirectionsRenderer({

    draggable: false, // the dragging is way too sensitive to light presses
    suppressMarkers: true, // the default markers only get in the way
    suppressBicyclingLayer: true,
    map: this._map,
    preserveViewport: true, // stops the auto-zooming on completed fetch
    polylineOptions: {
      // path: points,
      strokeColor: this._ROUTE_COLOR,
      strokeOpacity: 1.0,
      strokeWeight: 4,
      zIndex: 5,
      map: GoogleMap.getMap(),
      // editable: true,
      geodesic: true    
    }
  }); // _renderer

  this.clearPolyLine = function() {

    this._renderer.setMap(null);
  };

  this.renderOnMap = function(fetchResult) {
    
    this._renderer.setMap(this._map);
    this._renderer.setDirections(fetchResult); // renders polyline on the map
  };

} // RouteRenderer