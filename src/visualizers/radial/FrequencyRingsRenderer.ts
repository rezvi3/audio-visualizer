import { IVisualizerRenderer, RenderContext } from '../../rendering/types';

export class FrequencyRingsRenderer implements IVisualizerRenderer {
  private rotation = 0;

  public render(rc: RenderContext): void {
    const { ctx, width, height, analysis, colors, effects, deltaTime } = rc;
    const { bass, lowMid, mid, highMid, treble, beatStrength } = analysis;

    this.rotation += deltaTime * 0.2;
    const cx = width / 2;
    const cy = height / 2;

    const bands = [
      { name: 'Bass', energy: bass, radius: Math.min(width, height) * 0.12, color: colors.primary },
      { name: 'LowMid', energy: lowMid, radius: Math.min(width, height) * 0.19, color: colors.secondary },
      { name: 'Mid', energy: mid, radius: Math.min(width, height) * 0.26, color: colors.accent },
      { name: 'HighMid', energy: highMid, radius: Math.min(width, height) * 0.33, color: colors.primary },
      { name: 'Treble', energy: treble, radius: Math.min(width, height) * 0.40, color: colors.secondary },
    ];

    ctx.save();
    if (effects.glow > 0.05) {
      ctx.shadowBlur = effects.glow * 22;
      ctx.shadowColor = colors.glow || colors.primary;
    }

    bands.forEach((band, idx) => {
      const pulse = band.radius * (1.0 + band.energy * 0.45 + (idx === 0 ? beatStrength * 0.2 : 0));
      const segments = 48 + idx * 16;
      const rot = this.rotation * (idx % 2 === 0 ? 1 : -1) * (1 + idx * 0.2);

      ctx.lineWidth = 3 + band.energy * 3;
      ctx.strokeStyle = band.color;
      ctx.beginPath();

      for (let s = 0; s <= segments; s++) {
        const angle = (s / segments) * Math.PI * 2 + rot;
        const waveDisp = Math.sin(angle * (6 + idx * 2) + this.rotation * 4) * (band.energy * 25);
        const r = pulse + waveDisp;

        const x = cx + Math.cos(angle) * r;
        const y = cy + Math.sin(angle) * r;

        if (s === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
    });

    ctx.restore();
  }
}
