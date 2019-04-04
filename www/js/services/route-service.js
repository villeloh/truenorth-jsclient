
/**
 * For storing and fetching routes.
 */

class RouteService {

  constructor(onFetchSuccessCallback, onFetchFailureCallback) {

    this.onFetchSuccess = onFetchSuccessCallback;
    this.onFetchFailure = onFetchFailureCallback;

    this._directionsService = new App.google.maps.DirectionsService();

    this.prevPlannedTrip = null;
    this.plannedTrip = new PlannedTrip(App.mapService.map); // ideally, take it from localStorage
  } // constructor

  fetchRoute = () => {

    // I don't understand why the context is lost in the route fetch callbacks...
    // this is the only convenient workaround.
    const that = this;

    const destCoords = this.plannedTrip.destCoords;

    // null destCoords sometimes reach this method (after clicking on water twice or more in a row).
    // for now, it's an unavoidable side effect of the way the plannedTrip state is managed.
    if (destCoords === null) return; 

    const request = {

      origin: this.plannedTrip.getPosCoords(),
      destination: destCoords,
      travelMode: this.plannedTrip.travelMode, // comes from the travel mode toggle button
      optimizeWaypoints: false,
      avoidHighways: true,
      waypoints: this.plannedTrip.wayPointObjects
    }; // request
  
    this._directionsService.route(request, function(result, status) {

      if (status === 'OK') {

        // in practice, App's onRouteFetchSuccess
        that.onFetchSuccess(result, that.plannedTrip);

      } else {

        console.log("Error fetching route: " + status);
        that.onFetchFailure();
      }
    }); // this._dirService.route
  } // fetchRoute

    // clears the stored waypoints and the destination coordinate from the plannedTrip object.
    // called on clicking the map clear button.
    deletePlannedTrips = () => {

      this.prevPlannedTrip.clear(); // sets destCoords to null, which prevents a route fetch with the trip
      // this._prevPlannedTrip = null; // this wreaks havoc atm, but ideally should be possible
      this.plannedTrip.clear(); // NOTE: do NOT set plannedTrip to null! it breaks the whole app!
    }
  
    updateDestination = (event) => {
  
      const destCoords = this.latLngFromClickEvent(event);
      this.plannedTrip.destCoords = destCoords;
    }
  
    addWayPoint = (event) => {
  
      const clickedPos = this.latLngFromClickEvent(event);
      this.plannedTrip.addWayPointObject(clickedPos);
    }
  
    updateWayPoint = (event) => {
  
      const latLng = this.latLngFromClickEvent(event);
      this.plannedTrip.updateWayPointObject(event.wpIndex, latLng);
    }
  
    deleteWayPoint = (event) => {
  
      const index = event.wpIndex;
      this.plannedTrip.removeWayPointObject(index);
    } // deleteWayPoint
  
    latLngFromClickEvent = (event) => {
  
      return new LatLng(event.latLng.lat(), event.latLng.lng());
    }
  
    get plannedTrip() {
  
      return this._plannedTrip;
    }
  
    set plannedTrip(value) {
  
      this._plannedTrip = value;
    }
  
    get prevPlannedTrip() {
  
      return this._prevPlannedTrip;
    }
  
    set prevPlannedTrip(trip) {
  
      this._prevPlannedTrip = trip;
    }

} // RouteService

/*
function RouteService(onFetchSuccessCallback, onFetchFailureCallback) {

  this._directionsService = new App.google.maps.DirectionsService();

  this.prevPlannedTrip = null;
  this.plannedTrip = new PlannedTrip(App.mapService.map); // ideally, take it from localStorage

  this.fetch = function() {

    const destCoords = this.plannedTrip.destCoords;

    // null destCoords sometimes reach this method (after clicking on water twice or more in a row).
    // for now, it's an unavoidable side effect of the way the plannedTrip state is managed.
    if (destCoords === null) return; 

    const request = {

      origin: this.plannedTrip.getPosCoords(),
      destination: destCoords,
      travelMode: this.plannedTrip.travelMode, // comes from the travel mode toggle button
      optimizeWaypoints: false,
      avoidHighways: true,
      waypoints: this.plannedTrip.wayPointObjects
    }; // request
  
    this._directionsService.route(request, function(result, status) {

      if (status === 'OK') {

        // in practice, App's onRouteFetchSuccess
        onFetchSuccessCallback(result, this.plannedTrip);

      } else {

        console.log("Error fetching route: " + status);
        onFetchFailureCallback();
      }
    }); // this._dirService.route
  } // fetch

  // clears the stored waypoints and the destination coordinate from the plannedTrip object
  deletePlannedTrips = () => {

    this.prevPlannedTrip.clear(); // sets destCoords to null, which prevents a route fetch with the trip
    // this._prevPlannedTrip = null; // this wreaks havoc atm, but ideally should be possible
    this.plannedTrip.clear(); // NOTE: do NOT set plannedTrip to null! it breaks the whole app!
  }

  updateDestination = (event) => {

    const destCoords = this.latLngFromClickEvent(event);
    this.plannedTrip.destCoords = destCoords;
  }

  addWayPoint = (event) => {

    const clickedPos = this.latLngFromClickEvent(event);
    this.plannedTrip.addWayPointObject(clickedPos);
  }

  updateWayPoint = (event) => {

    const latLng = this.latLngFromClickEvent(event);
    this.plannedTrip.updateWayPointObject(event.wpIndex, latLng);
  }

  deleteWayPoint = (event) => {

    const index = event.wpIndex;
    this.plannedTrip.removeWayPointObject(index);

    App.routeService.fetchFor(this.plannedTrip);
  } // deleteWayPoint

  latLngFromClickEvent = (event) => {

    return new LatLng(event.latLng.lat(), event.latLng.lng());
  }

  

  get plannedTrip() {

    return this._plannedTrip;
  }

  set plannedTrip(value) {

    this._plannedTrip = value;
  }

  get prevPlannedTrip() {

    return this._prevPlannedTrip;
  }

  set prevPlannedTrip(trip) {

    this._prevPlannedTrip = trip;
  }

} // RouteService */