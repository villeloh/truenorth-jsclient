import { Nullable } from './../misc/types';
import LatLng from './latlng';
import { observable, autorun, toJS } from 'mobx';
import App from '../app';

// after removing the redundant map field, this interface doesn't do much;
// could just use the regular Trip constructor with 1-2 arguments.
/**
 * The shape of the object that is given to the main Trip constructor.
*/
export interface ITripOptions {

    readonly destCoord: Nullable<LatLng>, // it can be null in certain situations, mainly when clicking on water multiple times in a row
    readonly wayPoints?: Array<LatLng> // not all trips have waypoints
} // TripOptions

/**
 * Encapsulates all things that are needed for fetching routes.
 */
export class Trip {

  //@ts-ignore (complaint about being "unable to resolve signature", bla bla bla)
  @observable
  private _destCoord: Nullable<LatLng>;

  // made observable in the constructor (doesn't work here)
  private _wayPoints: Array<LatLng>;

  private _disposer: any;

  constructor(options: ITripOptions) {

    this._destCoord = options.destCoord;

    const wps = options.wayPoints || []; // to avoid 'undefined' later on
    this._wayPoints = observable.array(wps, {});
  } // constructor

  /**
   * Factory method (for fewer arguments).
  */
  static makeTrip(destCoord: LatLng): Trip {

    const options: ITripOptions = {

      destCoord: destCoord,
      wayPoints: []
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
          toJS(this._wayPoints, {}); // a kludge to make it react to the array changes; fix asap
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
      wayPoints: []
    };
    this._wayPoints.forEach(wp => { 
      
      options.wayPoints!.push(wp); // why it needs the '!' is anyone's guess, as it's set directly above
    });

    return new Trip(options);
  } // copyAsReactiveTrip

  get destCoord(): Nullable<LatLng> {

    return this._destCoord;
  }

  set destCoord (newCoord: Nullable<LatLng>) {

    this._destCoord = newCoord;
  }

  addWayPoint(latLng: LatLng): void {

    this._wayPoints.push(latLng);
  }

  updateWayPoint(index: number, newCoord: LatLng): void {

    this._wayPoints[index] = newCoord;
  }

  removeWayPoint(index: number): void {

    this._wayPoints.splice(index, 1);
  }

  get wayPoints(): Array<LatLng> { // or empty array

    return this._wayPoints;
  }

  set wayPoints(newArray: Array<LatLng>) {

    this._wayPoints = newArray;
  }

  /**
   * Returns the waypoints in a format that's needed for route fetches.
  */
  getAllWpsAsAPIObjects(): Array<google.maps.DirectionsWaypoint> {

    return this._wayPoints.map(wp => {

      return {
        stopover: true, // needed by the API (although it's useless)
        location: wp
      };
    });
  } // getAllWpsAsAPIObjects

  /**
  * Sets the destination coordinate to null, removes the contained WayPointObjects,
  * and stops the automatic refetching of routes.
  */
  clear(): void {

    if (this._disposer) {

      this._disposer();
    }
    this._destCoord = null;
    this._wayPoints.length = 0; // there is never a case where only the waypoints are cleared, so it's ok to do this here
  } // clear

} // Trip