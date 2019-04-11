import { GoogleMapListenerCallback, Nullable, GoogleMap } from './../misc/types';
import LatLng from './latng';

/**
 * A convenience wrapper for the GoogleMaps Marker element.
 * I put this in dataclasses for now; it's a bit of a hybrid between a visual element and a dataclass.
 */

export default class Marker {

  private _googleMapMarker: Nullable<google.maps.Marker>;

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

  // takes a string and a function, like the underlying 
  // addListener method that it wraps
  addListener(eventName: string, callback: GoogleMapListenerCallback) {

    this._googleMapMarker!.addListener(eventName, callback);
  }

  // this won't be called if the inner marker is null
  clearFromMap() {

    this._googleMapMarker!.setMap(null);
    google.maps.event.clearInstanceListeners(this._googleMapMarker!);
    this._googleMapMarker = null;
  }

  // should no longer be needed, as markers are now only created when they are to be shown
  /*
  showOnMap(map: GoogleMap) {

    this._googleMapMarker!.setMap(map);
  } */

  // we need to make a new marker with each move, as otherwise it 
  // refuses to render.
  moveTo(newPos: LatLng) {

    this.clearFromMap(); // erase the old marker

    const options = {

      position: newPos,
      map: this._map,
      draggable: this._isDraggable,
      label: this._label,
      crossOnDrag: false
    };

    this._googleMapMarker = new google.maps.Marker(options);
  } // moveTo

} // Marker