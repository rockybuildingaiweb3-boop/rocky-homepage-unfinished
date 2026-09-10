import { useEffect, useState } from 'react';
import { audioManager, AudioState } from './audioManager';

export function useBackgroundMusic() {
  const [state, setState] = useState<AudioState>(() => audioManager.getState());

  useEffect(() => {
    audioManager.init();
    return audioManager.subscribe(() => setState(audioManager.getState()));
  }, []);

  return {
    isMuted: state.isMuted,
    toggleMute: () => audioManager.toggleMute(),
  };
}
