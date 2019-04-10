import LatLng from './latng';
import WayPointObject from './waypoint-object';

/**
 * Replaces PlannedTrip and VisualTrip. With a bit of refactoring, only one Trip class is needed.
 */

enum TravelMode {

  WALK = 'WALKING',
  CYCLE = 'BICYCLING'
}

enum Status {

  PREFETCH,
  FAILED,
  SUCCEEDED
}

// just make one and give it to the Trip constructor (Java Engineers: lul wut?!)
export interface TripOptions {

    map: google.maps.Map,
    speed: number,
    startCoord: LatLng,
    destCoord: LatLng,
    wayPointObjects?: Array<WayPointObject>, // not all trips have waypoints
    travelMode: TravelMode
} // TripOptions

export class Trip {

  map: google.maps.Map;
  speed: number;
  startCoord: LatLng;
  destCoord: LatLng;
  wayPointObjects: Array<WayPointObject>;
  travelMode: TravelMode;
  status: Status = Status.PREFETCH;

  // a workaround to include enum in a class. wtf, TypeScript?
  static readonly TravelMode = TravelMode;
  static readonly Status = Status;

  static get MAX_SPEED() { return 50; } // km/h  
  static get DEFAULT_SPEED() { return 15; } // km/h

  constructor(options: TripOptions) {

    // object destructuring should be used here, but it doesn't want to play ball with 'this'
    this.map = options.map;
    this.speed = options.speed;
    this.startCoord = options.startCoord
    this.destCoord = options.destCoord;
    this.wayPointObjects = options.wayPointObjects || []; // typescript would allow undefined here; seems it's not infallible?
    this.travelMode = options.travelMode; // no need for a default as the travel mode comes from the ui widget
  } // constructor


  // shows the Trip on the map
  visualize(map: google.maps.Map) {


  } // visualize

} // Trip
