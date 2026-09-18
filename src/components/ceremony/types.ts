export type LoaderPhase =
  | 'VOID'
  | 'AWAKENING'
  | 'EMERGENCE'
  | 'SIGNING'
  | 'SUSPENSE'
  | 'CLIMAX'
  | 'ARRIVAL'
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
  voidDuration: number;       // ms (Act I)
  awakeningDuration: number;  // ms (Act II)
  emergenceDuration: number;  // ms (Act III)
  signingDuration: number;    // ms (Act IV)
  suspenseDuration: number;   // ms (Act V Silence)
  climaxDuration: number;     // ms (Act V Climax)
  arrivalDuration: number;    // ms (Act VI Lockup)
  exitDuration: number;       // ms (Act VI Transition)
}
