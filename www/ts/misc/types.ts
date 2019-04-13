
/**
 * For defining custom / shorthand types that are useful throughout the app.
 */

// with this, anything can be made nullable
export type Nullable<T> = T | null;

// it's used all over, so this is convenient
export type GoogleMap = google.maps.Map;