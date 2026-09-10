import { useState, useEffect, useCallback, useRef } from 'react';

const AUDIO_SRC = '/assets/audio/Clair_de_lune_(Claude_Debussy)_Suite_bergamasque.mp3';
const SESSION_MUTE_KEY = 'rb_music_muted';

// Module-level singleton instance ensures one Audio object across re-renders
let sharedAudio: HTMLAudioElement | null = null;
let hasInitialized = false;

function getSharedAudio(): HTMLAudioElement | null {
  if (typeof window === 'undefined') return null;
  if (!sharedAudio) {
    sharedAudio = new Audio(AUDIO_SRC);
    sharedAudio.loop = true;
    sharedAudio.volume = 0.35;
    sharedAudio.preload = 'auto';
  }
  return sharedAudio;
}

export function useBackgroundMusic() {
  const [isMuted, setIsMuted] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    try {
      return sessionStorage.getItem(SESSION_MUTE_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const isMutedRef = useRef(isMuted);
  isMutedRef.current = isMuted;

  // Initialize playback and user interaction unlock
  useEffect(() => {
    const audio = getSharedAudio();
    if (!audio || hasInitialized) return;
    hasInitialized = true;

    // Sync initial mute state
    audio.muted = isMutedRef.current;

    const updatePlaying = () => {
      setIsPlaying(!audio.paused && !audio.muted);
    };

    audio.addEventListener('play', updatePlaying);
    audio.addEventListener('pause', updatePlaying);
    audio.addEventListener('volumechange', updatePlaying);

    const tryPlay = () => {
      if (isMutedRef.current) return;
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => {
          // Autoplay policy prevented playback, wait for first user gesture
        });
    };

    // Attempt autoplay immediately
    tryPlay();

    // Attach unlock handlers for first interaction
    const unlockPlayback = () => {
      if (!isMutedRef.current && audio.paused) {
        audio
          .play()
          .then(() => setIsPlaying(true))
          .catch(() => {});
      }
      removeUnlockEvents();
    };

    const unlockEvents = ['pointerdown', 'click', 'keydown', 'touchstart'] as const;
    const removeUnlockEvents = () => {
      unlockEvents.forEach((ev) => {
        window.removeEventListener(ev, unlockPlayback);
      });
    };

    unlockEvents.forEach((ev) => {
      window.addEventListener(ev, unlockPlayback, { passive: true, once: true });
    });

    return () => {
      removeUnlockEvents();
      audio.removeEventListener('play', updatePlaying);
      audio.removeEventListener('pause', updatePlaying);
      audio.removeEventListener('volumechange', updatePlaying);
    };
  }, []);

  const toggleMute = useCallback(() => {
    const audio = getSharedAudio();
    if (!audio) return;

    const nextMuted = !isMutedRef.current;
    isMutedRef.current = nextMuted;
    setIsMuted(nextMuted);

    try {
      sessionStorage.setItem(SESSION_MUTE_KEY, nextMuted ? 'true' : 'false');
    } catch {
      // Ignore storage errors
    }

    if (nextMuted) {
      audio.muted = true;
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.muted = false;
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => {});
    }
  }, []);

  return {
    isMuted,
    isPlaying,
    toggleMute,
  };
}
