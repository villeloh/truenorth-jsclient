import App from '../app';

/**
 * Menu button (switch) that toggles between cycling and walking mode for travel directions.
 * Useful when there's no cycling route available (e.g. when there's tunnels on the route).
 */

const TravelModeToggleButton = {
  
  OUTER_DIV_ID: 'walk-cycle-btn-outer',
  SELECT_ID: 'walk-cycle-btn-select',

  CYCLE_TEXT: "cycle",
  WALK_TEXT: "walk",

  addTo: function(parentDiv: any) {

    const pickedOption = App.travelMode;
    let unpickedOption: any;
    let pickedText: string;
    let unpickedText: string;

    // ugly af, but i can't think of another easy way to do this
    if (pickedOption === App.TravelMode.BICYCLING) {

      unpickedOption = App.TravelMode.WALKING;
      pickedText = TravelModeToggleButton.CYCLE_TEXT;
      unpickedText = TravelModeToggleButton.WALK_TEXT;
    } else {

      unpickedOption = App.TravelMode.BICYCLING;
      pickedText = TravelModeToggleButton.WALK_TEXT;
      unpickedText = TravelModeToggleButton.CYCLE_TEXT;
    }

    const outerDiv = document.createElement('div');
    outerDiv.id = TravelModeToggleButton.OUTER_DIV_ID;

    const select = document.createElement('select');
    select.id = TravelModeToggleButton.SELECT_ID;
    select.addEventListener('change', App.onTravelModeToggleButtonClick);

    const firstOption = document.createElement('option');
    firstOption.innerHTML = pickedText;
    firstOption.value = pickedOption;
    
    const secondOption = document.createElement('option');
    secondOption.innerHTML = unpickedText;
    secondOption.value = unpickedOption;
    
    select.appendChild(firstOption);
    select.appendChild(secondOption);
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