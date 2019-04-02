
/**
 * Menu button (switch) that toggles between cycling and walking mode for travel directions.
 * Useful when there's no cycling route available (e.g. when there's tunnels on the route).
 */

const WalkingCyclingToggleButton = {
  
  OUTER_DIV_ID: 'walk-cycle-btn-outer',
  SELECT_ID: 'walk-cycle-btn-select',

  addTo: function(parentDiv) {

    parentDiv.innerHTML = `<div id=${WalkingCyclingToggleButton.OUTER_DIV_ID}>
    <select id=${WalkingCyclingToggleButton.SELECT_ID} onchange="GoogleMap.onWalkingCyclingToggleButtonClick(event)">
      <option value=${Route.constants.CYCLE_MODE}>cycle</option>
      <option value=${Route.constants.WALK_MODE}>walk</option>
    </select>
    </div>`;
  } // addTo
  
}; // WalkingCyclingToggleButton