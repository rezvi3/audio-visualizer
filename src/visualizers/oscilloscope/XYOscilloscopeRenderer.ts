import { IVisualizerRenderer, RenderContext } from '../../rendering/types';
import { XYOscilloscopeConfig, XYLayerConfig, AudioAnalysis } from '../../types';

interface XYParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

export class XYOscilloscopeRenderer implements IVisualizerRenderer {
  // Pre-allocated typed arrays to prevent GC allocation in 60fps render loop
  private readonly maxPoints = 2048;
  private ptsX = new Float32Array(this.maxPoints);
  private ptsY = new Float32Array(this.maxPoints);
  private ptsV = new Float32Array(this.maxPoints); // instantaneous velocity

  // Dynamic phase & animation state
  private phaseX = 0;
  private phaseY = 0;
  private autoRotation = 0;
  private beatRotation = 0;
  private morphRatio = 1.0;
  private targetRatio = 1.0;

  // Particle emission pool
  private particles: XYParticle[] = [];
  private readonly maxParticles = 300;

  constructor() {
    for (let i = 0; i < this.maxParticles; i++) {
      this.particles.push({
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        life: 0,
        maxLife: 60,
        color: '#00f0ff',
        size: 2
      });
    }
  }

  public render(rc: RenderContext): void {
    const { ctx, width, height, analysis, colors, effects, reactivity, time, deltaTime } = rc;
    // Extract XY config from visualizer store via renderContext or fallback defaults
    const xyConfig = (rc as any).xyConfig as XYOscilloscopeConfig || this.getDefaultXYConfig();

    const {
      sourceMode,
      beamStyle,
      freqRatioX,
      freqRatioY,
      reactiveFrequencyRatio,
      phaseSpeed,
      reactivePhase,
      ampX,
      ampY,
      overallScale,
      thickness,
      reactiveLineWidth,
      velocityModulation,
      distortionType,
      distortionAmount,
      polarMode,
      polarRings,
      symmetry,
      glowIntensity,
      glowRadius,
      gradientAlongCurve,
      gradientStartColor,
      gradientMidColor,
      gradientEndColor,
      particleEmission,
      zoom,
      panX,
      panY,
      rotation,
      rotationSpeed,
      beatRotationImpulse,
      layers,
      generativeMode,
      generativeMorphSpeed
    } = xyConfig;

    const { waveform, waveformLeft, waveformRight, bass, mid, treble, beat, beatStrength } = analysis;

    // 1. Dynamic Phase & Ratio Updates
    const pSpeed = phaseSpeed !== undefined ? phaseSpeed : 0.4;
    const pAdvance = deltaTime * pSpeed + (reactivePhase ? bass * deltaTime * 3.0 : 0);
    this.phaseX = (this.phaseX + pAdvance) % (Math.PI * 2);
    this.phaseY = (this.phaseY + pAdvance * (freqRatioY / Math.max(0.1, freqRatioX))) % (Math.PI * 2);

    // Continuous ratio morphing
    if (reactiveFrequencyRatio) {
      this.targetRatio = 1.0 + Math.floor(bass * 4) * 0.5;
    } else {
      this.targetRatio = freqRatioY / Math.max(0.1, freqRatioX);
    }
    this.morphRatio += (this.targetRatio - this.morphRatio) * Math.min(1.0, deltaTime * 2.5);

    // Rotation updates
    this.autoRotation += deltaTime * (rotationSpeed || 0.1);
    if (beatRotationImpulse && beat && beatStrength > 0.3) {
      this.beatRotation += beatStrength * 0.15;
    }
    this.beatRotation *= 0.94; // smooth decay

    const totalRotation = ((rotation || 0) * Math.PI) / 180 + this.autoRotation + this.beatRotation;

    // View Center & Scale
    const cx = width / 2 + (panX || 0);
    const cy = height / 2 + (panY || 0);
    const baseRadius = Math.min(width, height) * 0.38 * (overallScale || 1.0) * (zoom || 1.0);
    const pulseFactor = 1.0 + (beat ? beatStrength * 0.25 * effects.pulseIntensity : 0);

    // 2. Trajectory Points Generation
    const numPoints = Math.min(this.maxPoints, 900);
    const waveL = waveformLeft || waveform;
    const waveR = waveformRight || waveform;
    const waveLen = waveL.length;

    let prevX = 0;
    let prevY = 0;

    for (let i = 0; i < numPoints; i++) {
      const t = i / numPoints;
      const angle = t * Math.PI * 2;
      let rawX = 0;
      let rawY = 0;

      // Sample based on Source Mode
      switch (sourceMode) {
        case 'stereo': {
          const sIdx = Math.min(waveLen - 1, Math.floor(t * waveLen));
          rawX = waveL[sIdx] * 1.5;
          rawY = waveR[sIdx] * 1.5;
          break;
        }
        case 'left': {
          const sIdx1 = Math.min(waveLen - 1, Math.floor(t * waveLen));
          const sIdx2 = (sIdx1 + Math.floor(waveLen * 0.25)) % waveLen;
          rawX = waveL[sIdx1];
          rawY = waveL[sIdx2];
          break;
        }
        case 'right': {
          const sIdx1 = Math.min(waveLen - 1, Math.floor(t * waveLen));
          const sIdx2 = (sIdx1 + Math.floor(waveLen * 0.25)) % waveLen;
          rawX = waveR[sIdx1];
          rawY = waveR[sIdx2];
          break;
        }
        case 'mono': {
          const sIdx = Math.min(waveform.length - 1, Math.floor(t * waveform.length));
          const sIdxLag = (sIdx + Math.floor(waveform.length * 0.25)) % waveform.length;
          rawX = waveform[sIdx];
          rawY = waveform[sIdxLag];
          break;
        }
        case 'bass-treble': {
          const sIdx = Math.min(waveform.length - 1, Math.floor(t * waveform.length));
          rawX = Math.sin(angle + this.phaseX) * (0.6 + bass * 0.9) + waveform[sIdx] * 0.4;
          rawY = Math.cos(angle * 2 + this.phaseY) * (0.6 + treble * 1.2) + waveform[(sIdx + 64) % waveform.length] * 0.4;
          break;
        }
        case 'mid-high': {
          const sIdx = Math.min(waveform.length - 1, Math.floor(t * waveform.length));
          rawX = Math.sin(angle * 2 + this.phaseX) * (0.7 + mid * 0.8) + waveform[sIdx] * 0.3;
          rawY = Math.cos(angle * 3 + this.phaseY) * (0.7 + treble * 0.8) + waveform[(sIdx + 128) % waveform.length] * 0.3;
          break;
        }
        case 'bass-mid': {
          const sIdx = Math.min(waveform.length - 1, Math.floor(t * waveform.length));
          rawX = Math.sin(angle + this.phaseX) * (0.7 + bass * 1.0) + waveform[sIdx] * 0.3;
          rawY = Math.sin(angle * 3 + this.phaseY) * (0.7 + mid * 1.0) + waveform[(sIdx + 80) % waveform.length] * 0.3;
          break;
        }
        case 'synthesized':
        default: {
          // Pure Parametric Lissajous driven & modulated by audio waveform
          const sIdx = Math.min(waveform.length - 1, Math.floor(t * waveform.length));
          const audioDisplacement = waveform[sIdx] * 0.35 * (1 + bass * 0.6);
          const ratioY = this.morphRatio;

          rawX = Math.sin(angle * (freqRatioX || 1) + this.phaseX) + audioDisplacement;
          rawY = Math.sin(angle * ratioY + this.phaseY) + audioDisplacement * 0.8;
          break;
        }
      }

      // Apply Amplitude and Scaling
      let px = rawX * (ampX || 1.0) * baseRadius * pulseFactor;
      let py = rawY * (ampY || 1.0) * baseRadius * pulseFactor;

      // 3. Distortion Pipeline
      if (distortionType && distortionType !== 'none') {
        const dAmt = (distortionAmount || 0.2) * (1.0 + mid * 1.5);
        if (distortionType === 'radial') {
          const r = Math.sqrt(px * px + py * py);
          const disp = Math.sin(r * 0.05 - this.phaseX * 2) * dAmt * 40;
          const theta = Math.atan2(py, px);
          px += Math.cos(theta) * disp;
          py += Math.sin(theta) * disp;
        } else if (distortionType === 'wave') {
          px += Math.sin(py * 0.03 + this.phaseX) * dAmt * 30;
          py += Math.cos(px * 0.03 + this.phaseY) * dAmt * 30;
        } else if (distortionType === 'noise') {
          const n = Math.sin(i * 12.9898 + t * 78.233) * 43758.5453;
          const noiseVal = (n - Math.floor(n)) * 2 - 1;
          px += noiseVal * dAmt * 20 * (1 + treble);
          py += noiseVal * dAmt * 20 * (1 + treble);
        } else if (distortionType === 'frequency') {
          const binIdx = Math.floor(t * analysis.frequencyDataNormalized.length);
          const freqMag = analysis.frequencyDataNormalized[binIdx] || 0;
          px *= 1.0 + freqMag * dAmt * 0.8;
          py *= 1.0 + freqMag * dAmt * 0.8;
        }
      }

      // 4. Optional Polar Transformation
      if (polarMode) {
        const rings = polarRings || 1;
        const normR = Math.sqrt(px * px + py * py) / Math.max(1, baseRadius);
        const normAngle = Math.atan2(py, px) * rings + angle;
        px = Math.cos(normAngle) * (baseRadius * 0.5 + normR * baseRadius * 0.5);
        py = Math.sin(normAngle) * (baseRadius * 0.5 + normR * baseRadius * 0.5);
      }

      // Store in pre-allocated buffers
      this.ptsX[i] = px;
      this.ptsY[i] = py;

      // Calculate instantaneous velocity
      if (i > 0) {
        const dx = px - prevX;
        const dy = py - prevY;
        this.ptsV[i] = Math.sqrt(dx * dx + dy * dy);
      } else {
        this.ptsV[i] = 0;
      }
      prevX = px;
      prevY = py;
    }

    // 5. Render Trajectory with Symmetry & Beam Styles
    ctx.save();
    ctx.translate(cx, cy);
    if (totalRotation !== 0) {
      ctx.rotate(totalRotation);
    }

    // Line thickness calculation
    let currentThickness = thickness || 3.0;
    if (reactiveLineWidth) {
      currentThickness += bass * 4.0 + (beat ? beatStrength * 3.0 : 0);
    }

    // Setup Glow
    const glowAmt = (glowIntensity !== undefined ? glowIntensity : 1.0) * effects.glow;
    const gRadius = glowRadius || 25;
    if (glowAmt > 0.05) {
      ctx.shadowBlur = glowAmt * gRadius;
      ctx.shadowColor = colors.glow || colors.primary;
    } else {
      ctx.shadowBlur = 0;
    }

    // Symmetry Render Loop
    const symCount = Math.max(1, symmetry || 1);
    const symAngle = (Math.PI * 2) / symCount;

    for (let s = 0; s < symCount; s++) {
      ctx.save();
      if (s > 0) {
        ctx.rotate(s * symAngle);
        if (s % 2 === 1 && xyConfig.kaleidoscope) {
          ctx.scale(1, -1); // mirror reflection
        }
      }

      this.renderBeamTrajectory(
        ctx,
        numPoints,
        currentThickness,
        beamStyle || 'neon',
        gradientAlongCurve,
        colors,
        gradientStartColor,
        gradientMidColor,
        gradientEndColor,
        velocityModulation,
        baseRadius
      );

      ctx.restore();
    }

    ctx.restore();

    // 6. Particle Emission along trajectory
    if (particleEmission || effects.particles) {
      this.renderParticles(ctx, cx, cy, totalRotation, numPoints, bass, treble, beat, beatStrength, colors, deltaTime);
    }

    // 7. Multi-Layer XY Curves
    if (layers && layers.length > 0) {
      for (const layer of layers) {
        if (layer.enabled) {
          this.renderLayer(rc, layer, cx, cy, baseRadius, pulseFactor, totalRotation);
        }
      }
    }
  }

