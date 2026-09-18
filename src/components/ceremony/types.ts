export type LoaderPhase =
  | 'INITIALIZING'
  | 'ATMOSPHERE'
  | 'SIGNING'
  | 'FLOWER_EMERGE'
  | 'IDENTITY_SETTLE'
  | 'READY'
  | 'EXITING'
  | 'COMPLETE';

export interface StrokeMeasurement {
  pathD: string;
  length: number;
  startDistance: number;
  endDistance: number;
  isWordBreak?: boolean;
}

export interface CeremonyTimelineConfig {
  initDuration: number;       // ms
  atmosphereDuration: number; // ms
  signingDuration: number;    // ms
  flowerDuration: number;     // ms
  identityDuration: number;   // ms
  readyDuration: number;      // ms
  exitDuration: number;       // ms
}
