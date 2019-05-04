import { GoogleMap, Nullable } from './../misc/types';
import ClickHandler from '../misc/click-handler';
import RouteRenderer from './route-renderer';
import { CyclingLayerToggleButton } from '../components/components';
import LatLng from '../dataclasses/latlng';
import App from '../app';
import VisualTrip from '../dataclasses/visual-trip';

/**
 * The map and the various methods and actions on it.
 */

// I couldn't think of a better name for it. 'Container' would imply it's a pure ui element;
// 'GoogleMap' confuses it with the embedded map element. 'Service' is really supposed to be 
// something that does things periodically, but for now this will have to do. 
export default class MapService {

  static readonly MARKER_DRAG_TIMEOUT = 100; // ms

  private static readonly _DEFAULT_ZOOM = 11;
  private static readonly _MIN_ZOOM = 5;
  private static readonly _INITIAL_CENTER_COORDS = new LatLng(0,0);
  
  mapHolderDiv: any; // too complicated with the proper type

  private readonly _bikeLayer: any;
  private _bikeLayerOn: boolean = false;

  private readonly _map: any;
  private readonly _routeRenderer: RouteRenderer;

  private _visualTrip: Nullable<VisualTrip>;

  constructor() {

    const mapOptions = {

      center: MapService._INITIAL_CENTER_COORDS,
      zoom: MapService._DEFAULT_ZOOM, 
      minZoom: MapService._MIN_ZOOM,
      fullscreenControl: false, // missing from the typings, but it works when assigning to an object
      gestureHandling: 'greedy',
      mapTypeControl: false,
      clickableIcons: false, // they're a nuisance due to misclicks; use regular Google Maps if you need place info
      rotateControl: false,
      scaleControl: false,
      tilt: 0,
      disableDoubleClickZoom: true // it needs to be disabled because doubletap is used to add waypoints
    }; // mapOptions

    this.mapHolderDiv = document.getElementById('map');

    this._map = new App.google.maps.Map(this.mapHolderDiv, mapOptions);

    this._bikeLayer = new google.maps.BicyclingLayer();

    this._visualTrip = null;

    this._routeRenderer = new RouteRenderer(this._map);

    this._setListeners(this._map, App.clickHandler);
  } // constructor

  reCenter(newCoord: LatLng): void {
    
    this._map.setCenter(newCoord);
  }
  
  // called from ui-builder.ts to add the map ui controls
  addUIControl(position: any, control: any): void {

    this._map.controls[position].push(control);
  }

  toggleBikeLayer(event: any): void {

    const toggleBtn = event.target.parentElement;

    if (this._bikeLayerOn) {

      CyclingLayerToggleButton.applyOffStyles(toggleBtn);

      // @ts-ignore (we need to set the map to null here)
      this._bikeLayer.setMap(null);
      this._bikeLayerOn = false;
    } else {

      CyclingLayerToggleButton.applyOnStyles(toggleBtn);
      this._bikeLayer.setMap(this._map);
      this._bikeLayerOn = true;
    }
  } // toggleBikeLayer

  renderTripOnMap(visualTrip: VisualTrip, elevations: Array<number>): void {

    this._visualTrip = visualTrip;
    this._visualTrip.showMarkersOnMap(this._map);
    this._routeRenderer.drawPolyLineFor(visualTrip, elevations);
  }

  clearTripFromMap(): void {

    if (this._visualTrip === null) return;

    this._visualTrip.clearMarkersFromMap();
    this._visualTrip = null;
    this._routeRenderer.clearPolyLine();
  }

  // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX GETTERS & SETTERS & INIT XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

  get map(): GoogleMap {

    return this._map;
  }

  get bikeLayerOn(): boolean {

    return this._bikeLayerOn;
  }

  get visualTrip(): Nullable<VisualTrip> {

    return this._visualTrip;
  }

  _setListeners(map: GoogleMap, clickHandler: ClickHandler): void {

    map.addListener('click', function(e: any) {

      e.id = ClickHandler.ClickType.SINGLE;
      clickHandler.handle(e);
    });
    
    map.addListener('dblclick', function(e: any) { 

      e.id = ClickHandler.ClickType.DOUBLE;
      clickHandler.handle(e);
    });

    map.addListener('heading_changed', function(e: any) {

      console.log("heading changed event: " + JSON.stringify(e)); // doesn't seem to work... read up on it
    });

    map.addListener('zoom_changed', function(e: any) {

      clickHandler.isLongPress = false; // 'this' doesn't work here because of lost context in html (I guess)
    });

    map.addListener('dragstart', function() {

      clickHandler.isLongPress = false;
    });

    map.addListener('drag', function() {

      clickHandler.isLongPress = false;
    });

    map.addListener('dragend', function() {

      clickHandler.isLongPress = false;
    });
    
    // DOM events seem to be the only option for listening for 'long press' type of events.
    // these fire on *every* click though, which makes things messy to say the least
    App.google.maps.event.addDomListener(this.mapHolderDiv, 'touchstart', function(e: any) {

      e.id = ClickHandler.ClickType.LONG_START;
      clickHandler.handle(e); 
    });

    App.google.maps.event.addDomListener(this.mapHolderDiv, 'touchend', function(e: any) {
      
      e.id = ClickHandler.ClickType.LONG_END;
      clickHandler.handle(e);
    });
  } // _setListeners

} // MapService