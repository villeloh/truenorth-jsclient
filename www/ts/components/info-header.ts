import { override } from '../misc/annotations';
import UIElement from './base-abstract/ui-element';
import App from '../app';

/**
 * A header that shows info about the current route (atm, distance and travel time to destination).
 */
// NOTE: the logic of this component is very rigid atm. Make it more modular if possible.
export default class InfoHeader extends UIElement {

  private static readonly _DEFAULT_DIST = '0.0 km';
  private static readonly _DEFAULT_DURA = 'n/a';
  private static readonly _DEFAULT_UP_ELEV = '+ 0.0 m';
  private static readonly _DEFAULT_DOWN_ELEV = '- 0.0 m';
  
  private static readonly _OUTER_DIV_ID = 'info-header-outer';
  private static readonly _INNER_P_ID_LEFT = 'info-header-p-left';
  private static readonly _INNER_P_ID_RIGHT = 'info-header-p-right';
  private static readonly _INNER_P_ID_DIVISOR = 'info-header-p-divisor';

  // it's bad form to make ui components hold state, but it's better to put this here than to bloat App.ts with it.
  // there should be no problems since this part of the ui is never destroyed or recreated.
  private static showDistDura = true; // if it's false, we're showing upward and downward elevation totals instead

  /**
   * Static factory method that returns an HTMLDivElement.
   */
  @override
  static build(onClick: any): HTMLDivElement {

    const outerDiv: HTMLDivElement = document.createElement('div');
    outerDiv.id = InfoHeader._OUTER_DIV_ID;
    outerDiv.addEventListener('click', onClick); // i.e., the toggleDisplayState method
    outerDiv.addEventListener('touchend', function(e: any) {

      e.stopPropagation(); // to stop clicks from bubbling through to the underlying map (seems to work)
    })

    const p1: HTMLParagraphElement = document.createElement('p');
    p1.id = InfoHeader._INNER_P_ID_LEFT;
    p1.innerHTML = InfoHeader._DEFAULT_DIST;

    const p2: HTMLParagraphElement = document.createElement('p');
    p2.id = InfoHeader._INNER_P_ID_DIVISOR;
    p2.innerHTML = '&nbsp;|&nbsp;'; // add spaces on both sides

    const p3: HTMLParagraphElement = document.createElement('p');
    p3.id = InfoHeader._INNER_P_ID_RIGHT;
    p3.innerHTML = InfoHeader._DEFAULT_DURA;
    
    outerDiv.append(p1, p2, p3);
    return outerDiv;
  } // build

  /**
   * Toggles between displaying distance/duration and upward/downward elevation changes.
   */
  static toggleDisplayState() {

    InfoHeader.showDistDura = !InfoHeader.showDistDura;

    if (InfoHeader.showDistDura) {

      InfoHeader.updateDistance(App.state.tripDistance);
      InfoHeader.updateDuration(App.state.tripDuration);
    } else {
      InfoHeader.updateElevations(App.state.posTripElevs, App.state.negTripElevs);
    } 
  } // toggleDisplayState

  /**
   * Resets the info header to its default state.
   */
  static reset(): void {

    const innerDistP = document.getElementById(InfoHeader._INNER_P_ID_LEFT);
    const innerDuraP = document.getElementById(InfoHeader._INNER_P_ID_RIGHT);

    if (InfoHeader.showDistDura) {

      innerDistP!.textContent = InfoHeader._DEFAULT_DIST;
      innerDuraP!.textContent = InfoHeader._DEFAULT_DURA;
    } else {

      innerDistP!.textContent = InfoHeader._DEFAULT_UP_ELEV;
      innerDuraP!.textContent = InfoHeader._DEFAULT_DOWN_ELEV;
    }
  } // reset

  /**
   * Updates the distance value (in km) shown in the info header.
   */
  static updateDistance(value: number): void {

    if (!InfoHeader.showDistDura) return;

    const innerP = document.getElementById(InfoHeader._INNER_P_ID_LEFT);

    const distToDisplay = `${value} km`;
    innerP!.textContent = distToDisplay;
  }

  /**
   * Updates the duration value (in hours/minutes) shown in the info header.
   */
  static updateDuration(valueInDecimH: number): void {

    if (!InfoHeader.showDistDura) return;

    const innerP = document.getElementById(InfoHeader._INNER_P_ID_RIGHT);

    const text = InfoHeader._formatDuration(valueInDecimH);
    innerP!.textContent = text;
  } // updateDuration

  /**
   * Updates the up and down elevation totals (in meters) shown in the info header.
   */
  static updateElevations(upElev: number, downElev: number): void {

    if (InfoHeader.showDistDura) return;

    const leftP = document.getElementById(InfoHeader._INNER_P_ID_LEFT);
    const rightP = document.getElementById(InfoHeader._INNER_P_ID_RIGHT);

    leftP!.textContent = `+ ${upElev} m`;
    rightP!.textContent = `- ${downElev} m`;
  } // updateElevations

  // converts the duration to a more readable format (hours + minutes)
  private static _formatDuration(duraInDecimHours: number): string {

    // 0 is the only problematic value that could reach this point
    if (duraInDecimHours === 0) {

      return InfoHeader._DEFAULT_DURA; // arguably it's not 'formatting', but ehh, it's too convenient
    } else {
      
      const hours = Math.trunc(duraInDecimHours);
      const decimPart = duraInDecimHours - hours;
      const minutes = Math.round(decimPart * 60);
      return `${hours} h ${minutes} m`;
    }
  } // _formatDuration

} // InfoHeader