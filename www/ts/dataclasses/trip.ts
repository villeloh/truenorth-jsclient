import { Nullable, GoogleMap } from './../misc/types';
import { TripOptions } from './trip';
import App from '../app';
import LatLng from './latlng';
import WayPointObject from './waypoint-object';

/**
 * A Trip encapsulates all things that are needed to fetch routes (showing them is handled by VisualTrip).
 */

// just make one and give it to the Trip constructor (Java Engineers: lul wut?!)
export interface TripOptions {

    readonly map: GoogleMap,
    readonly startCoord: LatLng,
    readonly destCoord: Nullable<LatLng>, // it can be null in certain situations, mainly when clicking on water multiple times in a row
    readonly wayPointObjects?: Array<WayPointObject> // not all trips have waypoints
} // TripOptions

export class Trip {

  private _map: GoogleMap;
  private _startCoord: LatLng;
  private _destCoord: Nullable<LatLng>;
  private _wayPointObjects: Array<WayPointObject>;

  constructor(options: TripOptions) {

    // object destructuring should be used here, but it doesn't want to play ball with 'this'
    this._map = options.map;
    this._startCoord = options.startCoord;
    this._destCoord = options.destCoord;
    this._wayPointObjects = options.wayPointObjects || []; // to avoid 'undefined'
  } // constructor

  // convenience factory method for use in App
  static makeTrip(destCoord: LatLng): Trip {

    const options: TripOptions = {
      map: App.mapService.map,
      startCoord: App.currentTrip.startCoord,
      destCoord: destCoord,
      wayPointObjects: App.currentTrip.wayPointObjects || []
    }
    return new Trip(options);
  } // makeTrip

  // needed in order not to cause an infinite loop of requests (at least I think this was the cause...)
  copy(): Trip {

    const options: TripOptions = {

      map: this._map,
      startCoord: this._startCoord,
      destCoord: this._destCoord,
      wayPointObjects: []
    };
    this._wayPointObjects.forEach(wpObj => { 
      
      options.wayPointObjects!.push(wpObj); // why it needs the '!' is anyone's guess, as it's set directly above
    });

    return new Trip(options);
  } // copy

  get startCoord(): LatLng {

    return this._startCoord;
  }

  // called every time the user's position updates
  set startCoord(newCoord: LatLng) {

    this._startCoord = newCoord;
  }

  get destCoord(): Nullable<LatLng> {

    return this._destCoord;
  }

  set destCoord (newCoord: Nullable<LatLng>) {

    this._destCoord = newCoord;
  }

  addWayPointObject(latLng: LatLng): void {

    this._wayPointObjects.push(new WayPointObject(latLng));
  }

  updateWayPointObject(index: number, newCoord: LatLng): void {

    this._wayPointObjects[index] = new WayPointObject(newCoord); // WayPointObjects are immutable, so a new one must be created
  }

  removeWayPointObject(index: number): void {

    this._wayPointObjects.splice(index, 1);
  }

  get wayPointObjects(): Array<WayPointObject> { // or empty array, but whatever

    return this._wayPointObjects;
  }

  set wayPointObjects(newArray: Array<WayPointObject>) {

    this._wayPointObjects = newArray;
  }

  // for getting the plain latLngs inside the WayPointObjects
  // (needed for rendering markers on the map)
  getAllWayPointCoords(): Array<LatLng> {

    return this._wayPointObjects.map(wpObj => {

      return wpObj.location;
    });
  }

  // not called anywhere atm; may be unnecessary.
  clear(): void {

    this._destCoord = null;
    this._wayPointObjects.length = 0; // there is never a case where only the waypoints are cleared, so it's ok to do this here
  } // clear

} // Trip