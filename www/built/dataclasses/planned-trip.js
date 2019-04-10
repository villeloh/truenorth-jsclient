/**
 * This is getting a bit too object-oriented, but due to some display issues with markers etc,
 * it's best to have a PlannedTrip object with 'planned' speed, destination, etc. Then Trip can be
 * a 'possible' trip (i.e., the route request was successful), ready to be rendered on the map
 * with only the info that's contained in it / given to it.
 */
var PlannedTrip = /** @class */ (function () {
    function PlannedTrip(googleMap) {
        this.googleMap = googleMap;
        this.position = new Position(new LatLng(0, 0), googleMap);
        this.speed = PlannedTrip._DEFAULT_SPEED; // km/h
        this.destCoords = null; // LatLng
        this.wayPointObjects = [];
        this.travelMode = PlannedTrip.CYCLE_MODE;
    } // constructor
    Object.defineProperty(PlannedTrip, "WALK_MODE", {
        // I wonder how the static keyword works under the hood?
        // I made PlannedTrip into a class instead of a functional component
        // in order to be able to put these constants in it.
        get: function () { return 'WALKING'; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlannedTrip, "CYCLE_MODE", {
        get: function () { return 'BICYCLING'; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlannedTrip, "MAX_SPEED", {
        get: function () { return 50; } // km/h  
        ,
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlannedTrip, "_DEFAULT_SPEED", {
        get: function () { return 15; } // km/h
        ,
        enumerable: true,
        configurable: true
    });
    // needed in order not to cause an infinite loop of requests (at least I think this was the cause...)
    PlannedTrip.prototype.copy = function () {
        var clone = new PlannedTrip(this.googleMap);
        clone.position = new Position(this.position.coords, this.googleMap);
        clone.speed = this.speed;
        clone.destCoords = this.destCoords;
        clone.wayPointObjects = [];
        this.wayPointObjects.forEach(function (wpObj) { clone.wayPointObjects.push(wpObj); });
        clone.travelMode = this.travelMode;
        return clone;
    }; // copy
    PlannedTrip.prototype.getPosCoords = function () {
        return this.position.coords;
    };
    // called by GeoLocService periodically
    PlannedTrip.prototype.updatePosition = function (newCoords) {
        this.position.update(newCoords);
    };
    Object.defineProperty(PlannedTrip.prototype, "speed", {
        get: function () {
            return this._speed;
        },
        set: function (newSpeed) {
            this._speed = newSpeed;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlannedTrip.prototype, "travelMode", {
        get: function () {
            return this._travelMode;
        },
        set: function (newMode) {
            this._travelMode = newMode;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlannedTrip.prototype, "destCoords", {
        get: function () {
            return this._destCoords;
        },
        set: function (newCoords) {
            this._destCoords = newCoords;
        },
        enumerable: true,
        configurable: true
    });
    PlannedTrip.prototype.addWayPointObject = function (latLng) {
        this.wayPointObjects.push(new WayPointObject(latLng));
    };
    PlannedTrip.prototype.updateWayPointObject = function (index, newCoords) {
        this.wayPointObjects[index].location = newCoords;
    };
    PlannedTrip.prototype.removeWayPointObject = function (index) {
        this.wayPointObjects.splice(index, 1);
    };
    Object.defineProperty(PlannedTrip.prototype, "wayPointObjects", {
        get: function () {
            return this._wayPointObjects;
        },
        set: function (newArray) {
            this._wayPointObjects = newArray;
        },
        enumerable: true,
        configurable: true
    });
    // for getting the plain latLngs inside the WayPointObjects
    // (needed for rendering markers on the map)
    PlannedTrip.prototype.getAllWayPointCoords = function () {
        return this.wayPointObjects.map(function (wpObj) {
            return wpObj.location;
        });
    };
    PlannedTrip.prototype.clear = function () {
        this.destCoords = null;
        this.wayPointObjects.length = 0; // there is never a case where only the waypoints are cleared, so it's ok to do this here
    };
    return PlannedTrip;
}()); // PlannedTrip
