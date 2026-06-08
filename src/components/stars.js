/* ═══════════════════════════════════════════════════
   SleepSense — Stars background module
   Generates and animates the night sky star field
   ═══════════════════════════════════════════════════ */

function initStars(containerId = 'stars', count = 80) {
  const container = document.getElementById(containerId);
  if (!container) return;

  for (let i = 0; i < count; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    const size = Math.random() * 2 + 1;
    star.style.cssText = [
      `width:${size}px`,
      `height:${size}px`,
      `top:${Math.random() * 70}%`,
      `left:${Math.random() * 100}%`,
      `--d:${2 + Math.random() * 4}s`,
      `--delay:${Math.random() * 4}s`,
    ].join(';');
    container.appendChild(star);
  }
}

window.initStars = initStars;
