import { GoogleMap } from '../misc/types';
import Utils from '../misc/utils';
import LatLng from './latlng';
import Marker from './marker';
import App from '../app';

/**
 * A VisualTrip is used purely to visualize trips on the map; a new V.T. is given to 
 * the MapService with each new successful route fetch, ensuring fresh data.
 */

export default class VisualTrip {

  private _destMarker: Marker;
  private _wayPointMarkers: Array<Marker>;

  // a computed values (this way it's not necessary to give them to the constructor)
  private readonly _distance: number;
  private readonly _routeStepStartCoords: Array<LatLng>; // used for obtaining elevation data and for rendering the route on the map

  constructor(
    private readonly _routeResult: google.maps.DirectionsResult, 
    private readonly _destCoord: LatLng, 
    private readonly _wayPointCoords: Array<LatLng>
    ) {

    // the distance will need to be stored for the purpose of calculating new
    // trip durations. it will only be accessed, never altered, which preserves 
    // the immutability of VisualTrip. still, it's an ugly solution and a better one may be possible.
    const route: google.maps.DirectionsRoute = this._routeResult.routes[0];
    this._distance = Utils.distanceInKm(route);

    const stepArrays = route.legs.map(leg => { return leg.steps });
    // @ts-ignore (complaint about the custom LatLng type)
    // used for fetching elevations. could be clearer (should have used for loops, ehh)...
    this._routeStepStartCoords = stepArrays.map(stepArray => { 
      
      return stepArray.map(step => { 
        
        return step.start_location 
      })}).reduce((arr, nextArr) => arr.concat(nextArr), []);

    this._destMarker = Marker.makeDestMarker(this._destCoord);

    this._destMarker.addListener('dragend', App.onDestMarkerDragEnd);
    this._destMarker.addListener('click', App.onDestMarkerClick);
    // this._destMarker.addListener('dblclick', App.onDestMarkerDoubleClick); // disabling for now, as there are some issues with it. ideally this should be possible

    this._wayPointMarkers = [];

    let labelNum = 1;

    for (let i = 0; i < this._wayPointCoords.length; i++) {

      const marker = Marker.makeWayPointMarker(this._wayPointCoords[i], labelNum+"");

      labelNum++;

      marker.addListener('dragend', function (event) {
        event.wpIndex = i;
        App.onWayPointMarkerDragEnd(event);
      });

      marker.addListener('dblclick', function (event) {
        event.wpIndex = i;
        App.onWayPointMarkerDblClick(event);
      });

      this._wayPointMarkers.push(marker);
    } // for
  } // constructor

  showMarkersOnMap(map: GoogleMap): void {

    this._destMarker.showOnMap(map);
    this._wayPointMarkers.map(marker => {

      marker.showOnMap(map);
    });
  }

  clearMarkersFromMap(): void {

    this._destMarker.clearFromMap();
    // this._destMarker = null;
    this._wayPointMarkers.map(marker => {
      marker.clearFromMap();
      return null;
    });

    this._wayPointMarkers.length = 0;
  } // clearFromMap

  get distance(): number {

    return this._distance;
  };

  // needed by the renderer for showing the trip on the map
  get routeResult(): google.maps.DirectionsResult {

    return this._routeResult;
  }

  get routeStepStartCoords(): Array<LatLng> {

    return this._routeStepStartCoords;
  }
    
} // VisualTrip