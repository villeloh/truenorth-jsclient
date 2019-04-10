/**
 * A convenience wrapper for the GoogleMaps Marker element.
 * I put this in dataclasses for now; it's a bit of a hybrid between a visual element and a dataclass.
 */
var Marker = /** @class */ (function () {
    function Marker(googleMap, position, label, isDraggable) {
        this.position = position;
        this.googleMap = googleMap;
        this.label = label;
        this.isDraggable = isDraggable;
        this.googleMapMarker = new App.google.maps.Marker({
            position: position,
            map: googleMap,
            draggable: isDraggable,
            label: label,
            crossOnDrag: false
        });
    } // constructor
    // takes a string and a function, like the underlying 
    // addListener method that it 'overrides'
    Marker.prototype.addListener = function (eventName, callback) {
        this.googleMapMarker.addListener(eventName, callback);
    };
    Marker.prototype.clearFromMap = function () {
        this.googleMapMarker.setMap(null);
        App.google.maps.event.clearInstanceListeners(this.googleMapMarker);
        this.googleMapMarker = null;
    };
    Marker.prototype.showOnMap = function (googleMap) {
        this.googleMapMarker.setMap(googleMap);
    };
    return Marker;
}()); // Marker
