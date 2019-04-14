import LatLng from './latlng';

/**
 * For storing the inner waypoint objects that are needed by the fetchRoute method in RouteService.
 */

export default class WayPointObject {

  readonly location: any;

  // typescript insists on having the stopover property, even though it's useless
  constructor(latLng: LatLng, readonly stopover = true) {
    
    this.location = latLng;
  }

  toString(): string {

    return `WP Object: ( lat.: ${this.location.lat}, lng.: ${this.location.lng} )`;
  };
  
} // WayPointObject