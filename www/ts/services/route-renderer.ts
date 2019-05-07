import VisualTrip from "../dataclasses/visual-trip";
import LatLng from "../dataclasses/latlng";
import { Nullable } from "../misc/types";
import Utils from "../misc/utils";

/**
 * Renders routes on the map.
 * NOTE: perhaps it should be called 'Renderer', instead, and have different rendering options?
 */

// everything in this class could be static, I guess; but there's no harm in
// making it instance-based.
export default class RouteRenderer {

  private static readonly _MAX_GRADIENT = 10;
  private static readonly _DEFAULT_COLOR = `rgba(100,100,255,1)`; // light blue

  private readonly _polyLines: Array<google.maps.Polyline>;

  constructor(private readonly _googleMap: google.maps.Map) {

    this._polyLines = [];
  }

  clearPolyLine(): void {

    // @ts-ignore (we need to set the map to null here)
    this._polyLines.forEach(line => line.setMap(null));
    this._polyLines.length = 0;
  }

  // elevations could be optional instead of Nullable, but that leads to awkward call syntax.
  drawPolyLineFor(visualTrip: VisualTrip, elevations: Nullable<Array<number>>): void {

    // the legs from waypoint to waypoint
    const legs = visualTrip.routeResult.routes[0].legs;

    elevations === null ? this._renderSinglePolyline(legs) : this._renderMultiplePolylines(legs, elevations);
  } // drawPolyLineFor

  private _renderSinglePolyline(legs: Array<google.maps.DirectionsLeg>): void {

    const path: Array<LatLng> = [];

    for (let i = 0; i < legs.length; i++) {

      for (let j = 0; j < legs[i].steps.length; j++) {

        //@ts-ignore (custom LatLng type complaint)
        path.push(...legs[i].steps[j].path);
      } // inner for
    } // outer for

    const polylineOptions = {

      clickable: false,
      geodesic: true,
      map: this._googleMap,
      path: path,
      strokeColor: RouteRenderer._DEFAULT_COLOR,
      strokeOpacity: 1,
      strokeWeight: 4
    } // polylineOptions
    this._polyLines.push(new google.maps.Polyline(polylineOptions));
  } // _renderSinglePolyline

  private _renderMultiplePolylines(legs: Array<google.maps.DirectionsLeg>, elevations: Array<number>): void {

    const paths: Array<Array<LatLng>> = [];
    const distances: Array<number> = [];

    for (let i = 0; i < legs.length; i++) {

      for (let j = 0; j < legs[i].steps.length; j++) {

        //@ts-ignore (custom LatLng type complaint)
        paths.push(legs[i].steps[j].path);
        distances.push(legs[i].steps[j].distance.value);
      } // inner for
    } // outer for

    paths.forEach( (path, index) => {

      const elev = elevations[index];
      const nextElev = elevations[index+1] ? elevations[index+1] : elev;
      const dist = distances[index];
      const color = RouteRenderer._computeColor(elev, nextElev, dist);

      const polylineOptions = {

        clickable: false,
        geodesic: true,
        map: this._googleMap,
        path: path,
        strokeColor: color,
        strokeOpacity: 1,
        strokeWeight: 4
      } // polylineOptions
      this._polyLines.push(new google.maps.Polyline(polylineOptions));
    }); // forEach
  } // _renderMultiplePolylines

  // all values are in meters.
  // TODO: it could take some color enum values as arguments (e.g. RED and BLUE)
  private static _computeColor(elev1: number, elev2: number, distance: number): string {

    const gradient = (elev2 - elev1) / distance; // %; negative means downhill

    let uphillValue = 0;
    let downhillValue = 0;

    let steepness = gradient / RouteRenderer._MAX_GRADIENT;
    
    if (steepness > 1) {
      steepness = 1;
    } else if (steepness < -1) {
      steepness = -1;
    }

    // since steepness can be negative, these equations work in all cases
    uphillValue = 127 + steepness * 15000; // 15k is simply a ballpark figure that seems to produce good visuals; may need to decrease for steeper environments, though
    downhillValue = 127 - steepness * 15000;

    uphillValue = Utils.clamp(uphillValue, 0, 255); 
    downhillValue = Utils.clamp(downhillValue, 0, 255);

    // atm, red for uphill, blue for downhill, magenta for level ground.
    // better for colorblind people, and works with the green cycling lane markings, 
    // but the colors are too dark even with the highest brightness settings on the phone.
    return `rgba(${uphillValue},0,${downhillValue},1)`;
  } // _computeColor

} // RouteRenderer