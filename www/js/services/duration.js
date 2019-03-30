
/**
 * The existence of this 'class' is up for questioning. May delete it and move its functionalities elsewhere.
 */

const Duration = {

  calc: function(distance, speed) {

    let duraInDecimHours;

    if (Utils.isValidSpeed(speed)) {

      duraInDecimHours = distance / speed;
    } else {

      duraInDecimHours = 0;
    }
    return duraInDecimHours;
  }, // calc

  // convert the duration to a more readable format (hours + minutes)
  format: function(duraInDecimHours) {

    let text;

    // all invalid speed values should lead to 0 here
    if (duraInDecimHours === 0) {

      text = InfoHeader.DEFAULT_DURA;
    } else {
      
      const hours = Math.trunc(duraInDecimHours);
      const decimPart = duraInDecimHours - hours;
      const minutes = Math.round(decimPart * 60);
      text = `${hours} h ${minutes} m`;
    }
    return text;
  } // format

}; // Duration