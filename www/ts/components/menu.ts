import UIBuilder from '../misc/ui-builder';
import { MapStyleToggleButton, CyclingLayerToggleButton, TravelModeToggleButton, SpeedInput, MenuButton } from '../components/components';

/**
 * Make the main right hand corner menu (containing the map type controls etc).
 */

export default class Menu {

  static readonly DIV_ID = 'menu';

  private static _isVisible = false;

  static build(): HTMLDivElement {

    const parentDiv = document.createElement('div');
    Menu._addMapStyleToggleButtons(parentDiv);
    Menu._addCyclingLayerToggleButton(parentDiv);
    Menu._addTravelModeToggleButton(parentDiv);
    Menu._addSpeedInput(parentDiv);
    return parentDiv;
  } // build

  // if called first, no extra holder div is needed
  private static _addMapStyleToggleButtons(parentDiv: any): void {
    
    const normBtn: HTMLDivElement = MapStyleToggleButton.build(MapStyleToggleButton.NORMAL_TXT);
    const satBtn: HTMLDivElement = MapStyleToggleButton.build(MapStyleToggleButton.SAT_TXT);
    const terrainBtn: HTMLDivElement = MapStyleToggleButton.build(MapStyleToggleButton.TERRAIN_TXT);
    parentDiv.append(normBtn, satBtn, terrainBtn);
  } // addMapStyleToggleButtons

  private static _addCyclingLayerToggleButton(parentDiv: any): void {
    
    const buttonHolderDiv: HTMLDivElement = document.createElement('div');
    buttonHolderDiv.style.marginTop = '20%'; // separate it from the other buttons

    const cyclingLayerBtn: HTMLDivElement = CyclingLayerToggleButton.build();
    buttonHolderDiv.appendChild(cyclingLayerBtn);
    parentDiv.appendChild(buttonHolderDiv);

    // this call is needed to 'remember' the state of the cycling layer button on each menu recreation...
    // not ideal and should be fixed; the menu's visibility should be altered instead of destroying or
    // recreating it with every click.
    setTimeout(() => { // wait for the DOM to update...
      
      CyclingLayerToggleButton.setInitialStyles(); 
    }, 50);
  } // _addCyclingLayerToggleButton

  private static _addTravelModeToggleButton(parentDiv: any): void {

    const buttonHolderDiv: HTMLDivElement = document.createElement('div'); 
    const toggleBtn: HTMLDivElement = TravelModeToggleButton.build();
    buttonHolderDiv.appendChild(toggleBtn);
    parentDiv.appendChild(buttonHolderDiv);
  }

  private static _addSpeedInput(parentDiv: any): void {

    const holderDiv: HTMLDivElement = document.createElement('div');
    const speedInput: HTMLInputElement = SpeedInput.build();
    holderDiv.appendChild(speedInput);
    parentDiv.appendChild(holderDiv);
  }

  // technically, this removes / recreates the menu with each click.
  // this is needed because zoom events 'reset' the map, which makes 
  // the menu become visible with each zoom if it's present in the DOM.
  static toggleVisibility(event: any): void {

    const menuBtnTextHolderDiv = event.target;

    if (Menu._isVisible) {

      Menu._isVisible = false;
      UIBuilder.removeElement(Menu.DIV_ID);
      menuBtnTextHolderDiv.textContent = MenuButton.CLOSED_SYMBOL;
      menuBtnTextHolderDiv.style.fontSize = '26px'; // the symbols for the open and closed menu are of different sizes in the same font, so the other one has to be made larger
    } else {

      Menu._isVisible = true;
      UIBuilder.addMenu();
      menuBtnTextHolderDiv.textContent = MenuButton.OPEN_SYMBOL;
      menuBtnTextHolderDiv.style.fontSize = '20px';
    } // if-else
  } // toggleVisibility

} // Menu