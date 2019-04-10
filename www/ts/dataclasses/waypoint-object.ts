import LatLng from './latng';

/**
 * For storing the inner waypoint objects that are needed by the fetchFor method in route-service.js.
 */

export default class WayPointObject {

  constructor(readonly location: LatLng) {
    
  }

  toString() {

    return `WP Object: ( lat.: ${this.location.lat}, lng.: ${this.location.lng} )`;
  };
  
} // WayPointObject