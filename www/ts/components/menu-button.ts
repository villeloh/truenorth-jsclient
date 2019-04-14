
/**
 * Make the main right-hand corner menu button.
 */

const MenuButton = {

  CLOSED_SYMBOL: 'ˇ',
  OPEN_SYMBOL: '^',

  _OUTER_DIV_ID: 'menu-btn-outer',
  _INNER_DIV_ID: 'menu-btn-inner',

  addTo: function (parentDiv) {
    
    parentDiv.innerHTML += `<div id=${MenuButton._OUTER_DIV_ID} onclick="App.onMenuButtonClick(event)">
      <div id=${MenuButton._INNER_DIV_ID}>${MenuButton.CLOSED_SYMBOL}</div>
    </div>`;
  }

}; // MenuButton

export default MenuButton;