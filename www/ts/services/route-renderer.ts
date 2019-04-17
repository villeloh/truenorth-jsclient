import VisualTrip from "../dataclasses/visual-trip";

/**
 * Renders routes on the map.
 * NOTE: perhaps it should be called 'Renderer', instead, and have different rendering options?
 */

export default class RouteRenderer {

  // private static readonly _ROUTE_COLOR = '#2B7CFF'; // darkish blue
  private static readonly _MAX_GRADIENT = 10;

  // private readonly _renderer: google.maps.DirectionsRenderer;
  private readonly _polyLines: Array<google.maps.Polyline>;

  constructor(private readonly _googleMap: google.maps.Map) {

    this._polyLines = [];
/*
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
    }); // _renderer */
  } // constructor

  clearPolyLine(): void {

    // @ts-ignore (we need to set the map to null here)
    this._polyLines.forEach(line => line.setMap(null));
    this._polyLines.length = 0;
  }

  drawPolyLineFor(visualTrip: VisualTrip, elevations: Array<number>): void {

    const paths = [];
    const distances: Array<number> = [];

    // the legs from waypoint to waypoint
    const legs = visualTrip.routeResult.routes[0].legs;

    for (let i = 0; i < legs.length; i++) {

      for (let j = 0; j < legs[i].steps.length; j++) {

        paths.push(legs[i].steps[j].path); // array of arrays of LatLngs
        distances.push(legs[i].steps[j].distance.value);
      }
    }

    paths.forEach( (path, index) => {

      const elev = elevations[index];
      const nextElev = elevations[index+1] ? elevations[index+1] : elev;
      const dist = distances[index];
      const color = this.computeColor(elev, nextElev, dist);

      const polylineOptions = {

        clickable: false,
        geodesic: true,
        map: this._googleMap,
        path: path,
        strokeColor: color,
        strokeOpacity: 1,
        strokeWeight: 4
      }
      this._polyLines.push(new google.maps.Polyline(polylineOptions));
    });
  } // drawPolyLineFor

  // all values are in meters
  computeColor(elev1: number, elev2: number, distance: number): string {

    const gradient = (elev2 - elev1) / distance; // %; negative means downhill
    let red = 0;
    let green = 0;

    let steepness = gradient / RouteRenderer._MAX_GRADIENT;
    
    if (steepness > 1) {
      steepness = 1;
    } else if (steepness < -1) {
      steepness = -1;
    }

    // since steepness can be negative, these equations work in all cases
    red = 127 + steepness * 15000; // 15k is simply a ballpark figure that seems to produce good visuals; may need to decrease for steeper environments, though
    green = 127 - steepness * 15000;

    red = red > 255 ? 255: red;
    red = red < 0 ? 0: red;     
    green = green > 255 ? 255: green;
    green = green < 0 ? 0: green;

    return `rgba(${red},${green},0,1)`; // note: later on, make an alternative option for color blind ppl!
  } // computeColor

} // RouteRenderer