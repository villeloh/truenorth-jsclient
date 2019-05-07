import Utils from '../misc/utils';
import { override } from '../misc/annotations';
import UIElement from './base-abstract/ui-element';

/**
 * A header that shows info about the current route (atm, distance and travel time to destination).
 */

export default class InfoHeader extends UIElement {

  private static readonly _DEFAULT_DIST = '0.0 km';
  private static readonly _DEFAULT_DURA = 'n/a';
  
  private static readonly _OUTER_DIV_ID = 'info-header-outer';
  private static readonly _INNER_P_ID_DIST = 'info-header-p-dist';
  private static readonly _INNER_P_ID_DURA = 'info-header-p-dura';
  private static readonly _INNER_P_ID_DIVISOR = 'info-header-p-divisor';

  /**
   * Static factory method that returns an HTMLDivElement.
   */
  @override
  static build(): HTMLDivElement {

    const outerDiv: HTMLDivElement = document.createElement('div');
    outerDiv.id = InfoHeader._OUTER_DIV_ID;
    outerDiv.addEventListener('touchend', function(e: any) {

      e.stopPropagation(); // to stop clicks from bubbling through to the underlying map (seems to work)
    })

    const p1: HTMLParagraphElement = document.createElement('p');
    p1.id = InfoHeader._INNER_P_ID_DIST;
    p1.innerHTML = InfoHeader._DEFAULT_DIST;

    const p2: HTMLParagraphElement = document.createElement('p');
    p2.id = InfoHeader._INNER_P_ID_DIVISOR;
    p2.innerHTML = '&nbsp;|&nbsp;'; // add spaces on both sides

    const p3: HTMLParagraphElement = document.createElement('p');
    p3.id = InfoHeader._INNER_P_ID_DURA;
    p3.innerHTML = InfoHeader._DEFAULT_DURA;
    
    outerDiv.append(p1, p2, p3);
    return outerDiv;
  } // build

  /**
   * Resets the info header to its default state.
   */
  static reset(): void {

    const innerDistP = document.getElementById(InfoHeader._INNER_P_ID_DIST);
    const innerDuraP = document.getElementById(InfoHeader._INNER_P_ID_DURA);
    innerDistP!.textContent = InfoHeader._DEFAULT_DIST;
    innerDuraP!.textContent = InfoHeader._DEFAULT_DURA;
  }

  /**
   * Updates the distance value (in km) shown in the info header.
   */
  static updateDistance(value: number): void {

    const innerP = document.getElementById(InfoHeader._INNER_P_ID_DIST);

    const distToDisplay = `${value} km`;
    innerP!.textContent = distToDisplay;
  }

  /**
   * Updates the duration value (in hours/minutes) shown in the info header.
   */
  static updateDuration(valueInDecimH: number): void {

    const innerP = document.getElementById(InfoHeader._INNER_P_ID_DURA);

    const text = InfoHeader._formatDuration(valueInDecimH);
    innerP!.textContent = text;
  } // updateDuration

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