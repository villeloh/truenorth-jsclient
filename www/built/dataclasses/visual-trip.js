/**
 * A VisualTrip contains all the relevant info for displaying valid (already fetched) routes on the map.
 */
// trips always start from the current position, so it's not necessary to have a start field here
var VisualTrip = /** @class */ (function () {
    function VisualTrip(routeFetchResult, destCoords, wayPointCoordsArray, distance, duration) {
        // they're displayable quantities, only known after the route fetch completes, 
        // so it makes sense to have them here (rather than in PlannedTrip.js)
        this.distance = distance;
        this.duration = duration;
        this.fetchResult = routeFetchResult;
        this.destMarker = new Marker(null, destCoords, "", true);
        this.destMarker.addListener('dragend', App.onDestMarkerDragEnd);
        this.destMarker.addListener('click', App.onDestMarkerTap);
        this.wayPointMarkers = [];
        var labelNum = 1;
        var _loop_1 = function (i) {
            var marker = new Marker(null, wayPointCoordsArray[i], labelNum + "", true);
            labelNum++;
            marker.addListener('dragend', function (event) {
                event.wpIndex = i;
                App.onWayPointMarkerDragEnd(event);
            });
            marker.addListener('dblclick', function (event) {
                event.wpIndex = i;
                App.onWayPointDblClick(event);
            });
            this_1.wayPointMarkers.push(marker);
        };
        var this_1 = this;
        for (var i = 0; i < wayPointCoordsArray.length; i++) {
            _loop_1(i);
        } // for
    } // constructor
    VisualTrip.prototype.clear = function () {
        this.distance = null;
        this.duration = null;
        this.destMarker.clearFromMap();
        this.wayPointMarkers.map(function (marker) {
            marker.clearFromMap();
            return null;
        });
        this.wayPointMarkers.length = 0;
    }; // clear
    VisualTrip.prototype.displayOnMap = function (googleMap) {
        // show the polyline on the map
        App.mapService.routeRenderer.renderOnMap(this.fetchResult);
        // show the dest marker and waypoints
        this.destMarker.showOnMap(googleMap);
        this.wayPointMarkers.forEach(function (marker) {
            marker.showOnMap(googleMap);
        });
    };
    ; // displayOnMap
    Object.defineProperty(VisualTrip.prototype, "distance", {
        // to prevent infinite recursion when using get/set in classes, the underscore in property names is needed 
        // (it somehow automagically works under the hood). whoever designed this behaviour should be hung, drawn, and quartered! -.-
        get: function () {
            return this._distance;
        },
        set: function (value) {
            this._distance = value;
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(VisualTrip.prototype, "duration", {
        get: function () {
            return this._duration;
        },
        set: function (value) {
            this._duration = value;
        },
        enumerable: true,
        configurable: true
    });
    return VisualTrip;
}()); // VisualTrip
