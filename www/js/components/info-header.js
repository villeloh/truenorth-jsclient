
/**
 * A header that shows info about the current route (atm, distance and travel time to destination).
 */

const InfoHeader = {

  DEFAULT_TEXT: '0.0 km | n/a',
  
  _OUTER_DIV_ID: 'info-header-outer',
  _INNER_P_ID: 'info-header-p',

  addTo: function(parentDiv) {

    parentDiv.innerHTML = `<div id=${InfoHeader._OUTER_DIV_ID}>
      <p id=${InfoHeader._INNER_P_ID}>${InfoHeader.DEFAULT_TEXT}</p>
    <div>`;
  },

  update: function(text) {

    const innerP = document.getElementById(InfoHeader._INNER_P_ID);
    innerP.textContent = text;
  },

  // the duration text is (usually...) pre-formatted by the Duration class
  formattedText: function(distanceInKm, durationText) {

    return `${distanceInKm.toFixed(1)} km | ${durationText}`;
  }

}; // InfoHeader