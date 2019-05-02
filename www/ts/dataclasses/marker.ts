import { GoogleMap, Nullable } from './../misc/types';
import LatLng from './latlng';

/**
 * Adding listeners in the Google Maps API methods requires this function signature
 * */
interface IGoogleMapListenerCallback { 
  (...args: Array<any>): void;
}

// I put this under dataclasses for now; it's a bit of a hybrid between a visual element and a dataclass.
/**
 * A convenience wrapper for the Google Maps Marker element, with added methods.
 */
export default class Marker {

  private static readonly POS_MARKER_COLOR = 'rgba(50,50,255,1)' // blue
  private static readonly WAYPOINT_MARKER_COLOR = 'rgba(255,255,255,1)' // white
  private static readonly WAYPOINT_MARKER_STROKE = 'rgba(0,0,0,1)' // black

  private readonly _googleMapMarker: google.maps.Marker;

  constructor(
    private _map: Nullable<GoogleMap>, 
    private _position: LatLng,
    private _label: string, 
    private _isDraggable: boolean,
    private _icon?: google.maps.Symbol
    ) {

    let markerOptions: any = {

      position: _position,
      map: _map,
      draggable: _isDraggable,
      label: _label,
      crossOnDrag: false // it's not in the typedef file (too new? oversight?), but assigning to an object and then passing it seems to work
    };

    if (_icon) {
      markerOptions.icon = _icon; // necessary because I don't know how to set the 'default' icon
    }

    // @ts-ignore (it needs to accept a null map like a good little bitch)
    this._googleMapMarker = new google.maps.Marker(markerOptions);
  } // constructor

  /**
   * Factory method for making a destination marker.
  */
  static makeDestMarker(destCoord: LatLng): Marker {
    
    return new Marker(null, destCoord, "", true);
  }

  /**
   * Factory method for making a labeled waypoint marker.
  */
  static makeWayPointMarker(coord: LatLng, label: string): Marker {

    const symbol = {

      fillColor: this.WAYPOINT_MARKER_COLOR,
      fillOpacity: 1,
      path: google.maps.SymbolPath.CIRCLE, // todo: learn how to use svg paths
      scale: 8,
      strokeColor: this.WAYPOINT_MARKER_STROKE,
      strokeWeight: 1
    }; // symbol

    return new Marker(null, coord, label, true, symbol);
  } // makeWayPointMarker

  /**
   * Factory method for making a position marker.
  */
  static makePosMarker(map: google.maps.Map, coord: LatLng): Marker {

    const symbol = {

      fillColor: Marker.POS_MARKER_COLOR,
      fillOpacity: 1,
      path: google.maps.SymbolPath.CIRCLE,
      scale: 5,
      strokeColor: Marker.POS_MARKER_COLOR,
      strokeWeight: 1
    }; // symbol

    return new Marker(map, coord, "", false, symbol)
  } // makePosMarker

  /**
   * Wrapper method to add a listener to the contained Google Maps Marker.
   * @param eventName the name of the event; e.g. 'click'
   * @param callback a method whose type is IGoogleMapListenerCallback
   */
  addListener(eventName: string, callback: IGoogleMapListenerCallback): void {

    this._googleMapMarker.addListener(eventName, callback);
  }

  /**
   * Sets the contained Google Maps Marker's map to null and clears all listeners from this Marker.
  */
  clearFromMap(): void {

    // @ts-ignore (wouldn't allow to set the map to null, when it's the only viable option)
    this._googleMapMarker.setMap(null);
    google.maps.event.clearInstanceListeners(this._googleMapMarker);
  }

  // ideally, this wouldn't be needed, as markers could be shown on creation.
  // due to the way that VisualTrip and its rendering are set up atm, though, 
  // it's logical to have this method.
  /**
  * Sets the given map as the contained Google Maps Marker's map.
  */
  showOnMap(map: GoogleMap) {

    this._googleMapMarker!.setMap(map);
    return this;
  }

  // NOTE: only used by the posMarker atm. ideally, the Marker would be moved and not
  // destroyed and recreated, but that fails to render it for some reason.
  /**
   * Deletes the old Marker and makes a new one in the given position. 
  */
  moveTo(newPos: LatLng): void {

    this.clearFromMap(); // erase the old marker

    const options = {

      position: newPos,
      map: this._map,
      draggable: this._isDraggable,
      label: this._label,
      crossOnDrag: false,
      icon: this._googleMapMarker.getIcon()
    }; // options

    // @ts-ignore (warning about incompatible types, due to the icon field in options)
    this._googleMapMarker = new google.maps.Marker(options);
  } // moveTo

} // Marker