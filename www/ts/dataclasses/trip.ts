import { Nullable, GoogleMap } from './../misc/types';
import { TripOptions } from './trip';
import App from '../app'; // this doesn't feel right... but we need access to it
import LatLng from './latng';
import WayPointObject from './waypoint-object';
import Marker from './marker';

/**
 * Replaces PlannedTrip and VisualTrip. With a bit of refactoring, only one Trip class is needed.
 */

enum Status {

  PREFETCH,
  FAILED,
  SUCCEEDED
}

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
    this._startCoord = options.startCoord
    this._destCoord = options.destCoord;
    this._wayPointObjects = options.wayPointObjects || []; // typescript would allow undefined here; seems it's not infallible?
    this._status = Status.PREFETCH;

    this._distance = null;
    this._duration = null;
    this._fetchResult = null;
    this._destMarker = null;
    this._wayPointMarkers = [];
    // NOTE: the position marker is managed separately, as it doesn't depend on the trip in any way (it's always visible)
  } // constructor

  // convenience factory method for use in App
  static makeTrip(destCoord: LatLng): Trip {

    const options: TripOptions = {
      map: App.mapService.map,
      startCoord: App.currentPos,
      destCoord: destCoord,
      wayPointObjects: App.currentTrip.wayPointObjects || []
    }
    return new Trip(options);
  } // makeTrip

  // shows the Trip on the map
  visualize() {

    // TODO: re-think this logic...
    // show the polyline on the map
    App.mapService.routeRenderer.renderOnMap(this.fetchResult);

    // show the dest marker and waypoints
    this._destMarker!.showOnMap(this._map);

    // this also shows the markers on the map, as their map is set to this._map on creation
    this.fillWayPointMarkersArray();

    /*
    this._wayPointMarkers.forEach(marker => {

      marker.showOnMap(this._map);
    }); */
  } // visualize

  // needed in order not to cause an infinite loop of requests (at least I think this was the cause...)
  copy(): Trip {

    const options: TripOptions = {

      map: this._map,
      startCoord: this._startCoord,
      destCoord: this._destCoord,
      wayPointObjects: [],
      travelMode: this._travelMode
    };
    this._wayPointObjects.forEach(wpObj => { 
      
      options.wayPointObjects!.push(wpObj); // why it needs the '!' is anyone's guess, as it's set directly above
    });

    return new Trip(options);
  } // copy

  get startCoord(): LatLng {

    return this._startCoord;
  }

  // it will need to be called every time the position updates
  set startCoord(newCoord: LatLng) {

    this._startCoord = newCoord;
  }

  get destCoord(): Nullable<LatLng> {

    return this._destCoord;
  }

  set destCoord (newCoord: Nullable<LatLng>) {

    this._destCoord = newCoord;
  }

  addWayPointObject(latLng: LatLng) {

    this._wayPointObjects.push(new WayPointObject(latLng));
  }

  updateWayPointObject(index: number, newCoord: LatLng) {

    this._wayPointObjects[index] = new WayPointObject(newCoord); // WayPointObjects are immutable, so a new one must be created
  }

  removeWayPointObject(index: number) {

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
  getAllWayPointCoords() {

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
    
    this._destMarker.addListener('dragend', App.onDestMarkerDragEnd);
    this._destMarker.addListener('click', App.onDestMarkerTap);
  }

  fillWayPointMarkersArray() {

    let labelNum: number = 1;

    // extract the LatLngs from the stored WayPointObjects
    const wayPointCoordsArray = this.getAllWayPointCoords();

    for (let i = 0; i < wayPointCoordsArray.length; i++) {

      // the markers can be visible right away, as this method is called only in visualize() above
      const marker = new Marker(this._map, wayPointCoordsArray[i], labelNum+"", true);

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
  } // fillWayPointMarkersArray

  clear() {

    this._destCoord = null;
    this._wayPointObjects.length = 0; // there is never a case where only the waypoints are cleared, so it's ok to do this here

    this._distance = null;
    this._duration = null;

    this._destMarker!.clearFromMap();
    this._wayPointMarkers.map(marker => {
      
      marker.clearFromMap();
      return null;
    });

    this._wayPointMarkers.length = 0;
  } // clear

} // Trip
