import { GoogleMap } from '../misc/types';
import Utils from '../misc/utils';
import LatLng from './latlng';
import Marker from './marker';
import App from '../app';

/**
 * Used purely to visualize trips on the map; a new V.T. is given to 
 * the MapService with each new successful route fetch, ensuring fresh data.
 */
export default class VisualTrip {

  private _destMarker: Marker;
  private _wayPointMarkers: Array<Marker>;
/*
  // computed values (this way it's not necessary to give them to the constructor)
  private readonly _distance: number;
  private readonly _routeStepStartCoords: Array<LatLng>; // used for obtaining elevation data and for rendering the route on the map */

  constructor(
    private readonly _routeResult: google.maps.DirectionsResult, // needed for rendering & various calculations
    _destCoord: LatLng, 
    _wayPointCoords: Array<LatLng>
    ) {
    
    this._destMarker = Marker.makeDestMarker(_destCoord);

    this._destMarker.addListener('dragend', App.onDestMarkerDragEnd);
    this._destMarker.addListener('click', App.onDestMarkerClick);
    // this._destMarker.addListener('dblclick', App.onDestMarkerDoubleClick); // disabling for now, as there are some issues with it. ideally this should be possible

    this._wayPointMarkers = [];

    let labelNum = 1;

    for (let i = 0; i < _wayPointCoords.length; i++) {

      const marker = Marker.makeWayPointMarker(_wayPointCoords[i], labelNum+"");

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

  /**
   * Shows the destination and waypoint markers on the given GoogleMap.
  */
  showMarkersOnMap(map: GoogleMap): void {

    this._destMarker.showOnMap(map);
    this._wayPointMarkers.map(marker => {

      marker.showOnMap(map);
    });
  }

  // NOTE: this method's existence goes against VisualTrip's immutability.
  // However, it's only called before setting the VisualTrip instance to null,
  // so I'm letting it slide for now.
  /**
   * Calls clearFromMap() on the destination and waypoint markers 
   * and erases the waypoint markers.
  */
  clearMarkersFromMap(): void {

    this._destMarker.clearFromMap();
    // this._destMarker = null;
    this._wayPointMarkers.map(marker => {
      marker.clearFromMap();
      return null; // this may in fact be unnecessary... investigate the results of disabling.
    });

    this._wayPointMarkers.length = 0;
  } // clearFromMap

  // needed by the renderer for showing the trip on the map
  get routeResult(): google.maps.DirectionsResult {

    return this._routeResult;
  }
    
} // VisualTrip