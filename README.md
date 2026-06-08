# SleepSense OSA

AI-powered home sleep apnea screening demo — multi-audience clinical intelligence platform.

## What it does

SleepSense displays the results of an at-home OSA (Obstructive Sleep Apnea) screening test with three tailored views:

- **For You** — patient-facing, plain-language report with moon/star night aesthetic and live AI chat
- **Physician View** — full clinical data (AHI, ODI, PAT, SpO₂ chart, AI classification)
- **Insurer View** — cost pathway comparison, reimbursement codes, savings analysis

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | Vanilla HTML + CSS + JS (no build step) |
| Fonts | Cormorant Garamond (display) + Jost (body) |
| Charts | Canvas 2D API |
| AI chat | Anthropic Claude API (`claude-sonnet-4-20250514`) |
| Server | `serve` (static file server) |

## Project structure

```
sleepsense/
├── index.html                  ← Entry point
├── package.json
├── README.md
├── .gitignore
└── src/
    ├── styles/
    │   └── main.css            ← All styles & design tokens
    └── components/
        ├── stars.js            ← Night sky star field
        ├── tabs.js             ← Panel/tab switching
        ├── charts.js           ← SpO₂ canvas chart
        └── chat.js             ← AI chat (prebuilt answers + Claude API)
```

## Getting started

### Prerequisites
- Node.js ≥ 18

### Install & run

```bash
git clone <your-repo-url>
cd sleepsense
npm install
npm run dev
```

Then open **http://localhost:3000** in your browser.

### Without npm

```bash
npx serve . -l 3000
```

## AI chat

The patient chat uses the Anthropic Claude API. It has prebuilt answers for common questions that load instantly, and falls back to a live Claude call for anything else.

The app calls the API directly from the browser (no backend required for demo purposes). For production, move the API call to a server-side endpoint to keep your API key secret.

## Customising patient data

All patient data is hardcoded as demo values in `index.html` and `src/components/chat.js`. To adapt for a real patient, update:

- AHI, SpO₂, ODI values in `index.html`
- Patient name and clinical context in the Claude system prompt in `chat.js`
- The `PREBUILT` answer map in `chat.js`

## Regulatory context

This is a demonstration prototype for the Biodesign Concept Screening process. It is **not** a cleared medical device and should not be used for clinical decision-making.

Target regulatory pathway: FDA Class II, 510(k), predicates WatchPAT (K173483) and NightOwl (K192557).

---

Built as part of SleepSense OSA Biodesign Concept v1.5
