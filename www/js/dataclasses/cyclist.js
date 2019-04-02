
/**
 * This is getting a bit too object-oriented, but due to some display issues with markers etc,
 * it's best to have a Cyclist object with 'planned' speed, destination, etc. Then Trip can be
 * a 'possible' trip (i.e., the route request was successful), ready to be rendered on the map
 * with only the info that's contained in it / given to it.
 */
class Cyclist {

  // I wonder how the static keyword works under the hood?
  // I made Cyclist into a class instead of a functional component
  // in order to be able to put these constants in it.
  static get WALK_MODE() { return 'WALKING'; };
  static get CYCLE_MODE() { return 'BICYCLING'; };
  static get MAX_SPEED() { return 50; }; // km/h  
  static get _DEFAULT_SPEED() { return 15; }; // km/h

  constructor() {

    this.position = new Position(new LatLng(0, 0));
    this.speed = Cyclist._DEFAULT_SPEED; // km/h
    this.destCoords = null; // LatLng
    this.wayPointObjects = [];
    this.travelMode = Cyclist.CYCLE_MODE;
  } // constructor

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

  clearPlannedTrip() {

    this.setDestCoords(null);
    this.wayPointObjects.length = 0; // there is never a case where only the waypoints are cleared, so it's ok to do this here
  }

  getTravelMode() {

    return this.travelMode;
  }

  setTravelMode(newMode) {

    this.travelMode = newMode;
  }
  
} // Cyclist