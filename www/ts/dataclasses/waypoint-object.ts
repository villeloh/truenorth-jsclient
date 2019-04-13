import LatLng from './latlng';

/**
 * For storing the inner waypoint objects that are needed by the fetchRoute method in RouteService.
 */

export default class WayPointObject {

  // typescript insists on having the stopover property, even though it's useless
  constructor(readonly location: LatLng, readonly stopover = true) {
    
  }

  toString(): string {

    return `WP Object: ( lat.: ${this.location.lat}, lng.: ${this.location.lng} )`;
  };
  
} // WayPointObject