
/**
 * Menu button (switch) that toggles between cycling and walking mode for travel directions.
 * Useful when there's no cycling route available (e.g. when there's tunnels on the route).
 */

const WalkingCyclingToggleButton = {
  
  OUTER_DIV_ID: 'walk-cycle-btn-outer',
  SELECT_ID: 'walk-cycle-btn-select',

  CYCLING_ID: 'cycling',
  WALKING_ID: 'walking',

  addTo: function(parentDiv) {

    parentDiv.innerHTML = `<div id=${WalkingCyclingToggleButton.OUTER_DIV_ID}>
    <select id=${WalkingCyclingToggleButton.SELECT_ID} onchange="GoogleMap.onWalkingCyclingToggleButtonClick(event)">
      <option value=${WalkingCyclingToggleButton.CYCLING_ID}>cycle</option>
      <option value=${WalkingCyclingToggleButton.WALKING_ID}>walk</option>
    </select>
    </div>`;
  } // addTo
  
}; // WalkingCyclingToggleButton