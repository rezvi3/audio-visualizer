import { VisualPreset } from '../types';
import { PALETTES } from './palettes';

export const DEFAULT_PRESETS: VisualPreset[] = [
  {
    id: 'neon-pulse',
    name: 'Neon Pulse',
    description: 'High-energy electric cyan & magenta oscilloscope with beat deformation',
    visualizer: 'oscilloscope',
    oscilloscopeConfig: {
      mode: 'classic',
      waveHeight: 1.8,
      thickness: 3.5,
      density: 2,
      fill: false,
      fillOpacity: 0.15,
      glowStrength: 0.85,
      radialRadius: 180,
      spiralTightness: 1.2,
      layers: [
        {
          id: 'l1',
          name: 'Main Waveform',
          enabled: true,
          type: 'waveform',
          color: '#00f0ff',
          thickness: 3.5,
          amplitude: 1.8,
          verticalOffset: 0,
          rotation: 0,
          opacity: 1
        },
        {
          id: 'l2',
          name: 'Bass Core',
          enabled: true,
          type: 'bass',
          color: '#ff007f',
          thickness: 2,
          amplitude: 1.2,
          verticalOffset: 0,
          rotation: 0,
          opacity: 0.75
        }
      ]
    },
    colors: PALETTES.neon,
    effects: {
      glow: 0.85,
      trail: 0.65,
      blur: 0,
      chromaticAberration: 0.4,
      distortion: 0.25,
      noise: 0.05,
      particles: true,
      particleCount: 150,
      symmetry: 1,
      rotationSpeed: 0,
      pulseIntensity: 1.2,
      cameraShake: true,
      transparentBg: false
    },
    reactivity: {
      smoothing: 0.75,
      sensitivity: 1.4,
      bassInfluence: 1.5,
      midInfluence: 1.0,
      trebleInfluence: 1.2,
      beatInfluence: 1.6,
      attack: 0.8,
      decay: 0.3
    }
  },
  {
    id: 'cyber-wave',
    name: 'Cyber Wave',
    description: 'Mirrored dual oscilloscope with cybernetic yellow and hot pink glow',
    visualizer: 'oscilloscope',
    oscilloscopeConfig: {
      mode: 'mirror',
      waveHeight: 2.2,
      thickness: 4.0,
      density: 2,
      fill: true,
      fillOpacity: 0.12,
      glowStrength: 0.9,
      radialRadius: 160,
      spiralTightness: 1.0,
      layers: [
        {
          id: 'l1',
          name: 'Symmetric Wave',
          enabled: true,
          type: 'waveform',
          color: '#fcee0a',
          thickness: 4.0,
          amplitude: 2.2,
          verticalOffset: 0,
          rotation: 0,
          opacity: 1.0
        }
      ]
    },
    colors: PALETTES.cyberpunk,
    effects: {
      glow: 0.9,
      trail: 0.7,
      blur: 0,
      chromaticAberration: 0.5,
      distortion: 0.3,
      noise: 0.08,
      particles: true,
      particleCount: 180,
      symmetry: 2,
      rotationSpeed: 0.1,
      pulseIntensity: 1.3,
      cameraShake: false,
      transparentBg: false
    },
    reactivity: {
      smoothing: 0.7,
      sensitivity: 1.5,
      bassInfluence: 1.8,
      midInfluence: 1.1,
      trebleInfluence: 1.3,
      beatInfluence: 1.5,
      attack: 0.85,
      decay: 0.35
    }
  },
  {
    id: 'electric-tunnel',
    name: 'Electric Tunnel',
    description: 'Hypnotic depth-projected oscilloscope waveform tunnel rushing towards the camera',
    visualizer: 'wave-tunnel',
    oscilloscopeConfig: {
      mode: 'tunnel',
      waveHeight: 1.6,
      thickness: 2.5,
      density: 2,
      fill: false,
      fillOpacity: 0.1,
      glowStrength: 0.8,
      radialRadius: 190,
      spiralTightness: 1.4,
      layers: []
    },
    colors: PALETTES.electric,
    effects: {
      glow: 0.8,
      trail: 0.8,
      blur: 0,
      chromaticAberration: 0.35,
      distortion: 0.2,
      noise: 0.04,
      particles: true,
      particleCount: 220,
      symmetry: 1,
      rotationSpeed: 0.3,
      pulseIntensity: 1.4,
      cameraShake: true,
      transparentBg: false
    },
    reactivity: {
      smoothing: 0.8,
      sensitivity: 1.3,
      bassInfluence: 1.6,
      midInfluence: 0.9,
      trebleInfluence: 1.0,
      beatInfluence: 1.8,
      attack: 0.75,
      decay: 0.25
    }
  },
  {
    id: 'synthwave-circle',
    name: 'Synthwave Circle',
    description: 'Retro 80s circular neon oscilloscope pulsing with heavy bass kicks',
    visualizer: 'circular-oscilloscope',
    oscilloscopeConfig: {
      mode: 'circular',
      waveHeight: 2.0,
      thickness: 3.5,
      density: 2,
      fill: true,
      fillOpacity: 0.18,
      glowStrength: 0.95,
      radialRadius: 200,
      spiralTightness: 1.0,
      layers: []
    },
    colors: PALETTES.synthwave,
    effects: {
      glow: 0.95,
      trail: 0.6,
      blur: 0,
      chromaticAberration: 0.3,
      distortion: 0.15,
      noise: 0.02,
      particles: true,
      particleCount: 160,
      symmetry: 1,
      rotationSpeed: 0.2,
      pulseIntensity: 1.5,
      cameraShake: true,
      transparentBg: false
    },
    reactivity: {
      smoothing: 0.72,
      sensitivity: 1.4,
      bassInfluence: 1.9,
      midInfluence: 1.2,
      trebleInfluence: 1.1,
      beatInfluence: 1.7,
      attack: 0.85,
      decay: 0.3
    }
  },
  {
    id: 'bass-reactor',
    name: 'Bass Reactor',
    description: 'Explosive radial starburst driven by heavy low-end sub frequencies',
    visualizer: 'radial',
    oscilloscopeConfig: {
      mode: 'radial',
      waveHeight: 2.8,
      thickness: 4.5,
      density: 2,
      fill: false,
      fillOpacity: 0.2,
      glowStrength: 1.0,
      radialRadius: 170,
      spiralTightness: 1.5,
      layers: []
    },
    colors: PALETTES.fire,
    effects: {
      glow: 1.0,
      trail: 0.75,
      blur: 0,
      chromaticAberration: 0.6,
      distortion: 0.4,
      noise: 0.08,
      particles: true,
      particleCount: 260,
      symmetry: 4,
      rotationSpeed: -0.15,
      pulseIntensity: 1.8,
      cameraShake: true,
      transparentBg: false
    },
    reactivity: {
      smoothing: 0.65,
      sensitivity: 1.8,
      bassInfluence: 2.5,
      midInfluence: 0.8,
      trebleInfluence: 0.8,
      beatInfluence: 2.0,
      attack: 0.95,
      decay: 0.4
    }
  },
  {
    id: 'digital-lissajous',
    name: 'Digital Lissajous',
    description: 'Phase-shifted XY harmonic figures oscillating in fluid multidimensional loops',
    visualizer: 'lissajous',
    oscilloscopeConfig: {
      mode: 'lissajous',
      waveHeight: 1.5,
      thickness: 2.8,
      density: 1,
      fill: false,
      fillOpacity: 0.1,
      glowStrength: 0.9,
      radialRadius: 180,
      spiralTightness: 1.0,
      layers: []
    },
    colors: PALETTES.aurora,
    effects: {
      glow: 0.9,
      trail: 0.85,
      blur: 0,
      chromaticAberration: 0.2,
      distortion: 0.1,
      noise: 0.02,
      particles: false,
      particleCount: 100,
      symmetry: 1,
      rotationSpeed: 0.4,
      pulseIntensity: 1.0,
      cameraShake: false,
      transparentBg: false
    },
    reactivity: {
      smoothing: 0.82,
      sensitivity: 1.2,
      bassInfluence: 1.2,
      midInfluence: 1.4,
      trebleInfluence: 1.5,
      beatInfluence: 1.1,
      attack: 0.7,
      decay: 0.2
    }
  },
  {
    id: 'particle-storm',
    name: 'Particle Storm',
    description: 'High-density quantum particle explosion swirling to frequency velocity',
    visualizer: 'particle-field',
    oscilloscopeConfig: {
      mode: 'classic',
      waveHeight: 1.0,
      thickness: 2.0,
      density: 2,
      fill: false,
      fillOpacity: 0.1,
      glowStrength: 0.8,
      radialRadius: 150,
      spiralTightness: 1.0,
      layers: []
    },
    colors: PALETTES.neon,
    effects: {
      glow: 0.8,
      trail: 0.7,
      blur: 0,
      chromaticAberration: 0.3,
      distortion: 0.2,
      noise: 0.05,
      particles: true,
      particleCount: 400,
      symmetry: 1,
      rotationSpeed: 0.25,
      pulseIntensity: 1.4,
      cameraShake: true,
      transparentBg: false
    },
    reactivity: {
      smoothing: 0.7,
      sensitivity: 1.6,
      bassInfluence: 1.8,
      midInfluence: 1.2,
      trebleInfluence: 1.5,
      beatInfluence: 1.9,
      attack: 0.8,
      decay: 0.35
    }
  },
  {
    id: 'spectrum-bars-pro',
    name: 'Master Spectrum',
    description: 'Studio mastering grade 64-band equalizer with peak decay and neon gradient',
    visualizer: 'spectrum-bars',
    oscilloscopeConfig: {
      mode: 'classic',
      waveHeight: 1.5,
      thickness: 4.0,
      density: 2,
      fill: true,
      fillOpacity: 0.4,
      glowStrength: 0.75,
      radialRadius: 150,
      spiralTightness: 1.0,
      layers: []
    },
    colors: PALETTES.acid,
    effects: {
      glow: 0.75,
      trail: 0.5,
      blur: 0,
      chromaticAberration: 0.1,
      distortion: 0.05,
      noise: 0.02,
      particles: true,
      particleCount: 120,
      symmetry: 1,
      rotationSpeed: 0,
      pulseIntensity: 1.1,
      cameraShake: false,
      transparentBg: false
    },
    reactivity: {
      smoothing: 0.6,
      sensitivity: 1.3,
      bassInfluence: 1.3,
      midInfluence: 1.2,
      trebleInfluence: 1.4,
      beatInfluence: 1.2,
      attack: 0.9,
      decay: 0.4
    }
  },
  {
    id: 'frequency-rings',
    name: 'Frequency Rings',
    description: 'Concentric audio rings vibrating at individual harmonic octaves',
    visualizer: 'frequency-rings',
    oscilloscopeConfig: {
      mode: 'circular',
      waveHeight: 1.8,
      thickness: 3.0,
      density: 2,
      fill: false,
      fillOpacity: 0.1,
      glowStrength: 0.85,
      radialRadius: 210,
      spiralTightness: 1.0,
      layers: []
    },
    colors: PALETTES.ice,
    effects: {
      glow: 0.85,
      trail: 0.65,
      blur: 0,
      chromaticAberration: 0.25,
      distortion: 0.1,
      noise: 0.03,
      particles: true,
      particleCount: 150,
      symmetry: 1,
      rotationSpeed: 0.1,
      pulseIntensity: 1.3,
      cameraShake: false,
      transparentBg: false
    },
    reactivity: {
      smoothing: 0.75,
      sensitivity: 1.4,
      bassInfluence: 1.7,
      midInfluence: 1.1,
      trebleInfluence: 1.2,
      beatInfluence: 1.4,
      attack: 0.8,
      decay: 0.3
    }
  },
  {
    id: 'reactive-grid',
    name: 'Synth Horizon Grid',
    description: 'Outrun 3D perspective terrain grid undulating with sound waves and bass kicks',
    visualizer: 'reactive-grid',
    oscilloscopeConfig: {
      mode: 'classic',
      waveHeight: 1.8,
      thickness: 2.0,
      density: 2,
      fill: true,
      fillOpacity: 0.2,
      glowStrength: 0.8,
      radialRadius: 150,
      spiralTightness: 1.0,
      layers: []
    },
    colors: PALETTES.synthwave,
    effects: {
      glow: 0.8,
      trail: 0.55,
      blur: 0,
      chromaticAberration: 0.3,
      distortion: 0.15,
      noise: 0.04,
      particles: true,
      particleCount: 140,
      symmetry: 1,
      rotationSpeed: 0,
      pulseIntensity: 1.3,
      cameraShake: true,
      transparentBg: false
    },
    reactivity: {
      smoothing: 0.7,
      sensitivity: 1.5,
      bassInfluence: 1.9,
      midInfluence: 1.1,
      trebleInfluence: 1.0,
      beatInfluence: 1.5,
      attack: 0.85,
      decay: 0.3
    }
  },
  {
    id: 'fluid-wave',
    name: 'Fluid Ribbon',
    description: 'Silky harmonic fluid field with continuous phase interference',
    visualizer: 'fluid-wave',
    oscilloscopeConfig: {
      mode: 'fluid',
      waveHeight: 2.0,
      thickness: 3.0,
      density: 2,
      fill: true,
      fillOpacity: 0.25,
      glowStrength: 0.9,
      radialRadius: 180,
      spiralTightness: 1.0,
      layers: []
    },
    colors: PALETTES.aurora,
    effects: {
      glow: 0.9,
      trail: 0.7,
      blur: 0,
      chromaticAberration: 0.2,
      distortion: 0.25,
      noise: 0.03,
      particles: true,
      particleCount: 120,
      symmetry: 1,
      rotationSpeed: 0.05,
      pulseIntensity: 1.2,
      cameraShake: false,
      transparentBg: false
    },
    reactivity: {
      smoothing: 0.85,
      sensitivity: 1.3,
      bassInfluence: 1.4,
      midInfluence: 1.5,
      trebleInfluence: 1.3,
      beatInfluence: 1.3,
      attack: 0.7,
      decay: 0.25
    }
  },
  {
    id: 'minimal-white',
    name: 'Studio Minimalist',
    description: 'Ultra-clean, crisp monochromatic line art suitable for sleek fashion and minimal techno',
    visualizer: 'oscilloscope',
    oscilloscopeConfig: {
      mode: 'classic',
      waveHeight: 1.6,
      thickness: 2.2,
      density: 1,
      fill: false,
      fillOpacity: 0.0,
      glowStrength: 0.3,
      radialRadius: 150,
      spiralTightness: 1.0,
      layers: [
        {
          id: 'l1',
          name: 'Primary Line',
          enabled: true,
          type: 'waveform',
          color: '#ffffff',
          thickness: 2.2,
          amplitude: 1.6,
          verticalOffset: 0,
          rotation: 0,
          opacity: 1
        }
      ]
    },
    colors: PALETTES.monochrome,
    effects: {
      glow: 0.3,
      trail: 0.4,
      blur: 0,
      chromaticAberration: 0.0,
      distortion: 0.0,
      noise: 0.0,
      particles: false,
      particleCount: 0,
      symmetry: 1,
      rotationSpeed: 0,
      pulseIntensity: 1.0,
      cameraShake: false,
      transparentBg: false
    },
    reactivity: {
      smoothing: 0.8,
      sensitivity: 1.1,
      bassInfluence: 1.2,
      midInfluence: 1.0,
      trebleInfluence: 1.0,
      beatInfluence: 1.0,
      attack: 0.8,
      decay: 0.3
    }
  }
];
