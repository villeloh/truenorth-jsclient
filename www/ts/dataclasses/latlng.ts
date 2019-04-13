
/**
 * For emulating the Google Maps LatLng format, with added, useful methods.
 */

export default class LatLng {

  // immutable class; if a LatLng needs to be updated, it should be replaced with
  // a new instance.
  constructor(readonly lat: number, readonly lng: number) {

  }

  toString(): string {

    return `lat.: ${this.lat}, lng.: ${this.lng}`;
  }

  // used in GeoLocService for determining if the map should recenter when the user moves
  differenceFrom(anotherLatLng: LatLng): number {

    const absLatDiff: number = Math.abs(Math.abs(this.lat) - Math.abs(anotherLatLng.lat));
    const absLngDiff: number = Math.abs(Math.abs(this.lng) - Math.abs(anotherLatLng.lng));

    return Math.max(absLatDiff, absLngDiff);
  }

} // LatLng