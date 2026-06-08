/* ═══════════════════════════════════════════════════
   SleepSense — Chat module
   Handles patient Q&A with prebuilt answers + Claude API fallback
   ═══════════════════════════════════════════════════ */

const PREBUILT = {
  'Is sleep apnea dangerous if untreated?':
    "Left untreated over time, sleep apnea can raise blood pressure and put extra strain on your heart — but it's very treatable, and catching it now gives you a real head start. The main daily impact most people notice first is feeling tired even after a full night's sleep.",
  'What is a CPAP machine and will I need one?':
    "A CPAP is a small machine you keep by your bed. It gently blows air through a soft mask to keep your airway open while you sleep. Many people say it feels strange at first, then can't imagine sleeping without it. Whether it's right for you is something a specialist will decide — your pattern is complex enough that they may want a bit more information first.",
  'Why is my apnea worse on my back?':
    "When you lie on your back, gravity pulls the soft tissue at the back of your throat downwards, narrowing the airway. Your data showed breathing pauses three times more often on your back than on your side — which is actually a hopeful sign, because simply changing sleep position can make a real difference.",
  'Can losing weight help my sleep apnea?':
    "Yes — even modest weight loss around the neck and throat area can reduce the pressure on your airway. Studies suggest 10% weight loss can meaningfully reduce severity. It's rarely the whole solution on its own, but it's a genuine and worthwhile part of the picture.",
};

const FALLBACKS = [
  "That's a great question. The honest answer is that your results sit in a range where a specialist's eye really is the best next step — they can see the full picture alongside your medical history.",
  "Based on your sleep data, I'd say the most important thing is the specialist consultation your report recommends. They'll be able to give you a much more personalised answer than I can.",
];
let fallbackIdx = 0;

/* ── DOM helpers ── */
function addMsg(role, text) {
  const box = document.getElementById('chatMessages');
  const div = document.createElement('div');
  div.className = 'chat-msg' + (role === 'me' ? ' user' : '');
  div.innerHTML = `
    <div class="bubble-av ${role}">${role === 'ai' ? '🌿' : 'M'}</div>
    <div class="bubble ${role}">${text}</div>`;
  box.appendChild(div);
  box.scrollTop = box.scrollHeight;
}

function showTyping() {
  const box = document.getElementById('chatMessages');
  const div = document.createElement('div');
  div.className = 'chat-msg'; div.id = 'typing';
  div.innerHTML = `<div class="bubble-av ai">🌿</div><div class="bubble ai"><div class="typing-dots"><span></span><span></span><span></span></div></div>`;
  box.appendChild(div);
  box.scrollTop = box.scrollHeight;
}

function clearTyping() {
  const t = document.getElementById('typing');
  if (t) t.remove();
}

/* ── Claude API call ── */
async function fetchAI(question) {
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: `You are a warm, gentle patient-facing AI for a home sleep apnea test called SleepSense.
The patient is Marcus, 54 years old. His results:
- AHI 18.4/hr — moderate OSA
- SpO2 nadir 91%, ODI 12.4/hr
- Snoring 68% of night
- Supine AHI 28.7 vs lateral AHI 9.1 (strong positional component)
- STOP-BANG 6/8, BMI 29.8, hypertension
- Classification: Complex OSA — specialist referral recommended, 87% confidence

Answer in warm, plain language. No jargon. Max 3 sentences.
Never give specific medical advice — always encourage the specialist consultation.`,
        messages: [{ role: 'user', content: question }],
      }),
    });
    const data = await res.json();
    return data.content?.[0]?.text || null;
  } catch (e) {
    console.warn('Claude API unavailable:', e.message);
    return null;
  }
}

/* ── Public API ── */
async function askQ(question) {
  addMsg('me', question);
  showTyping();

  if (PREBUILT[question]) {
    await new Promise(r => setTimeout(r, 700));
    clearTyping();
    addMsg('ai', PREBUILT[question]);
    return;
  }

  const live = await fetchAI(question);
  clearTyping();
  addMsg('ai', live || FALLBACKS[fallbackIdx++ % FALLBACKS.length]);
}

async function sendChat() {
  const inp = document.getElementById('chatInput');
  const q = inp.value.trim();
  if (!q) return;
  inp.value = '';
  await askQ(q);
}

/* Export to window for inline HTML event handlers */
window.askQ = askQ;
window.sendChat = sendChat;
