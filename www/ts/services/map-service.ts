import { GoogleMap } from './../misc/types';
import ClickHandler from '../misc/click-handler';
import RouteRenderer from './route-renderer';
import CyclingLayerToggleButton from '../components/cycling-layer-toggle-button';
import LatLng from '../dataclasses/latlng';
import App from '../app';

/**
 * The map and the various methods and actions on it.
 */

// I couldn't think of a better name for it. 'Container' would imply it's a pure ui element;
// 'GoogleMap' confuses it with the embedded map element. 'Service' is really supposed to be 
// something that does things periodically, but for now this will have to do. 
export default class MapService {

  static readonly MARKER_DRAG_TIMEOUT = 100; // ms

  private static readonly _DEFAULT_ZOOM = 8;
  private static readonly _MIN_ZOOM = 5;
  private static readonly _INITIAL_CENTER_COORDS = new LatLng(0,0);

  // needed in ClickHandler in order not to fire a superfluous route fetch on long press 
  private _markerDragEventJustStopped: boolean = false;
  
  mapHolderDiv: any; // too complicated with the proper type

  private readonly _bikeLayer: any;
  private _bikeLayerOn: boolean = false;

  private readonly _map: any;
  private readonly _routeRenderer: RouteRenderer;

  private readonly _clickHandler = new ClickHandler();

  constructor() {

    const mapOptions = {

      center: MapService._INITIAL_CENTER_COORDS,
      zoom: MapService._DEFAULT_ZOOM, 
      minZoom: MapService._MIN_ZOOM,
      fullscreenControl: false, // missing from the typings, but it works when assigning to object
      gestureHandling: 'greedy',
      mapTypeControl: false,
      // mapTypeControlOptions: { style: google.maps.MapTypeControlStyle.DROPDOWN_MENU },
      rotateControl: false,
      scaleControl: false,
      tilt: 0,
      disableDoubleClickZoom: true // it needs to be disabled because doubletap is used to add waypoints
    }; // mapOptions

    this.mapHolderDiv = document.getElementById('map');

    this._map = new App.google.maps.Map(this.mapHolderDiv, mapOptions);

    this._bikeLayer = new google.maps.BicyclingLayer();

    this._routeRenderer = new RouteRenderer(this._map);

    this._setListeners();
  } // constructor

  reCenter(newCoord: LatLng): void {
    
    this._map.setCenter(newCoord);
  }
  
  // called from ui.ts to add the map ui controls
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

  // wrapper method for a less convoluted call in Trip
  renderOnMap(fetchResult: google.maps.DirectionsResult) {

    this._routeRenderer.renderOnMap(fetchResult);
  }

  clearPolyLineFromMap() {

    this._routeRenderer.clearPolyLine();
  }

  // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX GETTERS & SETTERS & INIT XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

  get markerDragEventJustStopped(): boolean {

    return this._markerDragEventJustStopped;
  }

  set markerDragEventJustStopped(value) {

    this._markerDragEventJustStopped = value;
  }

  get map(): GoogleMap {

    return this._map;
  }
  
  get clickHandler(): ClickHandler {

    return this._clickHandler;
  }

  get bikeLayerOn(): boolean {

    return this._bikeLayerOn;
  }

  _setListeners(): void {

    this.map.addListener('click', function(e) {

      e.id = ClickHandler.ClickType.SINGLE;
      App.mapService.clickHandler.handle(e);
    });
    
    this.map.addListener('dblclick', function(e) { 

      e.id = ClickHandler.ClickType.DOUBLE;
      App.mapService.clickHandler.handle(e);
    });

    this.map.addListener('heading_changed', function(e) {

      console.log("heading changed event: " + JSON.stringify(e)); // doesn't seem to work... read up on it
    });

    this.map.addListener('zoom_changed', function(e) {

      App.mapService.clickHandler.isLongPress = false; // 'this' doesn't work here because of lost context in html (I guess)
    });

    this.map.addListener('dragstart', function() {

      App.mapService.clickHandler.isLongPress = false;
    });

    this.map.addListener('drag', function() {

      App.mapService.clickHandler.isLongPress = false;
    });

    this.map.addListener('dragend', function() {

      App.mapService.clickHandler.isLongPress = false;
    });
    
    // DOM events seem to be the only option for listening for 'long press' type of events.
    // these fire on *every* click though, which makes things messy to say the least
    App.google.maps.event.addDomListener(this.mapHolderDiv, 'touchstart', function(e: any) {

      e.id = ClickHandler.ClickType.LONG_START;
      App.mapService.clickHandler.handle(e); 
    });

    App.google.maps.event.addDomListener(this.mapHolderDiv, 'touchend', function(e: any) {
      
      e.id = ClickHandler.ClickType.LONG_END;
      App.mapService.clickHandler.handle(e);
    });
  } // _setListeners

} // MapService