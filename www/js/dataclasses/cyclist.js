
/**
 * This is getting a bit too object-oriented, but due to some display issues with markers etc,
 * it's best to have a Cyclist object with 'planned' speed, destination, etc. Then Trip can be 
 * a 'possible' trip (i.e., the route request was successful), ready to be rendered on the map in all its glory.
 */

function Cyclist(travelMode) {

  this.position = new Position(new LatLng(0,0));
  this.speed = Constants.DEFAULT_SPEED; // km/h
  this.destCoords = null; // LatLng
  this.wayPointObjects = [];
  this.travelMode = travelMode;

  this.getPosCoords = function() {

    return this.position.coords;
  };

  this.updatePosition = function(newCoords) {

    this.position.update(newCoords);
  };

  this.getSpeed = function() {

    return this.speed;
  };

  this.setSpeed = function(newSpeed) {

    this.speed = newSpeed;
  };

  this.setDestCoords = function(newCoords) {

    this.destCoords = newCoords;
  };

  this.getDestCoords = function() {

    return this.destCoords;
  };

  this.addWayPoint = function(latLng) {

    this.wayPointObjects.push(new WayPointObject(latLng));
  };

  this.getWayPointObjects = function() {

    return this.wayPointObjects;
  };

  this.updateWayPoint = function(index, newCoords) {

    this.wayPointObjects[index].location = newCoords;
  };

  // for getting the plain latLngs inside the WayPointObjects
  // (needed for rendering markers on the map)
  this.getAllWayPointCoords = function() {

    return this.wayPointObjects.map(wpObj => {
      return wpObj.location;
    });
  };

  this.removeWayPoint = function(index) {

    this.wayPointObjects.splice(index, 1);
  };

  this._clearAllWayPoints = function() {

    this.wayPointObjects.length = 0;
  };

  this.clearPlannedTrip = function() {

    this.setDestCoords(null);
    this._clearAllWayPoints();
  };

  this.getTravelMode = function() {

    return this.travelMode;
  };

  this.setTravelMode = function(newMode) {

    this.travelMode = newMode;
  };

} // Cyclist