
/**
 * For emulating the Google Maps LatLng format, with added, useful methods.
 */

export default class LatLng {

  // immutable class; if a LatLng needs to be updated, it should be replaced with
  // a new instance.
  constructor(readonly lat: number, readonly lng: number) {

    this.lat = lat;
    this.lng = lng;
  }

  toString() {

    return `lat.: ${this.lat}, lng.: ${this.lng}`;
  }

  // used in GeoLocService for determining if the map should recenter when the user moves
  differenceFrom(anotherLatLng: LatLng) {

    const absLatDiff = Math.abs(Math.abs(this.lat) - Math.abs(anotherLatLng.lat));
    const absLngDiff = Math.abs(Math.abs(this.lng) - Math.abs(anotherLatLng.lng));

    return Math.max(absLatDiff, absLngDiff);
  }

} // LatLng