
/**
 * A simple input box for giving the estimated (average) cycling speed.
 * May change it to a slider for the final version.
 */

const SpeedInput = {

  DIV_ID: 'speed-input', // named DIV_ID for consistency with other similar-purpose IDs

  make: function(parentDiv) {

    const input = document.createElement('input');
    input.type = 'number';
    input.id = SpeedInput.DIV_ID;
    input.defaultValue = Distance.DEFAULT_SPEED;
    input.value = Distance.DEFAULT_SPEED;
    input.min = Distance.MIN_SPEED;
    input.max = Distance.MAX_SPEED;
    input.step = 1;

    input.style.marginTop = '20%';
    input.style.height = '30px';
    input.style.width = '70px';

    input.addEventListener('input', function(e) {

      GoogleMap.onSpeedInputValueChange(e);
    });

    parentDiv.appendChild(input);
  } // make

}; // SpeedInput