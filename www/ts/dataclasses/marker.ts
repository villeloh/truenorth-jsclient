import { GoogleMap } from './../misc/types';
import LatLng from './latlng';
import App from '../app';

/**
 * A convenience wrapper for the GoogleMaps Marker element.
 * I put this in dataclasses for now; it's a bit of a hybrid between a visual element and a dataclass.
 */

// adding listeners in the Google Maps API methods requires this function signature
interface IGoogleMapListenerCallback { 
  (...args: Array<any>): void;
}

export default class Marker {

  static readonly POS_MARKER_URL = 'http://maps.google.com/mapfiles/kml/shapes/placemark_circle_highlight.png';

  private _googleMapMarker: google.maps.Marker;

  constructor(
    private _map: GoogleMap, 
    private _position: LatLng,
    private _label: string, 
    private _isDraggable: boolean) {

    const markerOptions = {

      position: _position,
      map: _map,
      draggable: _isDraggable,
      label: _label,
      crossOnDrag: false // it's not in the typedef file (too new? oversight?), but assigning to an object and then passing it seems to work
    };

    this._googleMapMarker = new google.maps.Marker(markerOptions);
  } // constructor

  // convenience factories, to avoid giving so many arguments (and making clear what's being created).
  // might replace these with optional arguments to the main constructor.
  static makeDestMarker(destCoord: LatLng): Marker {

    return new Marker(App.mapService.map, destCoord, "", true);
  }

  static makeWayPointMarker(coord: LatLng, label: string): Marker {

    return new Marker(App.mapService.map, coord, label, true);
  }

  addListener(eventName: string, callback: IGoogleMapListenerCallback): void {

    this._googleMapMarker.addListener(eventName, callback);
  }

  clearFromMap(): void {

    // @ts-ignore: next line (wouldn't allow to set the map to null, when it's the only viable option)
    this._googleMapMarker.setMap(null);
    google.maps.event.clearInstanceListeners(this._googleMapMarker);
  }

  // should no longer be needed, as markers are now only created when they are to be shown
  /*
  showOnMap(map: GoogleMap) {

    this._googleMapMarker!.setMap(map);
  } */

  // we need to make a new marker with each move, as otherwise it 
  // refuses to render.
  moveTo(newPos: LatLng): void {

    this.clearFromMap(); // erase the old marker

    const options = {

      position: newPos,
      map: this._map,
      draggable: this._isDraggable,
      label: this._label,
      crossOnDrag: false
    }; // options

    this._googleMapMarker = new google.maps.Marker(options);
  } // moveTo

  // the position marker needs this
  setIcon(iconUrl: string): void {

    this._googleMapMarker.setIcon(iconUrl);
  }

} // Marker