
/**
 * Menu button (switch) that toggles between cycling and walking mode for travel directions.
 * Useful when there's no cycling route available (e.g. when there's tunnels on the route).
 */

 // does not extend UIButton because it's a dropdown... should not have called it a 'button', perhaps.
const WalkingCyclingToggleButton = {

  CYCLING_ID: 'cycling',
  WALKING_ID: 'walking',

  make: function(parentDiv) {

    const outerButtonDiv = document.createElement('div');
    outerButtonDiv.style.display = 'flex';
    outerButtonDiv.style.marginTop = '20%';

    const select = document.createElement('select');
    select.style.height = '30px';
    select.style.width = '70px';
    select.style.display = 'block';

    const cycling = document.createElement('option');
    const walking = document.createElement('option');
    cycling.value = WalkingCyclingToggleButton.CYCLING_ID;
    walking.value = WalkingCyclingToggleButton.WALKING_ID;
    cycling.innerHTML = 'cycle';
    walking.innerHTML = 'walk';

    select.appendChild(cycling);
    select.appendChild(walking);

    select.addEventListener('change', function(e) {

      GoogleMap.onWalkingCyclingToggleButtonClick(e);
    });

    outerButtonDiv.appendChild(select);
    parentDiv.appendChild(outerButtonDiv);
  } // make
  
}; // WalkingCyclingToggleButton