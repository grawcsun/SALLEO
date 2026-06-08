/* ═══════════════════════════════════════════════════
   SleepSense — Charts module
   SpO₂ overnight trend canvas renderer
   ═══════════════════════════════════════════════════ */

const DIP_POINTS = [22, 38, 55, 72, 90, 108, 125, 140, 158, 172, 185];

function generateSpO2Data(points = 200) {
  const pts = [];
  for (let i = 0; i < points; i++) {
    let v = 94 + Math.sin(i * 0.15) + Math.cos(i * 0.07) * 0.5 + (Math.random() - 0.5) * 0.6;
    DIP_POINTS.forEach(d => {
      if (i === d)     v -= 4 + Math.random() * 1.5;
      if (i === d + 1) v -= 1.5;
    });
    pts.push(Math.max(87, Math.min(99, v)));
  }
  return pts;
}

function drawSpO2(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const dpr = window.devicePixelRatio || 1;
  canvas.width  = canvas.offsetWidth * dpr;
  canvas.height = 70 * dpr;
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  const W = canvas.offsetWidth, H = 70;

  const pts = generateSpO2Data();
  const toY = v => (1 - (v - 87) / 12) * (H - 12) + 6;
  const toX = i => (i / (pts.length - 1)) * W;

  /* Fill area */
  ctx.beginPath();
  ctx.moveTo(0, H);
  pts.forEach((v, i) => ctx.lineTo(toX(i), toY(v)));
  ctx.lineTo(W, H);
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, 'rgba(168,184,144,0.2)');
  grad.addColorStop(1, 'rgba(168,184,144,0.01)');
  ctx.fillStyle = grad;
  ctx.fill();

  /* 90% threshold dashed line */
  ctx.beginPath();
  ctx.setLineDash([4, 4]);
  ctx.strokeStyle = 'rgba(200,168,112,0.5)';
  ctx.lineWidth = 1;
  ctx.moveTo(0, toY(90));
  ctx.lineTo(W, toY(90));
  ctx.stroke();
  ctx.setLineDash([]);

  /* SpO₂ line */
  ctx.beginPath();
  ctx.strokeStyle = '#a8b890';
  ctx.lineWidth = 1.5;
  pts.forEach((v, i) => (i === 0 ? ctx.moveTo(toX(i), toY(v)) : ctx.lineTo(toX(i), toY(v))));
  ctx.stroke();

  /* Desaturation event dots */
  DIP_POINTS.forEach(i => {
    ctx.beginPath();
    ctx.fillStyle = '#c4907a';
    ctx.arc(toX(i), toY(pts[i]), 2.5, 0, Math.PI * 2);
    ctx.fill();
  });
}

window.drawSpO2 = drawSpO2;
