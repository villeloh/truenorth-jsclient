import { Nullable } from './../misc/types';
import { Trip } from './../dataclasses/trip';
import App from '../app';

/**
 * For storing and fetching routes.
 */

interface ISuccessCallback {
  (result: google.maps.DirectionsResult, successfulTrip: Trip): void;
}

interface IFailureCallback {
  (): void;
}

export default class RouteService {

  private readonly _directionsService: google.maps.DirectionsService;

  // technically, a callback should be given with each *call*, but as they're going to be the same every time, 
  // i'm giving them in the constructor
  constructor(private onFetchSuccessCallback: ISuccessCallback, private onFetchFailureCallback: IFailureCallback) {

    this._directionsService = new google.maps.DirectionsService();
/*
    this.prevPlannedTrip = null;
    this.plannedTrip = new PlannedTrip(App.mapService.map); // ideally, take it from localStorage */
  } // constructor

  // ideally, we'd return the altered trip (or null) from this method, but its async nature
  // makes this tricky. perhaps move to that approach later?
  fetchRoute(trip: Trip) {

    if (trip.status !== Trip.Status.PREFETCH) return;

    // Somehow the context is lost in the route fetch callbacks...
    // this is the only convenient workaround.
    const that = this;

    const destCoord = trip.destCoord;

    // null destCoords sometimes reach this method (after clicking on water twice or more in a row).
    // for now, it's an unavoidable side effect of the way the trip state is managed.
    if (destCoord === null) return;

    const request: google.maps.DirectionsRequest = {

      //@ts-ignore (the custom LatLng type is missing some irrelevant methods)
      origin: trip.startCoord,
      //@ts-ignore (the custom LatLng type is missing some irrelevant methods)
      destination: destCoord,
      travelMode: App.travelMode, // comes from the travel mode toggle button
      optimizeWaypoints: false,
      avoidHighways: true,
      waypoints: trip.wayPointObjects
    }; // request
  
    this._directionsService.route(request, function(result: google.maps.DirectionsResult, status: google.maps.DirectionsStatus) {

      if (status === google.maps.DirectionsStatus.OK) {

        trip.status = Trip.Status.SUCCEEDED;

        // in practice, App's onRouteFetchSuccess
        that.onFetchSuccessCallback(result, trip);

      } else {

        console.log("Error fetching route: " + status);
        that.onFetchFailureCallback();
      }
    }); // this._dirService.route
  } // fetchRoute

} // RouteService