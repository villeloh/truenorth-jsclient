
/**
 * A header that shows info about the current route (atm, distance and travel time to destination).
 */

const InfoHeader = {

  _DEFAULT_DIST: '0.0 km',
  _DEFAULT_DURA: 'n/a',
  
  _OUTER_DIV_ID: 'info-header-outer',
  _INNER_P_ID_DIST: 'info-header-p-dist',
  _INNER_P_ID_DURA: 'info-header-p-dura',
  _INNER_P_ID_DIVISOR: 'info-header-p-divisor',

  addTo: function(parentDiv) {

    // &nbsp; = space... funny guy, whoever thought up html
    parentDiv.innerHTML = `<div id=${InfoHeader._OUTER_DIV_ID}>
      <p id=${InfoHeader._INNER_P_ID_DIST}>${InfoHeader._DEFAULT_DIST}</p>
      <p id=${InfoHeader._INNER_P_ID_DIVISOR}>&nbsp;|&nbsp;</p>
      <p id=${InfoHeader._INNER_P_ID_DURA}>${InfoHeader._DEFAULT_DURA}</p>
    <div>`;
  },

  reset: function() {

    const innerDistP = document.getElementById(InfoHeader._INNER_P_ID_DIST);
    const innerDuraP = document.getElementById(InfoHeader._INNER_P_ID_DURA);
    innerDistP.textContent = InfoHeader._DEFAULT_DIST;
    innerDuraP.textContent = InfoHeader._DEFAULT_DURA;
  },

  updateDistance: function(value) {

    const innerP = document.getElementById(InfoHeader._INNER_P_ID_DIST);

    const distToDisplay = `${value} km`;
    innerP.textContent = distToDisplay;
  },

  updateDuration: function(valueInDecimH) {

    const innerP = document.getElementById(InfoHeader._INNER_P_ID_DURA);

    // give it a fallback text to display if the value is invalid (not a number or less than 1)
    innerP.textContent = Utils.formatDuration(valueInDecimH, InfoHeader._DEFAULT_DURA);
  }, // updateDuration

}; // InfoHeader

export default InfoHeader;