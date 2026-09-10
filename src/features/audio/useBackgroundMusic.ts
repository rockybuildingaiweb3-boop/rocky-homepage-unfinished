import { useState, useEffect, useCallback } from 'react';
import { audioManager, AudioState } from './audioManager';

export function useBackgroundMusic() {
  const [state, setState] = useState<AudioState>(() => audioManager.getState());

  useEffect(() => {
    audioManager.init();
    const unsubscribe = audioManager.subscribe(() => {
      setState(audioManager.getState());
    });
    return unsubscribe;
  }, []);

  const toggleMute = useCallback(() => {
    audioManager.toggleMute();
  }, []);

  const play = useCallback(() => {
    return audioManager.play();
  }, []);

  const pause = useCallback(() => {
    audioManager.pause();
  }, []);

  const mute = useCallback(() => {
    audioManager.mute();
  }, []);

  const unmute = useCallback(() => {
    return audioManager.unmute();
  }, []);

  return {
    isMuted: state.isMuted,
    isPlaying: state.isPlaying,
    toggleMute,
    play,
    pause,
    mute,
    unmute,
  };
}