  // Beam Trajectory Path Rendering
  private renderBeamTrajectory(
    ctx: CanvasRenderingContext2D,
    numPoints: number,
    baseThickness: number,
    style: string,
    useGradient: boolean,
    colors: any,
    gradStart?: string,
    gradMid?: string,
    gradEnd?: string,
    velocityMod?: boolean,
    baseRadius?: number
  ) {
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // MULTI-LINE STYLE
    if (style === 'multiline') {
      const offsets = [-4, 0, 4];
      offsets.forEach((off, idx) => {
        ctx.lineWidth = Math.max(1, baseThickness * (idx === 1 ? 1.0 : 0.5));
        ctx.strokeStyle = idx === 1 ? colors.primary : colors.secondary;
        ctx.beginPath();
        for (let i = 0; i < numPoints; i++) {
          const x = this.ptsX[i] + off;
          const y = this.ptsY[i] + off;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      });
      return;
    }

    // GRADIENT ALONG CURVE STYLE
    if (useGradient || style === 'gradient') {
      const gStart = gradStart || colors.primary || '#00f0ff';
      const gMid = gradMid || colors.accent || '#a855f7';
      const gEnd = gradEnd || colors.secondary || '#ff007f';

      // Render in smooth segmented gradient arcs
      const segments = 16;
      const ptsPerSeg = Math.floor(numPoints / segments);

      for (let seg = 0; seg < segments; seg++) {
        const segT = seg / segments;
        ctx.strokeStyle = segT < 0.5 ? this.lerpColor(gStart, gMid, segT * 2) : this.lerpColor(gMid, gEnd, (segT - 0.5) * 2);
        ctx.lineWidth = baseThickness;
        ctx.beginPath();

        const startIdx = seg * ptsPerSeg;
        const endIdx = Math.min(numPoints - 1, startIdx + ptsPerSeg + 1);

        for (let i = startIdx; i <= endIdx; i++) {
          if (i === startIdx) ctx.moveTo(this.ptsX[i], this.ptsY[i]);
          else ctx.lineTo(this.ptsX[i], this.ptsY[i]);
        }
        ctx.stroke();
      }
      return;
    }

    // NEON MULTI-PASS CORE + BLOOM STYLE
    if (style === 'neon') {
      // Pass 1: Luminous soft outer halo
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      ctx.lineWidth = baseThickness * 3.0;
      ctx.strokeStyle = colors.secondary || '#ff007f';
      ctx.globalAlpha = 0.35;
      ctx.beginPath();
      for (let i = 0; i < numPoints; i++) {
        if (i === 0) ctx.moveTo(this.ptsX[i], this.ptsY[i]);
        else ctx.lineTo(this.ptsX[i], this.ptsY[i]);
      }
      ctx.stroke();

      // Pass 2: Vibrant primary glow beam
      ctx.lineWidth = baseThickness * 1.5;
      ctx.strokeStyle = colors.primary || '#00f0ff';
      ctx.globalAlpha = 0.85;
      ctx.stroke();

      // Pass 3: Ultra-hot white electron core
      ctx.lineWidth = Math.max(1, baseThickness * 0.45);
      ctx.strokeStyle = '#ffffff';
      ctx.globalAlpha = 1.0;
      ctx.stroke();
      ctx.restore();
      return;
    }

    // SOLID / SOFT STANDARD BEAM
    ctx.lineWidth = baseThickness;
    ctx.strokeStyle = colors.primary;
    ctx.beginPath();
    for (let i = 0; i < numPoints; i++) {
      if (i === 0) ctx.moveTo(this.ptsX[i], this.ptsY[i]);
      else ctx.lineTo(this.ptsX[i], this.ptsY[i]);
    }
    ctx.stroke();
  }

  // Trajectory Particle Emission
  private renderParticles(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    rot: number,
    numPoints: number,
    bass: number,
    treble: number,
    beat: boolean,
    beatStrength: number,
    colors: any,
    deltaTime: number
  ) {
    ctx.save();
    ctx.translate(cx, cy);
    if (rot !== 0) ctx.rotate(rot);

    // Spawn new particles along path
    const spawnCount = beat ? 8 : 2;
    for (let s = 0; s < spawnCount; s++) {
      const idx = Math.floor(Math.random() * numPoints);
      const px = this.ptsX[idx];
      const py = this.ptsY[idx];
      const p = this.particles.find((item) => item.life <= 0);

      if (p) {
        p.x = px;
        p.y = py;
        const angle = Math.random() * Math.PI * 2;
        const spd = (0.5 + Math.random() * 2.0) * (1 + bass * 2.5);
        p.vx = Math.cos(angle) * spd;
        p.vy = Math.sin(angle) * spd;
        p.life = 1;
        p.maxLife = 30 + Math.random() * 40;
        p.color = Math.random() > 0.4 ? colors.primary : colors.accent;
        p.size = 1.5 + Math.random() * 2.5 * (1 + beatStrength);
      }
    }

    // Update and draw alive particles
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      if (p.life > 0) {
        p.life += deltaTime * 50;
        p.x += p.vx;
        p.y += p.vy;

        const progress = p.life / p.maxLife;
        if (progress >= 1.0) {
          p.life = 0;
          continue;
        }

        ctx.fillStyle = p.color;
        ctx.globalAlpha = (1.0 - progress) * 0.8;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.restore();
  }

  // Multi-Layer Custom Sub-Curve
  private renderLayer(
    rc: RenderContext,
    layer: XYLayerConfig,
    cx: number,
    cy: number,
    baseRadius: number,
    pulseFactor: number,
    totalRotation: number
  ) {
    const { ctx, analysis } = rc;
    const { waveform, bass, mid, treble } = analysis;
    const numPoints = 400;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(totalRotation + (layer.rotation || 0));

    ctx.lineWidth = layer.thickness || 2;
    ctx.strokeStyle = layer.color;
    ctx.globalAlpha = layer.opacity || 0.7;

    const r = baseRadius * (layer.scale || 1.0) * pulseFactor;
    const pOffset = layer.phaseOffset || 0;
    const fx = layer.freqRatioX || 1;
    const fy = layer.freqRatioY || 2;

    ctx.beginPath();
    for (let i = 0; i < numPoints; i++) {
      const t = i / numPoints;
      const angle = t * Math.PI * 2;
      const sIdx = Math.floor(t * waveform.length);
      const audioDisp = waveform[sIdx] * 0.25 * (1 + bass * 0.8);

      const x = (Math.sin(angle * fx + this.phaseX + pOffset) + audioDisp) * r;
      const y = (Math.sin(angle * fy + this.phaseY + pOffset) + audioDisp) * r;

      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.restore();
  }

  // Color interpolation helper
  private lerpColor(c1: string, c2: string, t: number): string {
    const clampedT = Math.max(0, Math.min(1, t));
    const r1 = parseInt(c1.substring(1, 3), 16) || 0;
    const g1 = parseInt(c1.substring(3, 5), 16) || 0;
    const b1 = parseInt(c1.substring(5, 7), 16) || 0;

    const r2 = parseInt(c2.substring(1, 3), 16) || 255;
    const g2 = parseInt(c2.substring(3, 5), 16) || 255;
    const b2 = parseInt(c2.substring(5, 7), 16) || 255;

    const r = Math.round(r1 + (r2 - r1) * clampedT);
    const g = Math.round(g1 + (g2 - g1) * clampedT);
    const b = Math.round(b1 + (b2 - b1) * clampedT);

    return `rgb(${r},${g},${b})`;
  }

  private getDefaultXYConfig(): XYOscilloscopeConfig {
    return {
      sourceMode: 'stereo',
      beamStyle: 'neon',
      freqRatioX: 1,
      freqRatioY: 2,
      ratioPreset: '1:2',
      reactiveFrequencyRatio: true,
      phaseX: 0,
      phaseY: 0,
      phaseSpeed: 0.5,
      reactivePhase: true,
      ampX: 1.0,
      ampY: 1.0,
      overallScale: 1.0,
      thickness: 3.5,
      reactiveLineWidth: true,
      velocityModulation: true,
      distortionType: 'none',
      distortionAmount: 0.2,
      polarMode: false,
      polarRings: 1,
      symmetry: 1,
      kaleidoscope: false,
      glowIntensity: 1.2,
      glowRadius: 28,
      trailPersistence: 0.75,
      beamDecay: 0.8,
      gradientAlongCurve: true,
      gradientStartColor: '#00f0ff',
      gradientMidColor: '#a855f7',
      gradientEndColor: '#ff007f',
      particleEmission: true,
      particleRate: 60,
      zoom: 1.0,
      panX: 0,
      panY: 0,
      rotation: 0,
      rotationSpeed: 0.1,
      beatRotationImpulse: true,
      layers: [],
      generativeMode: false,
      generativeMorphSpeed: 0.5
    };
  }
}
