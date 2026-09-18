export type LoaderPhase =
  | 'VOID'
  | 'AWAKENING'
  | 'EMERGENCE'
  | 'SIGNING'
  | 'CONVERGENCE'
  | 'CLIMAX'
  | 'SILENCE'
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
  voidDuration: number;        // ms (Act I: Void)
  awakeningDuration: number;   // ms (Act II: Awakening light)
  emergenceDuration: number;   // ms (Act III: Rose emergence)
  signingDuration: number;     // ms (Act IV: Signature)
  convergenceDuration: number; // ms (Act V: Energy convergence)
  climaxDuration: number;      // ms (Act V: Resonant climax)
  silenceDuration: number;     // ms (Act V: Breathless silence)
  arrivalDuration: number;     // ms (Act VI: Arrival lockup)
  exitDuration: number;        // ms (Act VII: Hero transition)
}
