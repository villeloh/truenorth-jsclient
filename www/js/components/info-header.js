
/**
 * A header that shows info about the current route (atm, distance and travel time to destination).
 */

const InfoHeader = {

  DEFAULT_DIST: '0.0 km',
  DEFAULT_DURA: 'n/a',
  
  _OUTER_DIV_ID: 'info-header-outer',
  _INNER_P_ID_DIST: 'info-header-p-dist',
  _INNER_P_ID_DURA: 'info-header-p-dura',
  _INNER_P_ID_DIVISOR: 'info-header-p-divisor',

  addTo: function(parentDiv) {

    // &nbsp; = space... funny guy, whoever thought up html
    parentDiv.innerHTML = `<div id=${InfoHeader._OUTER_DIV_ID}>
      <p id=${InfoHeader._INNER_P_ID_DIST}>${InfoHeader.DEFAULT_DIST}</p>
      <p id=${InfoHeader._INNER_P_ID_DIVISOR}>&nbsp;|&nbsp;</p>
      <p id=${InfoHeader._INNER_P_ID_DURA}>${InfoHeader.DEFAULT_DURA}</p>
    <div>`;
  },

  update: function(text) {

    const innerP = document.getElementById(InfoHeader._INNER_P_ID);
    innerP.textContent = text;
  },

  updateDistance: function() {

    const innerP = document.getElementById(InfoHeader._INNER_P_ID_DIST);

    const distToDisplay = `${Route.currentDist} km`;
    innerP.textContent = distToDisplay;
  },

  updateDuration: function() {

    const innerP = document.getElementById(InfoHeader._INNER_P_ID_DURA);

    innerP.textContent = Utils.formatDuration(Route.currentDura);
  }, // updateDuration

}; // InfoHeader