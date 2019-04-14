import App from '../app';

/**
 * Menu button (switch) that toggles between cycling and walking mode for travel directions.
 * Useful when there's no cycling route available (e.g. when there's tunnels on the route).
 */

const TravelModeToggleButton = {
  
  OUTER_DIV_ID: 'walk-cycle-btn-outer',
  SELECT_ID: 'walk-cycle-btn-select',

  addTo: function(parentDiv: any) {

    const outerDiv = document.createElement('div');
    outerDiv.id = TravelModeToggleButton.OUTER_DIV_ID;

    const select = document.createElement('select');
    select.id = TravelModeToggleButton.SELECT_ID;
    select.addEventListener('change', App.onTravelModeToggleButtonClick);

    const cycleOption = document.createElement('option');
    cycleOption.value = App.TravelMode.BICYCLING;
    const walkOption = document.createElement('option');
    walkOption.value = App.TravelMode.WALKING;
    
    select.appendChild(cycleOption);
    select.appendChild(walkOption);
    outerDiv.appendChild(select);
    parentDiv.appendChild(outerDiv);
/*
    parentDiv.innerHTML = `<div id=${TravelModeToggleButton.OUTER_DIV_ID}>
    <select id=${TravelModeToggleButton.SELECT_ID} onchange="App.onTravelModeToggleButtonClick(event)">
      <option value=${App.TravelMode.BICYCLING}>cycle</option>
      <option value=${App.TravelMode.WALKING}>walk</option>
    </select>
    </div>`; */
  } // addTo
  
}; // TravelModeToggleButton

export default TravelModeToggleButton;