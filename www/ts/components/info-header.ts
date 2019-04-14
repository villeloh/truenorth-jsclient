import Utils from '../misc/utils';

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

  addTo: function(parentDiv: any) {

    const outerDiv = document.createElement('div');

    const p1 = document.createElement('p');
    p1.id = InfoHeader._INNER_P_ID_DIST;
    p1.innerHTML = InfoHeader._DEFAULT_DIST;

    const p2 = document.createElement('p');
    p2.id = InfoHeader._INNER_P_ID_DIVISOR;
    p2.innerHTML = '&nbsp;|&nbsp;';

    const p3 = document.createElement('p');
    p3.id = InfoHeader._INNER_P_ID_DURA;
    p3.innerHTML = InfoHeader._DEFAULT_DURA;
    
    outerDiv.append(p1, p2, p3);
    parentDiv.appendChild(outerDiv);
/*
    // &nbsp; = space... funny guy, whoever thought up html
    parentDiv.innerHTML = `<div id=${InfoHeader._OUTER_DIV_ID}>
      <p id=${InfoHeader._INNER_P_ID_DIST}>${InfoHeader._DEFAULT_DIST}</p>
      <p id=${InfoHeader._INNER_P_ID_DIVISOR}>&nbsp;|&nbsp;</p>
      <p id=${InfoHeader._INNER_P_ID_DURA}>${InfoHeader._DEFAULT_DURA}</p>
    <div>`; */
  },

  reset: function() {

    const innerDistP = document.getElementById(InfoHeader._INNER_P_ID_DIST);
    const innerDuraP = document.getElementById(InfoHeader._INNER_P_ID_DURA);
    innerDistP!.textContent = InfoHeader._DEFAULT_DIST;
    innerDuraP!.textContent = InfoHeader._DEFAULT_DURA;
  },

  updateDistance: function(value: number) {

    const innerP = document.getElementById(InfoHeader._INNER_P_ID_DIST);

    const distToDisplay = `${value} km`;
    innerP!.textContent = distToDisplay;
  },

  updateDuration: function(valueInDecimH: number) {

    const innerP = document.getElementById(InfoHeader._INNER_P_ID_DURA);

    // give it a fallback text to display if the value is invalid (not a number or less than 1)
    innerP!.textContent = Utils.formatDuration(valueInDecimH, InfoHeader._DEFAULT_DURA);
  }, // updateDuration

}; // InfoHeader

export default InfoHeader;