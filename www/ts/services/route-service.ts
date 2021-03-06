import { Trip } from './../dataclasses/trip';
import App from '../app';

/**
 * For fetching routes.
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
  constructor(private readonly onFetchSuccessCallback: ISuccessCallback, private readonly onFetchFailureCallback: IFailureCallback) {

    this._directionsService = new google.maps.DirectionsService();
  } // constructor

  // ideally, we'd return the trip (or null) from this method, but its async nature
  // makes this tricky. perhaps move to that approach later?
  fetchRoute(trip: Trip): void {

    const destCoord = trip.destCoord;

    if (destCoord === null) return; // null destCoords sometimes reach this method (after clicking on water twice or more in a row)

    const startCoord = App.state.currentPos;

    // Somehow the context is lost in the route fetch callbacks...
    // this is the only convenient workaround.
    const that = this;

    const request: google.maps.DirectionsRequest = {

      //@ts-ignore (the custom LatLng type is missing some irrelevant methods)
      origin: startCoord,
      //@ts-ignore (the custom LatLng type is missing some irrelevant methods)
      destination: destCoord,
      //@ts-ignore (again, my custom type is not to Google's liking)
      travelMode: App.state.travelMode, // comes from the travel mode toggle button
      optimizeWaypoints: false,
      avoidHighways: true,
      waypoints: trip.getAllWpsAsAPIObjects()
    }; // request
  
    this._directionsService.route(request, function(result: google.maps.DirectionsResult, status: google.maps.DirectionsStatus) {

      if (status === google.maps.DirectionsStatus.OK) {

        // in practice, App's onRouteFetchSuccess
        that.onFetchSuccessCallback(result, trip);

      } else {

        console.log("Error fetching route: " + status);
        that.onFetchFailureCallback();
      }
    }); // this._directionsService.route
  } // fetchRoute

} // RouteService