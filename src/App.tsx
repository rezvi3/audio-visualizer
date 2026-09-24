import React, { useState, useEffect } from 'react';
import { Header } from './components/layout/Header';
import { VisualizerLibrary } from './components/library/VisualizerLibrary';
import { VisualizerCanvas } from './components/canvas/VisualizerCanvas';
import { ControlsInspector } from './components/controls/ControlsInspector';
import { PlaybackTimeline } from './components/player/PlaybackTimeline';
import { AudioDebugPanel } from './components/debug/AudioDebugPanel';
import { ExportModal } from './components/export/ExportModal';
import { ShowcasePage } from './components/showcase/ShowcasePage';

export const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<'showcase' | 'studio'>(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('mode') === 'studio' || window.location.hash === '#studio') {
        return 'studio';
      }
    }
    return 'showcase';
  });

  // Keep hash / history synchronized
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#studio') {
        setViewMode('studio');
      } else if (window.location.hash === '#showcase' || !window.location.hash) {
        // don't override internal anchor links like #diagram, #proof
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const openStudio = () => {
    setViewMode('studio');
    window.history.pushState(null, '', '#studio');
  };

  const openShowcase = () => {
    setViewMode('showcase');
    window.history.pushState(null, '', '#');
  };

  if (viewMode === 'showcase') {
    return <ShowcasePage onOpenStudio={openStudio} />;
  }

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-studio-950 text-slate-100 select-none">
      {/* 1. Top Navigation & Studio Bar */}
      <Header onBackToShowcase={openShowcase} />

      {/* 2. Main Creative Studio Workspace */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left: Visualizer & Oscilloscope Mode Library */}
        <VisualizerLibrary />

        {/* Center: Audio-Reactive Visualization Canvas */}
        <VisualizerCanvas />

        {/* Real-time Audio Diagnostics Floating Panel */}
        <AudioDebugPanel />

        {/* Right: Creative Parameter & Preset Inspector */}
        <ControlsInspector />
      </div>

      {/* 3. Bottom Playback & Waveform Timeline Transport */}
      <PlaybackTimeline />

      {/* 4. Video Export Dialog */}
      <ExportModal />
    </div>
  );
};

export default App;

