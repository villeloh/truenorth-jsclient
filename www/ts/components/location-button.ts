import App from '../app';

/**
 * For making the location button that re-centers the map on the user's current location.
 */

// for some reason, class-based components fail to attach the div elements to the DOM, so I'm
// sticking with objects for now.
const LocationButton = {

  _OUTER_DIV_ID: 'loc-btn-outer',
  _INNER_DIV_ID: 'loc-btn-inner',

  addTo: function(parentDiv: any) {

    const outerDiv = document.createElement('div');
    outerDiv.id = LocationButton._OUTER_DIV_ID;

    const innerDiv = document.createElement('div');
    innerDiv.id = LocationButton._INNER_DIV_ID;

    outerDiv.addEventListener('click', App.onLocButtonClick);
    
    outerDiv.appendChild(innerDiv);
    parentDiv.appendChild(outerDiv);
/*
    parentDiv.innerHTML = `<div id=${LocationButton._OUTER_DIV_ID} onclick="App.onLocButtonClick()">
    <div id=${LocationButton._INNER_DIV_ID}></div></div>`; */
  }
  
}; // LocationButton

export default LocationButton;