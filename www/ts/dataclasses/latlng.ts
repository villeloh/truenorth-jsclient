import { Nullable } from '../misc/types';

/**
 * For emulating the Google Maps LatLng format, with added, useful methods.
 */

 // NOTE: ideally, we'd *extend* the google map LatLng type, rather than *replace* it.
 // However, that is impossible atm because the google object that's needed for it
 // is not yet initialized during the class definition.
export default class LatLng {

  // immutable class; if a LatLng needs to be updated, it should be replaced with a new instance.
  constructor(readonly lat: number, readonly lng: number) {
  }

  toString(): string {

    return `lat.: ${this.lat}, lng.: ${this.lng}`;
  }

  /**
  * Returns the absolute max difference (between lats or lngs) of two LatLng objects.
  */
  // Used in GeoLocService for determining if the map should recenter when the user moves. 
  differenceFrom(anotherLatLng: LatLng): number {

    const absLatDiff: number = Math.abs(Math.abs(this.lat) - Math.abs(anotherLatLng.lat));
    const absLngDiff: number = Math.abs(Math.abs(this.lng) - Math.abs(anotherLatLng.lng));

    return Math.max(absLatDiff, absLngDiff);
  }

} // LatLng