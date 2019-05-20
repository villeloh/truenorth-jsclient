import VisualTrip from '../dataclasses/visual-trip';

interface IElevationRequestSuccessCallback {

  (visualTrip: VisualTrip, results: Array<google.maps.ElevationResult>): void;
}

interface IElevationRequestFailureCallback {

  (visualTrip: VisualTrip): void;
}

// A VisualTrip uses the data to render differently colored polylines on the map.
/**
* Used to retrieve elevation data for routes. 
*/
export default class ElevationService {

  private readonly _elevService: google.maps.ElevationService;
  private readonly successCallback: IElevationRequestSuccessCallback;
  private readonly failureCallback: IElevationRequestFailureCallback;

  constructor(successCallback: IElevationRequestSuccessCallback, failureCallback: IElevationRequestFailureCallback) {

    this.successCallback = successCallback;
    this.failureCallback = failureCallback;
    this._elevService = new google.maps.ElevationService();
  }

  // the LatLngs should be extracted from a returned (valid) route.
  // the visualTrip is being 'passed through' this method due to the way that 
  // the callbacks work... a better solution should be found asap.
  fetchElevations(visualTrip: VisualTrip): void {

    const that = this;

    const route = visualTrip.routeResult.routes[0];
    const stepArrays = route.legs.map(leg => { return leg.steps });
    // @ts-ignore (complaint about the custom LatLng type)
    // used for fetching elevations. could be clearer (should have used for-loops, ehh)...
    const routeStepStartCoords = stepArrays.map(stepArray => { 
      
      return stepArray.map(step => { 
        
        return step.start_location 
      })}).reduce((arr, nextArr) => arr.concat(nextArr), []);
  
    // working with callbacks is getting quite unwieldy, but i've no idea how to extract the 
    // resultsArray from this method, as it returns void and that cannot be changed.
    // @ts-ignore (shut up about the missing LatLng methods)
    this._elevService.getElevationForLocations({ locations: routeStepStartCoords }, 
      function(resultsArray: Array<google.maps.ElevationResult>, status: google.maps.ElevationStatus) {
    
      if (status === google.maps.ElevationStatus.OK) {
      
        that.successCallback(visualTrip, resultsArray);
      
      } else {
      
        console.log("Error fetching elevations: " + status);
        that.failureCallback(visualTrip);
      }
    }) // getElevationsForLocations
  } // fetchElevations

} // ElevationService