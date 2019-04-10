/**
 * 'Class' that encapsulates the user's own position.
 */
// NOTE: only one should ever exist, and it's to be updated, not replaced;
// so I guess it could be an object/singleton, or a class with static methods.
// TODO: update to class that takes a map argument
var Position = /** @class */ (function () {
    function Position(latLng, googleMap) {
        this.googleMap = googleMap;
        this.coords = latLng;
        this.marker = new App.google.maps.Marker({
            position: latLng,
            map: googleMap,
            draggable: false,
            icon: Position._POS_MARKER_URL
        });
    }
    // GeoLoc calls this (via _plannedTrip, which contains the position object)
    Position.prototype.update = function (newCoords) {
        this.coords = newCoords;
        this.marker.setMap(null); // to clear the old marker from the map
        // it needs to be recreated due to not being rendered if just moving it...
        // not sure what's wrong there tbh.
        this.marker = new App.google.maps.Marker({
            position: newCoords,
            map: this.googleMap,
            draggable: false,
            icon: Position._POS_MARKER_URL
        });
    }; // update
    Position._POS_MARKER_URL = 'http://maps.google.com/mapfiles/kml/shapes/placemark_circle_highlight.png';
    return Position;
}()); // Position
