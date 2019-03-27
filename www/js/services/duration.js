
/**
 * Although very simple, conceptually this 'class' is a 'service' as well, so I'm putting it in the services folder.
 */

const Duration = {

  _NA_TEXT: 'n/a',

  calc: function(distance, speed) {

    let duraInDecimHours;

    if (Utils.isValidSpeed(speed)) {

      duraInDecimHours = distance / speed;
    } else {

      duraInDecimHours = 0;
    }
    return Duration._format(duraInDecimHours);
  }, // calc

  // convert the duration to a more readable format (hours + minutes)
  _format: function(duraInDecimHours) {

    let text;

    // all invalid speed values should lead to 0 here
    if (duraInDecimHours === 0) {
      text = Duration._NA_TEXT;
    } else {
      
      const hours = Math.trunc(duraInDecimHours);
      const decimPart = duraInDecimHours - hours;
      const minutes = Math.round(decimPart * 60);
      text = `${hours} h ${minutes} m`;
    }
    return text;
  } // _format

}; // Duration