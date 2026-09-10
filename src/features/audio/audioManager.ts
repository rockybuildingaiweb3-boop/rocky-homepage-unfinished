/**
 * Global Background Audio Singleton Manager
 * 
 * Centralized, route-persistent HTML5 Audio controller:
 * - Exactly ONE HTMLAudioElement instance across the entire application lifecycle
 * - Survives route switches without restarts
 * - Manages autoplay policies and user interaction unlocking
 * - Session-persistent mute preferences
 */

const AUDIO_SRC = '/assets/audio/Clair_de_lune_(Claude_Debussy)_Suite_bergamasque.mp3';
const SESSION_MUTE_KEY = 'rb_music_muted';

export interface AudioState {
  isMuted: boolean;
  isPlaying: boolean;
}

class AudioManager {
  private audio: HTMLAudioElement | null = null;
  private isMuted: boolean = false;
  private isPlaying: boolean = false;
  private listeners: Set<() => void> = new Set();
  private hasInitialized: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        this.isMuted = sessionStorage.getItem(SESSION_MUTE_KEY) === 'true';
      } catch {
        this.isMuted = false;
      }
    }
  }

  private initAudio(): HTMLAudioElement | null {
    if (typeof window === 'undefined') return null;
    if (!this.audio) {
      this.audio = new Audio(AUDIO_SRC);
      this.audio.loop = true;
      this.audio.volume = 0.35;
      this.audio.preload = 'auto';
      this.audio.muted = this.isMuted;

      const updateState = () => {
        const nextPlaying = Boolean(this.audio && !this.audio.paused && !this.audio.muted);
        if (this.isPlaying !== nextPlaying) {
          this.isPlaying = nextPlaying;
          this.notify();
        }
      };

      this.audio.addEventListener('play', updateState);
      this.audio.addEventListener('pause', updateState);
      this.audio.addEventListener('volumechange', updateState);
    }
    return this.audio;
  }

  public init(): void {
    if (this.hasInitialized || typeof window === 'undefined') return;
    this.hasInitialized = true;

    const audio = this.initAudio();
    if (!audio) return;

    // Attempt initial playback if not muted
    if (!this.isMuted) {
      audio.play().then(() => {
        this.isPlaying = true;
        this.notify();
      }).catch(() => {
        // Autoplay policy prevented playback, wait for first user gesture
      });
    }

    // Attach user gesture unlock handlers
    const unlockPlayback = () => {
      if (!this.isMuted && audio.paused) {
        audio.play().then(() => {
          this.isPlaying = true;
          this.notify();
        }).catch(() => {});
      }
      removeUnlock();
    };

    const unlockEvents = ['pointerdown', 'click', 'keydown', 'touchstart'] as const;
    const removeUnlock = () => {
      unlockEvents.forEach((ev) => {
        window.removeEventListener(ev, unlockPlayback);
      });
    };

    unlockEvents.forEach((ev) => {
      window.addEventListener(ev, unlockPlayback, { passive: true, once: true });
    });
  }

  public play(): Promise<void> {
    const audio = this.initAudio();
    if (!audio) return Promise.resolve();
    this.isMuted = false;
    audio.muted = false;
    this.persistMute(false);
    return audio.play().then(() => {
      this.isPlaying = true;
      this.notify();
    });
  }

  public pause(): void {
    const audio = this.initAudio();
    if (audio) {
      audio.pause();
      this.isPlaying = false;
      this.notify();
    }
  }

  public mute(): void {
    const audio = this.initAudio();
    this.isMuted = true;
    this.persistMute(true);
    if (audio) {
      audio.muted = true;
      audio.pause();
    }
    this.isPlaying = false;
    this.notify();
  }

  public unmute(): Promise<void> {
    const audio = this.initAudio();
    this.isMuted = false;
    this.persistMute(false);
    if (audio) {
      audio.muted = false;
      return audio.play().then(() => {
        this.isPlaying = true;
        this.notify();
      }).catch(() => {});
    }
    return Promise.resolve();
  }

  public toggleMute(): void {
    if (this.isMuted) {
      this.unmute();
    } else {
      this.mute();
    }
  }

  public getState(): AudioState {
    return {
      isMuted: this.isMuted,
      isPlaying: this.isPlaying,
    };
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    this.listeners.forEach((l) => l());
  }

  private persistMute(muted: boolean): void {
    try {
      sessionStorage.setItem(SESSION_MUTE_KEY, muted ? 'true' : 'false');
    } catch {
      // Ignore storage errors
    }
  }
}

export const audioManager = new AudioManager();
