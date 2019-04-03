/**
 * The heart of the app. The map and the various methods and actions on it.
 */

// I couldn't think of a better name for it. 'Container' would imply it's a pure ui element;
// 'GoogleMap' confuses it with the embedded map element. 'Service' is really supposed to be 
// something that does things periodically, but for now this will have to do. 
class MapService {

  static _DEFAULT_ZOOM = 8;
  static _MIN_ZOOM = 5;
  static _INITIAL_POS_COORDS = new LatLng(0,0);
  static _MARKER_DRAG_TIMEOUT = 100;

  constructor() {

    // needed in ClickHandler in order not to fire a superfluous route fetch on long press  
    this.markerDragEventJustStopped = false;

    const mapOptions = {

      center: MapService._INITIAL_POS_COORDS,
      zoom: MapService._DEFAULT_ZOOM, 
      minZoom: MapService._MIN_ZOOM,
      fullscreenControl: false,
      gestureHandling: 'greedy',
      mapTypeControl: false,
      // mapTypeControlOptions: { style: google.maps.MapTypeControlStyle.DROPDOWN_MENU },
      rotateControl: false,
      scaleControl: false,
      tilt: 0,
      disableDoubleClickZoom: true // it needs to be disabled because doubletap is used to clear the map
    }; // mapOptions

    this.mapHolderDiv = document.getElementById('map');

    this.map = new App.google.maps.Map(this.mapHolderDiv, mapOptions);

    
    this.prevPlannedTrip = null;
    this.plannedTrip = new PlannedTrip(this.map); // ideally, take it from localStorage
    this.visualTrip = null;

    this.bikeLayer = new App.google.maps.BicyclingLayer();

    this.routeService = new RouteService(this.onRouteFetchSuccess, this.onRouteFetchFailure);
    this.routeRenderer = new RouteRenderer(this.map); // for showing fetched routes on the map

    this.clickHandler = new ClickHandler();

    this.menuIsVisible = false;
    this.bikeLayerOn = false;

    GoogleMapInit.readyAll(this);
  } // constructor

  get markerDragEventJustStopped() {

    return this._markerDragEventJustStopped;
  }

  set markerDragEventJustStopped(value) {

    this._markerDragEventJustStopped = value;
  }

  get plannedTrip() {

    return this._plannedTrip;
  }

  set plannedTrip(value) {

    this._plannedTrip = value;
  }

  get visualTrip() {

    return this._visualTrip;
  }

  set visualTrip(trip) {

    this._visualTrip = trip;
  }

  get map() {

    return this._map;
  }

  set map(value) {

    this._map = value;
  }
  
  get clickHandler() {

    return this._clickHandler;
  }

  set clickHandler(handler) {

    this._clickHandler = handler;
  }

  // needs to be an arrow function to retain correct 'this', for some reason
  onRouteFetchSuccess = (fetchResult, successfulPlannedTrip) => {

    this.prevPlannedTrip = successfulPlannedTrip.copy(); // save the trip in case the next one is unsuccessful

    this.deleteVisualTrip();

    this.routeRenderer.renderOnMap(fetchResult);
    
    const route = fetchResult.routes[0];

    const dist = Utils.distanceInKm(route);
    const dura = Utils.calcDuration(dist, successfulPlannedTrip.speed);

    const destCoords = successfulPlannedTrip.destCoords;
    const wayPointCoords = successfulPlannedTrip.getAllWayPointCoords();

    const tripToDisplay = new VisualTrip(this, destCoords, wayPointCoords, dist, dura);

    this.visualTrip = tripToDisplay;
    this.visualTrip.displayOnMap(this.map);

    InfoHeader.updateDistance(dist);
    InfoHeader.updateDuration(dura);
  } // onRouteFetchSuccess

  onRouteFetchFailure = () => {

    this.plannedTrip = this.prevPlannedTrip.copy(); // restore a successful trip

    this.routeService.fetchFor(this.plannedTrip); // we need to re-fetch because otherwise dragging the dest marker over water will leave it there
  }

  onMapStyleToggleButtonClick = (event) => {
    
    const textHolderDiv = event.target;
    const value = textHolderDiv.innerText; // supposedly expensive... but .textContent refuses to work with the switch, even though the type is string!
 
    switch (value) {
      case MapStyleToggleButton.NORMAL_TXT:
        
        this.map.setMapTypeId(App.google.maps.MapTypeId.ROADMAP);
        break;
      case MapStyleToggleButton.SAT_TXT:
        
        this.map.setMapTypeId(App.google.maps.MapTypeId.HYBRID);
        break;
      case MapStyleToggleButton.TERRAIN_TXT:
        
        this.map.setMapTypeId(App.google.maps.MapTypeId.TERRAIN);
        break;
      default:

        console.log("something is badly wrong with map style toggle clicks...");
        console.log("text value in default statement: " + value);
        break;
    } // switch
  } // onMapStyleToggleButtonClick

  onLocButtonClick = () => {

    this.reCenter(this.plannedTrip.getPosCoords());
  }

  onTravelModeToggleButtonClick = (event) => {

    this.plannedTrip.travelMode = event.target.value; 
  }

  onCyclingLayerToggleButtonClick = (event) => {

    this.toggleBikeLayer(event);
  }

  // toggles the right-hand corner menu
  onMenuButtonClick = (event) => {

    this.toggleMenuVisibility(event);
  }

