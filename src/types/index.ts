/** Geographic coordinate in WGS84 decimal degrees */
export type Lat = number;
export type Lng = number;

export interface GeoCoordinate {
  lat: Lat;
  lng: Lng;
}

/** Standard moon phase identifiers aligned with astronomical naming */
export type MoonPhaseName =
  | 'new_moon'
  | 'waxing_crescent'
  | 'first_quarter'
  | 'waxing_gibbous'
  | 'full_moon'
  | 'waning_gibbous'
  | 'last_quarter'
  | 'waning_crescent';

export interface MoonPhaseData {
  phase: MoonPhaseName;
  illumination: number;
  ageDays: number;
  observedAt: string;
  coordinate: GeoCoordinate;
  distance?: number;
}

export interface MapClickPayload {
  coordinate: GeoCoordinate;
  timestamp: string;
}

export interface MoonDetailData {
  phase: MoonPhaseName;
  phaseLabel: string;
  illumination: number; // 0-1
  distance: number; // km
  azimuth: number; // degrees
  elevation: number; // degrees
  moonrise: Date | null;
  moonset: Date | null;
  ageDays: number;
  observedAt: Date;
  coordinate: GeoCoordinate;
}

export interface TimelinePoint {
  label: string;
  time: Date;
  type: 'rise' | 'set' | 'transit';
  progress: number; // 0-1 representing position in the day
}
