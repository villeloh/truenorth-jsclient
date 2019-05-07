import UIBuilder from '../misc/ui-builder';
import { MapStyleToggleButton, CyclingLayerToggleButton, TravelModeToggleButton, SpeedChooser, MenuButton } from '../components/components';
import App from '../app';
import UIElement from './base-abstract/ui-element';
import { override } from '../misc/annotations';

/**
 * The right-hand corner menu (containing the map type controls, etc).
 */

// NOTE: technically, in order to decouple things, Menu should be handed the million different callbacks;
// but the UI of the app is unlikely to change and the time resources are far better spent elsewhere.
export default class Menu extends UIElement {

  static readonly DIV_ID = 'menu';

  private static _isVisible = false;

  /**
   * Static factory method that returns an HTMLDivElement.
   */
  @override
  static build(): HTMLDivElement {

    const parentDiv = document.createElement('div');
    Menu._addMapStyleToggleButtons(parentDiv);
    Menu._addCyclingLayerToggleButton(parentDiv);
    Menu._addTravelModeToggleButton(parentDiv);
    Menu._addSpeedChooser(parentDiv);
    parentDiv.addEventListener('touchend', function(e: any) {

      e.stopPropagation(); // to stop clicks from bubbling through to the underlying map (seems to work)
    })
    return parentDiv;
  } // build

  // if called first, no extra holder div is needed
  private static _addMapStyleToggleButtons(parentDiv: any): void {
    
    const normBtn: HTMLDivElement = MapStyleToggleButton.build(App.onMapStyleToggleButtonClick, MapStyleToggleButton.NORMAL_TXT);
    const satBtn: HTMLDivElement = MapStyleToggleButton.build(App.onMapStyleToggleButtonClick, MapStyleToggleButton.SAT_TXT);
    const terrainBtn: HTMLDivElement = MapStyleToggleButton.build(App.onMapStyleToggleButtonClick, MapStyleToggleButton.TERRAIN_TXT);
    parentDiv.append(normBtn, satBtn, terrainBtn);
  } // addMapStyleToggleButtons

  private static _addCyclingLayerToggleButton(parentDiv: any): void {
    
    const buttonHolderDiv: HTMLDivElement = document.createElement('div');
    buttonHolderDiv.style.marginTop = '20%'; // separate it from the other buttons

    const cyclingLayerBtn: HTMLDivElement = CyclingLayerToggleButton.build(App.onCyclingLayerToggleButtonClick);
    buttonHolderDiv.appendChild(cyclingLayerBtn);
    parentDiv.appendChild(buttonHolderDiv);

    // this call is needed to 'remember' the state of the cycling layer button on each menu recreation...
    // not ideal and should be fixed.
    setTimeout(() => { // wait for the DOM to update...
      
      CyclingLayerToggleButton.setInitialStyles(App.mapService.bikeLayerOn); // strong coupling, but to avoid it would be too convoluted
    }, 50);
  } // _addCyclingLayerToggleButton

  private static _addTravelModeToggleButton(parentDiv: any): void {

    const buttonHolderDiv: HTMLDivElement = document.createElement('div'); 
    const toggleBtn: HTMLDivElement = TravelModeToggleButton.build(App.onTravelModeToggleButtonClick);
    buttonHolderDiv.appendChild(toggleBtn);
    parentDiv.appendChild(buttonHolderDiv);
  }

  private static _addSpeedChooser(parentDiv: any): void {

    const speedChooser: HTMLDivElement = SpeedChooser.build(App.onSpeedChooserValueChange);
    parentDiv.appendChild(speedChooser);
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