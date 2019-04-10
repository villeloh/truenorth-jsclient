/**
 * Menu button (switch) that toggles between cycling and walking mode for travel directions.
 * Useful when there's no cycling route available (e.g. when there's tunnels on the route).
 */
var TravelModeToggleButton = {
    OUTER_DIV_ID: 'walk-cycle-btn-outer',
    SELECT_ID: 'walk-cycle-btn-select',
    addTo: function (parentDiv) {
        parentDiv.innerHTML = "<div id=" + TravelModeToggleButton.OUTER_DIV_ID + ">\n    <select id=" + TravelModeToggleButton.SELECT_ID + " onchange=\"App.onTravelModeToggleButtonClick(event)\">\n      <option value=" + PlannedTrip.CYCLE_MODE + ">cycle</option>\n      <option value=" + PlannedTrip.WALK_MODE + ">walk</option>\n    </select>\n    </div>";
    } // addTo
}; // TravelModeToggleButton
