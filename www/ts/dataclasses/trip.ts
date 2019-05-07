import { Nullable } from './../misc/types';
import LatLng from './latlng';
import WayPointObject from './waypoint-object';
import { observable, autorun, toJS } from 'mobx';
import App from '../app';

// after removing the redundant map field, this interface doesn't do much;
// could just use the regular Trip constructor with 1-2 arguments.
/**
 * The shape of the object that is given to the main Trip constructor.
*/
export interface ITripOptions {

    readonly destCoord: Nullable<LatLng>, // it can be null in certain situations, mainly when clicking on water multiple times in a row
    readonly wayPointObjects?: Array<WayPointObject> // not all trips have waypoints
} // TripOptions

/**
 * Encapsulates all things that are needed for fetching routes.
 */
export class Trip {

  //@ts-ignore (complaint about being "unable to resolve signature", bla bla bla)
  @observable
  private _destCoord: Nullable<LatLng>;

  // made observable in the constructor (doesn't work here)
  private _wayPointObjects: Array<WayPointObject>;

  private _disposer: any;

  constructor(options: ITripOptions) {

    this._destCoord = options.destCoord;

    const wpObjects = options.wayPointObjects || []; // to avoid 'undefined' later on
    this._wayPointObjects = observable.array(wpObjects, {});
  } // constructor

  /**
   * Factory method (for fewer arguments).
  */
  static makeTrip(destCoord: LatLng): Trip {

    const options: ITripOptions = {

      destCoord: destCoord,
      wayPointObjects: []
    }
    return new Trip(options);
  } // makeTrip

  // it should take the callback as an argument, but that could lead to 'this' issues.
  /**
   * Auto-fetches a new route every time the Trip's observable properties change.
  */
  autoRefetchRouteOnChange(): void {

    this._disposer = autorun(

        () => {
          toJS(this._wayPointObjects, {}); // a kludge to make it react to the array changes; fix asap
          App.routeService.fetchRoute(this);
        }, {}
      );
  } // autoRefetchRouteOnChange

  /**
  * Copies a Trip without reference (safe copy).
  */
  copy(): Trip {

    const options: ITripOptions = {

      destCoord: this._destCoord,
      wayPointObjects: []
    };
    this._wayPointObjects.forEach(wpObj => { 
      
      options.wayPointObjects!.push(wpObj); // why it needs the '!' is anyone's guess, as it's set directly above
    });

    return new Trip(options);
  } // copyAsReactiveTrip

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

  get wayPointObjects(): Array<WayPointObject> { // or empty array

    return this._wayPointObjects;
  }

  set wayPointObjects(newArray: Array<WayPointObject>) {

    this._wayPointObjects = newArray;
  }

  // needed for rendering markers on the map
  /**
   * Returns the plain LatLngs inside the contained WayPointObjects.
  */
  getAllWayPointCoords(): Array<LatLng> {

    return this._wayPointObjects.map(wpObj => {

      return wpObj.location;
    });
  }

  /**
  * Sets the destination coordinate to null, removes the contained WayPointObjects,
  * and stops the automatic refetching of routes.
  */
  clear(): void {

    if (this._disposer) {

      this._disposer();
    }
    this._destCoord = null;
    this._wayPointObjects.length = 0; // there is never a case where only the waypoints are cleared, so it's ok to do this here
  } // clear

} // Trip