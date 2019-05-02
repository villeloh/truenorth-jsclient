import LatLng from './latlng';

/**
 * For storing waypoint coordinates in the format that is needed for route fetching.
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