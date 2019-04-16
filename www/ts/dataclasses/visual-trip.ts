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

  // a computed value (this way it's not necessary to give it to the constructor)
  private readonly _distance: number;

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

    this._destMarker = Marker.makeDestMarker(this._destCoord); // visible right away

    this._destMarker.addListener('dragend', App.onDestMarkerDragEnd);
    // this._destMarker.addListener('dblclick', App.onDestMarkerDoubleClick); // disabling for now, as there are some issues with it. ideally this should be possible
    this._destMarker.addListener('click', App.onDestMarkerClick);

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
    
} // VisualTrip