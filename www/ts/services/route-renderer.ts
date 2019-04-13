
/**
 * Renders routes on the map.
 * NOTE: perhaps it should be called 'Renderer', instead, and have different rendering options?
 */

class RouteRenderer {

  private static readonly _ROUTE_COLOR = '#2B7CFF'; // darkish blue

  private readonly _renderer: google.maps.DirectionsRenderer;

  constructor(private readonly _googleMap: google.maps.Map) {

    this._renderer = new google.maps.DirectionsRenderer({
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

  clearPolyLine(): void {

    // @ts-ignore (we need to set the map to null here)
    this._renderer.setMap(null);
  }

  renderOnMap(fetchResult: google.maps.DirectionsResult): void {

    this._renderer.setMap(this._googleMap);
    this._renderer.setDirections(fetchResult); // renders polyline on the map
  }

} // RouteRenderer