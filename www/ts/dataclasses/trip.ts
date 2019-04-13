import { Nullable, GoogleMap } from './../misc/types';
import { TripOptions } from './trip';
import App from '../app'; // this doesn't feel right... but we need access to it
import LatLng from './latlng';
import WayPointObject from './waypoint-object';
import Marker from './marker';

/**
 * A Trip encapsulates most things that are needed to fetch routes and show them on the map 
 * (distance, duration, and own position are managed separately in App.ts).
 */

// these are not very useful atm, but they could be in the near future
enum Status {

  PREFETCH,
  FAILED,
  SUCCEEDED,
  SHOWN
}

// just make one and give it to the Trip constructor (Java Engineers: lul wut?!)
export interface TripOptions {

    readonly map: GoogleMap,
    readonly startCoord: LatLng,
    readonly destCoord: Nullable<LatLng>, // it can be null in certain situations, mainly when clicking on water multiple times in a row
    readonly wayPointObjects?: Array<WayPointObject>, // not all trips have waypoints
    readonly status: Status
} // TripOptions

export class Trip {

  private _map: GoogleMap;
  private _startCoord: LatLng;
  private _destCoord: Nullable<LatLng>;
  private _wayPointObjects: Array<WayPointObject>;

  // these fields can only be set after the route fetch returns successfully
  private _distance: Nullable<number>; // km/h
  private _duration: Nullable<number>; // decimal hours
  private _fetchResult: Nullable<google.maps.DirectionsResult>;
  private _destMarker: Nullable<Marker>;
  private _wayPointMarkers: Array<Marker>;

  private _status: Status;

  // a workaround to include enum in a class. wtf, TypeScript?
  static readonly Status = Status;

  constructor(options: TripOptions) {

    // object destructuring should be used here, but it doesn't want to play ball with 'this'
    this._map = options.map;
    this._startCoord = options.startCoord;
    this._destCoord = options.destCoord;
    this._wayPointObjects = options.wayPointObjects || []; // to avoid 'undefined'
    this._status = options.status;

    // ideally, distance & duration of App.currentTrip would be observable values that auto-update the info header on each change
    this._distance = null;
    this._duration = null;

    this._fetchResult = null; // storing the fetch result in the Trip object is convenient, but seems wrong somehow

    // the markers could be part of MapService's state, but this is more convenient
    this._destMarker = null;
    this._wayPointMarkers = [];
    // NOTE: the position marker is managed separately, as it doesn't depend on the trip in any way (it's always visible)
  } // constructor

  // convenience factory method for use in App
  static makeTrip(destCoord: LatLng): Trip {

    const options: TripOptions = {
      map: App.mapService.map,
      startCoord: App.currentTrip.startCoord,
      destCoord: destCoord,
      wayPointObjects: App.currentTrip.wayPointObjects || [],
      status: Trip.Status.PREFETCH
    }
    return new Trip(options);
  } // makeTrip

  showOnMap(): void {

    // show the polyline on the map.
    // NOTE: I'm not sure if this is the best pattern for showing the route.
    // perhaps mapService's render method should take the Trip as an argument, instead, and be called from App?
    App.mapService.renderOnMap(this._fetchResult!); // when we call this, it will exist

    // show the dest marker
    if (this._destCoord !== null) {

      // calling the setter sets the listeners as well
      this.destMarker = Marker.makeDestMarker(this._destCoord); // shows it as well
    } else {
      this._destMarker = null; // should already be null, but it doesn't hurt
    }

    // this also adds listeners and shows the markers on the map
    this.makeWayPointMarkers();
  } // showOnMap

  // needed in order not to cause an infinite loop of requests (at least I think this was the cause...)
  copy(): Trip {

    const options: TripOptions = {

      map: this._map,
      startCoord: this._startCoord,
      destCoord: this._destCoord,
      wayPointObjects: [],
      status: Trip.Status.PREFETCH
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

  get status(): Status {

    return this._status;
  }

  set status(newStatus: Status) {

    this._status = newStatus;
  }

  get distance(): Nullable<number> {

    return this._distance;
  }

  set distance(newDist: Nullable<number>) {

    this._distance = newDist;
  }

  get duration(): Nullable<number> {

    return this._duration;
  }

  set duration(newDura: Nullable<number>) {

    this._duration = newDura;
  }

  get fetchResult(): Nullable<google.maps.DirectionsResult> {

    return this._fetchResult;
  }

  set fetchResult(newResult: Nullable<google.maps.DirectionsResult>) {

    this._fetchResult = newResult;
  }

  set destMarker(marker: Marker) {

    this._destMarker = marker;
    
    // it's convenient to auto-add them, but technically a violation of the get/set pattern
    this._destMarker.addListener('dragend', App.onDestMarkerDragEnd);
    this._destMarker.addListener('click', App.onDestMarkerTap);
  }

  makeWayPointMarkers(): void {

    let labelNum: number = 1;

    // extract the LatLngs from the stored WayPointObjects
    const wayPointCoordsArray = this.getAllWayPointCoords();

    for (let i = 0; i < wayPointCoordsArray.length; i++) {

      // the markers are visible on the map right away
      const marker = Marker.makeWayPointMarker(wayPointCoordsArray[i], labelNum+"");

      labelNum++;

      marker.addListener('dragend', function (event) {
        event.wpIndex = i;
        App.onWayPointMarkerDragEnd(event);
      });

      marker.addListener('dblclick', function (event) {
        event.wpIndex = i;
        App.onWayPointDblClick(event);
      });

      this._wayPointMarkers.push(marker);
    } // for
  } // makeWayPointMarkers

  // i.e., clear it both from the map and as a 'planned' trip
  clear(): void {

    this._destCoord = null;
    this._wayPointObjects.length = 0; // there is never a case where only the waypoints are cleared, so it's ok to do this here

    this._distance = null;
    this._duration = null;

    App.mapService.clearPolyLineFromMap();

    this._destMarker!.clearFromMap();
    this._wayPointMarkers.map(marker => {
      
      marker.clearFromMap();
      return null;
    });

    this._wayPointMarkers.length = 0;
  } // clear

} // Trip