import { IVisualizerRenderer, RenderContext } from '../../rendering/types';

export class ReactiveGridRenderer implements IVisualizerRenderer {
  private offsetZ = 0;

  public render(rc: RenderContext): void {
    const { ctx, width, height, analysis, colors, effects, deltaTime } = rc;
    const { waveform, bass, beatStrength } = analysis;

    this.offsetZ = (this.offsetZ + deltaTime * (30 + bass * 50)) % 40;

    const horizonY = height * 0.45;
    const fov = 350;
    const gridRows = 22;
    const gridCols = 24;

    ctx.save();
    if (effects.glow > 0.05) {
      ctx.shadowBlur = effects.glow * 18;
      ctx.shadowColor = colors.glow || colors.primary;
    }

    // Glowing synthwave sun on horizon
    const sunR = Math.min(width, height) * 0.16 * (1 + beatStrength * 0.15);
    const sunGrad = ctx.createLinearGradient(width / 2, horizonY - sunR, width / 2, horizonY);
    sunGrad.addColorStop(0, colors.secondary);
    sunGrad.addColorStop(1, colors.primary);
    ctx.fillStyle = sunGrad;
    ctx.beginPath();
    ctx.arc(width / 2, horizonY, sunR, Math.PI, 0);
    ctx.fill();

    // Horizontal depth grid lines
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = colors.primary;

    for (let r = 0; r < gridRows; r++) {
      const z = (r * 40 - this.offsetZ) + 20;
      if (z <= 5) continue;
      const py = horizonY + (fov * (height * 0.55)) / z;
      if (py > height) continue;

      const alpha = Math.min(1.0, (py - horizonY) / (height - horizonY));
      ctx.globalAlpha = alpha * 0.85;

      ctx.beginPath();
      for (let c = 0; c <= gridCols; c++) {
        const normX = (c / gridCols) * 2 - 1; // -1 to +1
        const x3d = normX * (width * 1.8);
        const px = width / 2 + (x3d * fov) / z;

        // Waveform terrain elevation
        const sampleIdx = Math.floor((c / gridCols) * waveform.length);
        const elev = waveform[sampleIdx] * 40 * (1 + bass * 1.2) * (fov / z);
        const actualY = py - elev;

        if (c === 0) ctx.moveTo(px, actualY);
        else ctx.lineTo(px, actualY);
      }
      ctx.stroke();
    }

    // Perspective vanishing grid lines radiating from center
    for (let c = 0; c <= gridCols; c++) {
      const normX = (c / gridCols) * 2 - 1;
      const xNear = width / 2 + normX * (width * 1.4);
      const xFar = width / 2 + normX * 20;

      ctx.beginPath();
      ctx.moveTo(xFar, horizonY);
      ctx.lineTo(xNear, height);
      ctx.stroke();
    }

    ctx.restore();
  }
}
