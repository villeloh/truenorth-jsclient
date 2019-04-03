/**
 * For making the location button that re-centers the map on the user's current location.
 */

// for some reason, class-based components fail to attach the div elements to the DOM, so I'm
// sticking with objects for now.
const LocationButton = {

  _OUTER_DIV_ID: 'loc-btn-outer',
  _INNER_DIV_ID: 'loc-btn-inner',

  addTo: function(parentDiv, mapService) {

    LocationButton.mapService = mapService;

    parentDiv.innerHTML = `<div id=${LocationButton._OUTER_DIV_ID} onclick="LocationButton.mapService.onLocButtonClick()">
    <div id=${LocationButton._INNER_DIV_ID}></div></div>`;
  }
  
}; // LocationButton