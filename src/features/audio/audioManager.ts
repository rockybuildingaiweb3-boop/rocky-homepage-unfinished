const AUDIO_SRC = '/assets/audio/Clair_de_lune_(Claude_Debussy)_Suite_bergamasque.mp3';
const SESSION_MUTE_KEY = 'rb_music_muted';

type Listener = () => void;

class AudioManager {
  private audio: HTMLAudioElement | null = null;
  private muted = false;
  private initialized = false;
  private listeners = new Set<Listener>();

  constructor() {
    if (typeof window === 'undefined') return;
    try {
      this.muted = sessionStorage.getItem(SESSION_MUTE_KEY) === 'true';
    } catch {
      this.muted = false;
    }
  }

  private ensureAudio(): HTMLAudioElement | null {
    if (typeof window === 'undefined') return null;
    if (this.audio) return this.audio;

    this.audio = new Audio(AUDIO_SRC);
    this.audio.loop = true;
    this.audio.volume = 0.35;
    this.audio.preload = 'auto';
    this.audio.muted = this.muted;
    return this.audio;
  }

  init(): void {
    if (this.initialized || typeof window === 'undefined') return;
    this.initialized = true;

    const audio = this.ensureAudio();
    if (!audio || this.muted) return;

    audio.play().catch(() => {
      const unlock = () => {
        if (!this.muted) audio.play().catch(() => {});
        window.removeEventListener('pointerdown', unlock);
        window.removeEventListener('keydown', unlock);
      };
      window.addEventListener('pointerdown', unlock, { once: true, passive: true });
      window.addEventListener('keydown', unlock, { once: true, passive: true });
    });
  }

  toggleMute(): void {
    const audio = this.ensureAudio();
    this.muted = !this.muted;

    if (audio) {
      audio.muted = this.muted;
      if (this.muted) {
        audio.pause();
      } else {
        audio.play().catch(() => {});
      }
    }

    try {
      sessionStorage.setItem(SESSION_MUTE_KEY, String(this.muted));
    } catch {
      // Ignore storage errors.
    }

    this.listeners.forEach((listener) => listener());
  }

  getState() {
    return { isMuted: this.muted };
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
}

export const audioManager = new AudioManager();
export type AudioState = ReturnType<AudioManager['getState']>;
