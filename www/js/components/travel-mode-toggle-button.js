
/**
 * Menu button (switch) that toggles between cycling and walking mode for travel directions.
 * Useful when there's no cycling route available (e.g. when there's tunnels on the route).
 */

const TravelModeToggleButton = {
  
  OUTER_DIV_ID: 'walk-cycle-btn-outer',
  SELECT_ID: 'walk-cycle-btn-select',

  addTo: function(parentDiv, mapService) {

    TravelModeToggleButton.mapService = mapService;

    parentDiv.innerHTML = `<div id=${TravelModeToggleButton.OUTER_DIV_ID}>
    <select id=${TravelModeToggleButton.SELECT_ID} onchange="TravelModeToggleButton.mapService.onTravelModeToggleButtonClick(event)">
      <option value=${PlannedTrip.CYCLE_MODE}>cycle</option>
      <option value=${PlannedTrip.WALK_MODE}>walk</option>
    </select>
    </div>`;
  } // addTo
  
}; // TravelModeToggleButton