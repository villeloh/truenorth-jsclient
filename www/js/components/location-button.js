/**
 * For making the location button that re-centers the map on the user's current location.
 */

 // extends UIButton
const LocationButton = {

  OUTER_DIV_ID: 'loc-btn-outer',
  INNER_DIV_ID: 'loc-btn-inner',

  addTo: function(parentDiv) {

    parentDiv.innerHTML = `<div id=${LocationButton.OUTER_DIV_ID} onclick="GoogleMap.onLocButtonClick()">
    <div id=${LocationButton.INNER_DIV_ID}></div></div>`;
  }
  
}; // LocationButton