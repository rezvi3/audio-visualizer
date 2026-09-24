import { IVisualizerRenderer, RenderContext } from '../../rendering/types';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  baseSize: number;
  alpha: number;
  hueOffset: number;
  life: number;
  maxLife: number;
}

export class ParticleFieldRenderer implements IVisualizerRenderer {
  private particles: Particle[] = [];
  private readonly maxParticles = 350;

  constructor() {
    this.initParticles(800, 600);
  }

  private initParticles(w: number, h: number) {
    this.particles = [];
    const cx = w / 2;
    const cy = h / 2;

    for (let i = 0; i < this.maxParticles; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.5 + Math.random() * 2.5;
      const dist = Math.random() * (Math.min(w, h) * 0.4);

      this.particles.push({
        x: cx + Math.cos(angle) * dist,
        y: cy + Math.sin(angle) * dist,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 1.5 + Math.random() * 2.5,
        baseSize: 1.5 + Math.random() * 2.5,
        alpha: 0.3 + Math.random() * 0.7,
        hueOffset: Math.random(),
        life: Math.random() * 100,
        maxLife: 80 + Math.random() * 120
      });
    }
  }

  public render(rc: RenderContext): void {
    const { ctx, width, height, analysis, colors, effects, deltaTime } = rc;
    const { bass, treble, beat, beatStrength } = analysis;

    const cx = width / 2;
    const cy = height / 2;
    const count = Math.min(this.particles.length, effects.particleCount || 200);

    // Beat shockwave impulse
    const speedMultiplier = 1.0 + bass * 2.5 + (beat ? beatStrength * 4.0 : 0);

    ctx.save();
    if (effects.glow > 0.05) {
      ctx.shadowBlur = effects.glow * 15;
      ctx.shadowColor = colors.glow || colors.primary;
    }

    for (let i = 0; i < count; i++) {
      const p = this.particles[i];
      p.life += deltaTime * 20;

      // Update position
      p.x += p.vx * speedMultiplier;
      p.y += p.vy * speedMultiplier;

      // Subtle gravitational swirl
      const dx = p.x - cx;
      const dy = p.y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      p.vx += (-dy / (dist + 10)) * 0.03 * (1 + treble);
      p.vy += (dx / (dist + 10)) * 0.03 * (1 + treble);

      // Audio-reactive size
      p.size = p.baseSize * (1 + bass * 1.5 + (beat ? beatStrength * 2.0 : 0));

      // Reset when out of screen or lifetime expired
      if (p.life > p.maxLife || p.x < 0 || p.x > width || p.y < 0 || p.y > height) {
        p.life = 0;
        const angle = Math.random() * Math.PI * 2;
        const startDist = 15 + Math.random() * 50;
        p.x = cx + Math.cos(angle) * startDist;
        p.y = cy + Math.sin(angle) * startDist;
        const spd = 0.8 + Math.random() * 2.5;
        p.vx = Math.cos(angle) * spd;
        p.vy = Math.sin(angle) * spd;
      }

      // Draw particle
      ctx.fillStyle = p.hueOffset > 0.5 ? colors.primary : colors.secondary;
      ctx.globalAlpha = p.alpha * (1 - p.life / p.maxLife);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();

      // Connect nearby particles with subtle light web lines
      if (i % 4 === 0) {
        for (let j = i + 1; j < Math.min(count, i + 8); j++) {
          const p2 = this.particles[j];
          const distSq = (p.x - p2.x) ** 2 + (p.y - p2.y) ** 2;
          if (distSq < 3600) { // ~60px
            ctx.lineWidth = 0.75;
            ctx.strokeStyle = colors.accent || colors.primary;
            ctx.globalAlpha = (1 - distSq / 3600) * 0.25;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }
    }

    ctx.restore();
  }
}
