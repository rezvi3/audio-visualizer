import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

function smoothstep(edge0, edge1, x) {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

async function processHeroSubject(inputPath, outputPath) {
  const { data, info } = await sharp(inputPath).raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const outData = Buffer.alloc(width * height * 4);

  // 1. Chroma key & despill
  for (let i = 0; i < width * height; i++) {
    const r = data[i * channels];
    const g = data[i * channels + 1];
    const b = data[i * channels + 2];

    const maxRB = Math.max(r, b);
    const greenness = g > 0 ? (g - maxRB) / g : 0;
    const rawAlpha = 1 - smoothstep(0.10, 0.30, greenness);

    // Despill: clamp G down to max(R, B) wherever green dominates
    const despilledG = g > maxRB ? maxRB : g;

    outData[i * 4] = r;
    outData[i * 4 + 1] = despilledG;
    outData[i * 4 + 2] = b;
    outData[i * 4 + 3] = Math.round(rawAlpha * 255);
  }

  // 2. Largest connected component / flood-fill cleanup
  // Find solid seed in the right half where subject sits
  const visited = new Uint8Array(width * height);
  const queue = [];
  
  // Find seeds with high opacity in the known subject region (around center-right)
  for (let y = Math.floor(height * 0.3); y < Math.floor(height * 0.8); y++) {
    for (let x = Math.floor(width * 0.5); x < Math.floor(width * 0.85); x++) {
      const idx = y * width + x;
      if (outData[idx * 4 + 3] > 200 && !visited[idx]) {
        queue.push(idx);
        visited[idx] = 1;
      }
    }
  }

  // BFS to keep connected object
  let head = 0;
  while (head < queue.length) {
    const idx = queue[head++];
    const x = idx % width;
    const y = Math.floor(idx / width);

    const neighbors = [
      x > 0 ? idx - 1 : -1,
      x < width - 1 ? idx + 1 : -1,
      y > 0 ? idx - width : -1,
      y < height - 1 ? idx + width : -1,
    ];

    for (const n of neighbors) {
      if (n !== -1 && !visited[n] && outData[n * 4 + 3] > 10) {
        visited[n] = 1;
        queue.push(n);
      }
    }
  }

  // Remove disconnected ghosts
  for (let i = 0; i < width * height; i++) {
    if (!visited[i]) {
      outData[i * 4 + 3] = 0;
    }
  }

  // 3. Find bounding box to trim
  let minX = width, minY = height, maxX = 0, maxY = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const alpha = outData[(y * width + x) * 4 + 3];
      if (alpha > 12) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  // Add 1px safety margin
  minX = Math.max(0, minX - 1);
  minY = Math.max(0, minY - 1);
  maxX = Math.min(width - 1, maxX + 1);
  maxY = Math.min(height - 1, maxY + 1);

  const cropW = maxX - minX + 1;
  const cropH = maxY - minY + 1;

  await sharp(outData, { raw: { width, height, channels: 4 } })
    .extract({ left: minX, top: minY, width: cropW, height: cropH })
    .png()
    .toFile(outputPath);

  console.log(`Hero subject keyed and trimmed: ${cropW}x${cropH} -> ${outputPath}`);
  return { width: cropW, height: cropH };
}

async function processRotorDisc(inputPath, outputPath) {
  const { data, info } = await sharp(inputPath).raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const outData = Buffer.alloc(width * height * 4);

  const cx = width / 2;
  const cy = height / 2;
  // Radius of disc in image ~ 455px in 1024x1024
  const radius = width * 0.454;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = y * width + x;
      const r = data[i * channels];
      const g = data[i * channels + 1];
      const b = data[i * channels + 2];

      const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
      // Fitted geometry circular antialiased alpha
      let alpha = 1.0;
      if (dist > radius + 1) {
        alpha = 0;
      } else if (dist > radius - 1) {
        alpha = 1.0 - (dist - (radius - 1)) / 2;
      }

      // Despill green reflection on metallic surface
      const maxRB = Math.max(r, b);
      const despilledG = g > maxRB ? maxRB : g;

      outData[i * 4] = r;
      outData[i * 4 + 1] = despilledG;
      outData[i * 4 + 2] = b;
      outData[i * 4 + 3] = Math.round(alpha * 255);
    }
  }

  // Trim to bounding box of the circular disc
  const boxR = Math.ceil(radius) + 2;
  const left = Math.max(0, Math.floor(cx - boxR));
  const top = Math.max(0, Math.floor(cy - boxR));
  const cropW = Math.min(width - left, boxR * 2);
  const cropH = Math.min(height - top, boxR * 2);

  await sharp(outData, { raw: { width, height, channels: 4 } })
    .extract({ left, top, width: cropW, height: cropH })
    .png()
    .toFile(outputPath);

  console.log(`Rotor disc keyed to fitted circle: ${cropW}x${cropH} -> ${outputPath}`);
  return { width: cropW, height: cropH };
}

async function main() {
  const heroChroma = '/home/rezvi/.gemini/antigravity-cli/brain/ad0aaf3e-81a6-4184-bb9a-550d20c1f788/precision_transducer_chroma_1790185906868.jpg';
  const discChroma = '/home/rezvi/.gemini/antigravity-cli/brain/ad0aaf3e-81a6-4184-bb9a-550d20c1f788/precision_rotor_disc_1790185941168.jpg';

  const publicDir = '/home/rezvi/Documents/visualizer/public';
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const heroOut = path.join(publicDir, 'hero-transducer.png');
  const discOut = path.join(publicDir, 'rotor-disc.png');

  await processHeroSubject(heroChroma, heroOut);
  await processRotorDisc(discChroma, discOut);
}

main().catch(console.error);
