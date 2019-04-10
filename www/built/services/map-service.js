/**
 * The map and the various methods and actions on it.
 */
// I couldn't think of a better name for it. 'Container' would imply it's a pure ui element;
// 'GoogleMap' confuses it with the embedded map element. 'Service' is really supposed to be 
// something that does things periodically, but for now this will have to do. 
var MapService = /** @class */ (function () {
    function MapService() {
        var _this = this;
        this.fullClear = function () {
            App.routeService.deletePlannedTrips();
            _this.deleteVisualTrip();
            InfoHeader.reset();
        }; // fullClear
        this.showVisualTripOnMap = function () {
            _this.visualTrip.displayOnMap(_this.map);
        };
        // called from Route.js on every route fetch
        this.deleteVisualTrip = function () {
            if (_this.noVisualTrip)
                return;
            _this.routeRenderer.clearPolyLine();
            _this.visualTrip.clear();
            _this.visualTrip = null;
        }; // deleteVisualTrip
        this.reCenter = function (newCoords) {
            _this.map.setCenter(newCoords);
        };
        // called from ui.js to add the map ui controls
        this.addUIControl = function (position, control) {
            _this.map.controls[position].push(control);
        };
        this.toggleBikeLayer = function (event) {
            var toggleBtn = event.target.parentElement;
            if (_this.bikeLayerOn) {
                CyclingLayerToggleButton.applyOffStyles(toggleBtn);
                _this.bikeLayer.setMap(null);
                _this.bikeLayerOn = false;
            }
            else {
                CyclingLayerToggleButton.applyOnStyles(toggleBtn);
                _this.bikeLayer.setMap(_this.map);
                _this.bikeLayerOn = true;
            }
        }; // toggleBikeLayer
        // needed in ClickHandler in order not to fire a superfluous route fetch on long press  
        this.markerDragEventJustStopped = false;
        var mapOptions = {
            center: MapService._INITIAL_CENTER_COORDS,
            zoom: MapService._DEFAULT_ZOOM,
            minZoom: MapService._MIN_ZOOM,
            fullscreenControl: false,
            gestureHandling: 'greedy',
            mapTypeControl: false,
            // mapTypeControlOptions: { style: google.maps.MapTypeControlStyle.DROPDOWN_MENU },
            rotateControl: false,
            scaleControl: false,
            tilt: 0,
            disableDoubleClickZoom: true // it needs to be disabled because doubletap is used to add waypoints
        }; // mapOptions
        this.mapHolderDiv = document.getElementById('map');
        this.map = new App.google.maps.Map(this.mapHolderDiv, mapOptions);
        this.visualTrip = null;
        this.bikeLayer = new App.google.maps.BicyclingLayer();
        this.bikeLayerOn = false;
        this.routeRenderer = new RouteRenderer(this.map); // for showing fetched routes on the map
        this.clickHandler = new ClickHandler();
        this._setListeners();
    } // constructor
    Object.defineProperty(MapService, "MARKER_DRAG_TIMEOUT", {
        get: function () { return 100; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MapService, "_DEFAULT_ZOOM", {
        get: function () { return 8; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MapService, "_MIN_ZOOM", {
        get: function () { return 5; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MapService, "_INITIAL_CENTER_COORDS", {
        get: function () { return new LatLng(0, 0); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MapService.prototype, "noVisualTrip", {
        get: function () {
            return this.visualTrip === null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MapService.prototype, "markerDragEventJustStopped", {
        // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX GETTERS & SETTERS XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
        get: function () {
            return this._markerDragEventJustStopped;
        },
        set: function (value) {
            this._markerDragEventJustStopped = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MapService.prototype, "visualTrip", {
        get: function () {
            return this._visualTrip;
        },
        set: function (trip) {
            this._visualTrip = trip;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MapService.prototype, "map", {
        get: function () {
            return this._map;
        },
        set: function (value) {
            this._map = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MapService.prototype, "clickHandler", {
        get: function () {
            return this._clickHandler;
        },
        set: function (handler) {
            this._clickHandler = handler;
        },
        enumerable: true,
        configurable: true
    });
    MapService.prototype._setListeners = function () {
        this.map.addListener('click', function (e) {
            e.id = ClickHandler.SINGLE;
            App.mapService.clickHandler.handle(e);
        });
        this.map.addListener('dblclick', function (e) {
            e.id = ClickHandler.DOUBLE;
            App.mapService.clickHandler.handle(e);
        });
        this.map.addListener('heading_changed', function (e) {
            console.log("heading changed event: " + JSON.stringify(e)); // doesn't seem to work... read up on it
        });
        this.map.addListener('zoom_changed', function (e) {
            App.mapService.clickHandler.isLongPress = false; // 'this' doesn't work here because of lost context in html (I guess)
        });
        this.map.addListener('dragstart', function () {
            App.mapService.clickHandler.isLongPress = false;
        });
        this.map.addListener('drag', function () {
            App.mapService.clickHandler.isLongPress = false;
        });
        this.map.addListener('dragend', function () {
            App.mapService.clickHandler.isLongPress = false;
        });
        // DOM events seem to be the only option for listening for 'long press' type of events.
        // these fire on *every* click though, which makes things messy to say the least
        App.google.maps.event.addDomListener(this.mapHolderDiv, 'touchstart', function (e) {
            e.id = ClickHandler.LONG_START;
            App.mapService.clickHandler.handle(e);
        });
        App.google.maps.event.addDomListener(this.mapHolderDiv, 'touchend', function (e) {
            e.id = ClickHandler.LONG_END;
            App.mapService.clickHandler.handle(e);
        });
    }; // _setListeners
    return MapService;
}()); // MapService
