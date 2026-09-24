import { create } from 'zustand';
import { AudioTrackInfo } from '../types';

interface AudioState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isLooping: boolean;
  trackInfo: AudioTrackInfo | null;
  audioSourceType: 'demo' | 'file' | 'mic';
  isLoading: boolean;
  error: string | null;

  // Actions
  setIsPlaying: (isPlaying: boolean) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  setIsLooping: (isLooping: boolean) => void;
  setTrackInfo: (trackInfo: AudioTrackInfo | null) => void;
  setAudioSourceType: (type: 'demo' | 'file' | 'mic') => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useAudioStore = create<AudioState>((set) => ({
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 0.85,
  isMuted: false,
  isLooping: true,
  trackInfo: null,
  audioSourceType: 'demo',
  isLoading: false,
  error: null,

  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setCurrentTime: (currentTime) => set({ currentTime }),
  setDuration: (duration) => set({ duration }),
  setVolume: (volume) => set({ volume }),
  toggleMute: () => set((s) => ({ isMuted: !s.isMuted })),
  setIsLooping: (isLooping) => set({ isLooping }),
  setTrackInfo: (trackInfo) => set({ trackInfo }),
  setAudioSourceType: (audioSourceType) => set({ audioSourceType }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
