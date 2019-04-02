
/**
 * Renders routes on the map.
 */
class RouteRenderer {

  static get _ROUTE_COLOR() { return '#2B7CFF'; };

  constructor(googleMap) {

    this._googleMap = googleMap;

    this._renderer = new App.google.maps.DirectionsRenderer({
      draggable: false,
      suppressMarkers: true,
      suppressBicyclingLayer: true,
      map: this._googleMap,
      preserveViewport: true,
      polylineOptions: {
        // path: points,
        strokeColor: RouteRenderer._ROUTE_COLOR,
        strokeOpacity: 1.0,
        strokeWeight: 4,
        zIndex: 5,
        map: this._googleMap,
        // editable: true,
        geodesic: true
      }
    }); // _renderer
  } // constructor

  clearPolyLine() {

    this._renderer.setMap(null);
  }

  renderOnMap(fetchResult) {

    this._renderer.setMap(this._googleMap);
    this._renderer.setDirections(fetchResult); // renders polyline on the map
  }

} // RouteRenderer