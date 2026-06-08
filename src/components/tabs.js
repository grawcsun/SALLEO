/* ═══════════════════════════════════════════════════
   SleepSense — Tab / panel switching module
   ═══════════════════════════════════════════════════ */

function showPanel(name, btn) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  const panel = document.getElementById('panel-' + name);
  if (panel) panel.classList.add('active');

  /* Draw chart when clinical tab opens */
  if (name === 'clinical' && window.drawSpO2) {
    setTimeout(() => window.drawSpO2('spO2Canvas'), 50);
  }
}

window.showPanel = showPanel;
