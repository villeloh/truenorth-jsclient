
/**
 * This is getting a bit too object-oriented, but due to some display issues with markers etc,
 * it's best to have a PlannedTrip object with 'planned' speed, destination, etc. Then Trip can be
 * a 'possible' trip (i.e., the route request was successful), ready to be rendered on the map
 * with only the info that's contained in it / given to it.
 */
class PlannedTrip {

  // I wonder how the static keyword works under the hood?
  // I made PlannedTrip into a class instead of a functional component
  // in order to be able to put these constants in it.
  static get WALK_MODE() { return 'WALKING'; };
  static get CYCLE_MODE() { return 'BICYCLING'; };
  static get MAX_SPEED() { return 50; }; // km/h  
  static get _DEFAULT_SPEED() { return 15; }; // km/h

  constructor() {

    this.position = new Position(new LatLng(0, 0));
    this.speed = PlannedTrip._DEFAULT_SPEED; // km/h
    this.destCoords = null; // LatLng
    this.wayPointObjects = [];
    this.travelMode = PlannedTrip.CYCLE_MODE;
  } // constructor

  copy() {

    const clone = new PlannedTrip();
    clone.position = new Position(this.position.coords);
    clone.speed = this.speed;
    clone.destCoords = this.destCoords;
    clone.wayPointObjects = [];
    this.wayPointObjects.forEach(wpObj => { clone.wayPointObjects.push(wpObj); });
    clone.travelMode = this.travelMode;

    return clone;
  } // copy

  getPosCoords() {

    return this.position.coords;
  }

  updatePosition(newCoords) {

    this.position.update(newCoords);
  }

  getSpeed () {

    return this.speed;
  }

  setSpeed(newSpeed) {

    this.speed = newSpeed;
  }

  getDestCoords() {

    return this.destCoords;
  }

  setDestCoords (newCoords) {

    this.destCoords = newCoords;
  }

  addWayPointObject(latLng) {

    this.wayPointObjects.push(new WayPointObject(latLng));
  }

  updateWayPointObject(index, newCoords) {

    this.wayPointObjects[index].location = newCoords;
  }

  removeWayPointObject(index) {

    this.wayPointObjects.splice(index, 1);
  }

  getWayPointObjects() {

    return this.wayPointObjects;
  }

  // for getting the plain latLngs inside the WayPointObjects
  // (needed for rendering markers on the map)
  getAllWayPointCoords() {

    return this.wayPointObjects.map(wpObj => {

      return wpObj.location;
    });
  }

  clear() {

    this.setDestCoords(null);
    this.wayPointObjects.length = 0; // there is never a case where only the waypoints are cleared, so it's ok to do this here
  }

  getTravelMode() {

    return this.travelMode;
  }

  setTravelMode(newMode) {

    this.travelMode = newMode;
  }
  
} // PlannedTrip