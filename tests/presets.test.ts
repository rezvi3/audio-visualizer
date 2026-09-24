import { describe, it, expect } from 'vitest';
import { DEFAULT_PRESETS } from '../src/presets/defaultPresets';
import { PALETTES } from '../src/presets/palettes';
import { useVisualizerStore } from '../src/state/useVisualizerStore';

describe('Presets and Color Palettes', () => {
  it('contains at least 10 polished presets', () => {
    expect(DEFAULT_PRESETS.length).toBeGreaterThanOrEqual(10);
  });

  it('verifies all presets have valid colors and configuration', () => {
    for (const preset of DEFAULT_PRESETS) {
      expect(preset.id).toBeTruthy();
      expect(preset.name).toBeTruthy();
      expect(preset.colors).toBeDefined();
      expect(preset.colors.primary).toMatch(/^#[0-9a-fA-F]{6}$/);
      expect(preset.colors.background).toMatch(/^#[0-9a-fA-F]{6}$/);
      expect(preset.effects.glow).toBeGreaterThanOrEqual(0);
      expect(preset.reactivity.smoothing).toBeGreaterThan(0);
    }
  });

  it('provides all standard color palettes', () => {
    const requiredPalettes = ['neon', 'cyberpunk', 'synthwave', 'fire', 'ice', 'aurora', 'acid', 'monochrome', 'sunset', 'electric'];
    for (const id of requiredPalettes) {
      expect(PALETTES[id]).toBeDefined();
      expect(PALETTES[id].primary).toBeDefined();
    }
  });

  it('can load presets and randomize store values', () => {
    const store = useVisualizerStore.getState();
    expect(store.visualizer).toBeDefined();

    // Load second preset
    const targetPreset = DEFAULT_PRESETS[1];
    store.loadPreset(targetPreset.id);
    expect(useVisualizerStore.getState().activePresetId).toBe(targetPreset.id);
    expect(useVisualizerStore.getState().colors.id).toBe(targetPreset.colors.id);

    // Randomize
    store.randomize();
    const randomized = useVisualizerStore.getState();
    expect(randomized.colors).toBeDefined();
    expect(randomized.oscilloscopeConfig.waveHeight).toBeGreaterThan(0);
  });
});
