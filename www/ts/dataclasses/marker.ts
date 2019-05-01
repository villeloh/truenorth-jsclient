import { GoogleMap, Nullable } from './../misc/types';
import LatLng from './latlng';

/**
 * A convenience wrapper for the GoogleMaps Marker element.
 * I put this in dataclasses for now; it's a bit of a hybrid between a visual element and a dataclass.
 */

// adding listeners in the Google Maps API methods requires this function signature
interface IGoogleMapListenerCallback { 
  (...args: Array<any>): void;
}

export default class Marker {

  // private static readonly POS_MARKER_URL = 'http://maps.google.com/mapfiles/kml/shapes/placemark_circle_highlight.png';
  private static readonly POS_MARKER_COLOR = 'rgba(50,50,255,1)' // blue
  private static readonly WAYPOINT_MARKER_COLOR = 'rgba(255,255,255,1)' // white
  private static readonly WAYPOINT_MARKER_STROKE = 'rgba(0,0,0,1)' // black

  private static POS_MARKER_SYMBOL_DEFAULT: any; 

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
      markerOptions.icon = _icon // necessary because I don't know how to set the 'default' icon
    }

    // @ts-ignore (it needs to accept a null map like a good little bitch)
    this._googleMapMarker = new google.maps.Marker(markerOptions);
  } // constructor

  // convenience factories, to avoid giving so many arguments (and making clear what's being created).
  // might replace these with optional arguments to the main constructor.
  static makeDestMarker(destCoord: LatLng): Marker {
    
    return new Marker(null, destCoord, "", true);
  }

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

  addListener(eventName: string, callback: IGoogleMapListenerCallback): void {

    this._googleMapMarker.addListener(eventName, callback);
  }

  clearFromMap(): void {

    // @ts-ignore: next line (wouldn't allow to set the map to null, when it's the only viable option)
    this._googleMapMarker.setMap(null);
    google.maps.event.clearInstanceListeners(this._googleMapMarker);
  }

  // ideally, this wouldn't be needed, as markers could be shown on creation.
  // due to the way that VisualTrip and its rendering are set up atm, though, 
  // it's logical to have this method.
  showOnMap(map: GoogleMap) {

    this._googleMapMarker!.setMap(map);
    return this;
  }

  // we need to make a new marker with each move, as otherwise it 
  // refuses to render.
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