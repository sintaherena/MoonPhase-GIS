declare module 'suncalc3' {
  interface MoonPosition {
    azimuth: number;
    altitude: number;
    azimuthDegrees: number;
    altitudeDegrees: number;
    distance: number;
    parallacticAngle: number;
    parallacticAngleDegrees: number;
  }

  interface MoonIlluminationPhase {
    from: number;
    to: number;
    id: string;
    emoji: string;
    code: string;
    name: string;
    weight: number;
    css: string;
  }

  interface MoonIllumination {
    fraction: number;
    phase: MoonIlluminationPhase;
    phaseValue: number;
    angle: number;
    next: {
      value: number;
      date: string;
      type: string;
      newMoon: { value: number; date: string };
      fullMoon: { value: number; date: string };
      firstQuarter: { value: number; date: string };
      thirdQuarter: { value: number; date: string };
    };
  }

  interface MoonTimes {
    rise: Date | null;
    set: Date | null;
    alwaysUp: boolean;
    alwaysDown: boolean;
    highest: Date | null;
  }

  interface MoonData {
    illumination: number;
    zenithAngle: number;
    azimuth: number;
    altitude: number;
    azimuthDegrees: number;
    altitudeDegrees: number;
    distance: number;
    parallacticAngle: number;
    parallacticAngleDegrees: number;
  }

  export function getMoonPosition(date: Date, lat: number, lng: number): MoonPosition;
  export function getMoonIllumination(date: Date): MoonIllumination;
  export function getMoonTimes(date: Date, lat: number, lng: number): MoonTimes;
  export function getMoonData(date: Date, lat: number, lng: number): MoonData;
}
