/**
 * A button to clear the map with. Ideally, a double-click would be used to clear the map, and single clicks
 * for adding waypoints. However, accidental touches are a serious issue when using the app on cycling trips.
 * So for now, this button clears the map and double clicks add waypoints.
 */
var ClearButton = {
    _OUTER_DIV_ID: 'clear-btn-outer',
    _INNER_DIV_ID: 'clear-btn-inner',
    _TEXT: 'CLEAR',
    addTo: function (parentDiv) {
        parentDiv.innerHTML = "<div id=" + ClearButton._OUTER_DIV_ID + " onclick=\"App.onClearButtonClick()\">\n      <div id=" + ClearButton._INNER_DIV_ID + ">" + ClearButton._TEXT + "</div>\n    </div>";
    }
}; // ClearButton