  // technically, it removes / recreates the menu with each click.
  // this is needed because zoom events 'reset' the map, which makes 
  // the menu become visible with each zoom if it's present in the DOM.
  // TODO: move it to Menu.js !
  toggleMenuVisibility = (event) => {

    const menuBtnTextHolderDiv = event.target;

    if (this.menuIsVisible) {

      this.menuIsVisible = false;
      UI.removeElement(Menu.DIV_ID);
      menuBtnTextHolderDiv.textContent = MenuButton.CLOSED_SYMBOL;
      menuBtnTextHolderDiv.style.fontSize = '26px'; // the symbols for the open and closed menu are of different sizes in the same font, so the other one has to be made larger
    } else {

      this.menuIsVisible = true;
      UI.addMenu();
      menuBtnTextHolderDiv.textContent = MenuButton.OPEN_SYMBOL;
      menuBtnTextHolderDiv.style.fontSize = '20px';
    } // if-else
  } // toggleMenuVisibility

  toggleBikeLayer = (event) => {

    const toggleBtn = event.target.parentElement;

    if (this.bikeLayerOn) {

      toggleBtn.style.backgroundColor = CyclingLayerToggleButton.BG_COLOR_OFF;
      toggleBtn.style.border = CyclingLayerToggleButton.BORDER_OFF;
      this.bikeLayer.setMap(null);
      this.bikeLayerOn = false;
    } else {

      toggleBtn.style.backgroundColor = CyclingLayerToggleButton.BG_COLOR_ON;
      toggleBtn.style.border = CyclingLayerToggleButton.BORDER_ON;
      this.bikeLayer.setMap(this.map);
      this.bikeLayerOn = true;
    }
  } // toggleBikeLayer

  onWayPointDblClick = (event) => {

    this.deleteWayPoint(event);
  }

  deleteWayPoint = (event) => {

    const index = event.wpIndex;
    this.plannedTrip.removeWayPointObject(index);

    this.routeService.fetchFor(this.plannedTrip);
  } // deleteWayPoint

  onDestMarkerDragEnd = (event) => {

    this.updateDestination(event);

    this.routeService.fetchFor(this.plannedTrip);

    this.markerDragEventJustStopped = true; // needed in order not to tangle the logic with that of a long press

    setTimeout(() => {

      this.markerDragEventJustStopped = false;
    }, MapService._MARKER_DRAG_TIMEOUT);
  } // onDestMarkerDragEnd

  onDestMarkerTap = (event) => {
    
    console.log("tap event: " + JSON.stringify(event));
    // TODO: open an info window with place info
  }

  onClearButtonClick = () => {

    if (this.noVisualTrip()) return;

    this.fullClear();
  } // onClearButtonClick

  fullClear = () => {

    this.deletePlannedTrips();
    this.deleteVisualTrip();

    InfoHeader.reset();
  } // fullClear
  
  // called from Route.js on every route fetch
  deleteVisualTrip = () => {

    if (this.noVisualTrip()) return;

    this.routeRenderer.clearPolyLine();
    
    this.visualTrip.clear();
    this.visualTrip = null;
  } // deleteVisualTrip

  // clears the stored waypoints and the destination coordinate from the _plannedTrip object
  deletePlannedTrips = () => {

    this.prevPlannedTrip.clear(); // sets destCoords to null, which prevents a route fetch with the trip
    // this._prevPlannedTrip = null; // this wreaks havoc atm, but ideally should be possible
    this.plannedTrip.clear(); // NOTE: do NOT set plannedTrip to null! it breaks the whole app!
  }

  onGoogleMapLongPress = (event) => {

    this.updateDestination(event);

    this.routeService.fetchFor(this.plannedTrip);
  }

  onGoogleMapDoubleClick = (event) => {

    // waypoints cannot be added without a valid destination
    if (this.noVisualTrip()) return;

    this.addWayPoint(event);

    this.routeService.fetchFor(this.plannedTrip);
  }

  latLngFromClickEvent = (event) => {

    return new LatLng(event.latLng.lat(), event.latLng.lng());
  }

  addWayPoint = (event) => {

    const clickedPos = this.latLngFromClickEvent(event);
    this.plannedTrip.addWayPointObject(clickedPos);
  } // addWayPoint

  updateDestination = (event) => {

    const destCoords = this.latLngFromClickEvent(event);
    this.plannedTrip.destCoords = destCoords;
  }

  onWayPointDragEnd = (event) => {

    this.updateWayPoint(event);
    
    this.routeService.fetchFor(this.plannedTrip);

    this.markerDragEventJustStopped = true; // needed in order not to tangle the logic with that of a long press

    setTimeout(() => {

      this.markerDragEventJustStopped = false;
    }, MapService._MARKER_DRAG_TIMEOUT);
  } // onWayPointDragEnd

  updateWayPoint = (event) => {

    const latLng = this.latLngFromClickEvent(event);
    this.plannedTrip.updateWayPointObject(event.wpIndex, latLng);
  }

  noVisualTrip = () => {
    
    return this.visualTrip === null;
  }

  reCenter = (newCoords) => {
    
    this.map.setCenter(newCoords);
  }

  // called from ui.js to add the map ui controls
  addUIControl = (position, control) => {

    this.map.controls[position].push(control);
  }

  // does what it says... called when recreating the menu
  // (as it's not a click event, it needs its own method)
  setInitialCyclingLayerToggleButtonStyles = () => {

    const toggleBtn = document.getElementById(CyclingLayerToggleButton.OUTER_DIV_ID);

    if (this.bikeLayerOn) {

      toggleBtn.style.backgroundColor = CyclingLayerToggleButton.BG_COLOR_ON;
      toggleBtn.style.border = CyclingLayerToggleButton.BORDER_ON;
      // this._bikeLayer.setMap(this._map); // should not be needed
    } else {

      toggleBtn.style.backgroundColor = CyclingLayerToggleButton.BG_COLOR_OFF;
      toggleBtn.style.border = CyclingLayerToggleButton.BORDER_OFF;
      // this._bikeLayer.setMap(null);
    } // if-else
  } // setInitialCyclingLayerToggleButtonStyles

} // MapService