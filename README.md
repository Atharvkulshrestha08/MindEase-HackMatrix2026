# 🧠 MindEase 2.0

> Your Daily Mental Fitness Companion

MindEase 2.0 is an AI-powered mental wellness platform designed to transform emotional well-being into a daily habit rather than a crisis response. It combines a context-aware AI companion, mood tracking, private journaling, calming activities, music therapy, and insights to help users build healthier emotional habits in a safe, private, engaging environment.

---

## 🏷️ Team Name

**Team HackMatrix** — IEEE Computer Society SBC, MITS Gwalior

<!-- If your team uses a different name, update it here. -->

---

## 🎯 Problem Statement

Millions of students and young professionals struggle with daily stress, anxiety, and emotional overload. Existing mental health platforms are mostly built for crisis intervention rather than everyday emotional well-being, which leads to low engagement and poor long-term adoption. People need a private, accessible way to check in with their emotions daily — not just when things go wrong.

---

## 💡 Solution Overview

MindEase 2.0 makes mental wellness interactive, personalized, and habit-forming:

- **Context-aware AI companion** that remembers your name, mood history, journal habits, and wellness goal — with real LLM responses (Groq / Gemini / OpenAI-compatible), automatic offline fallback, and built-in crisis detection that surfaces India helplines when it matters most.
- **Mood tracking** with daily check-ins, streaks, weekly charts, and a **trend-based mood prediction** so users see where their emotional state is heading.
- **Private journaling** with guided prompts, cognitive-reframing suggestions, and **voice dictation** (Web Speech API).
- **Calming activities** (breathing, meditation, grounding, focus timer), **music therapy**, and a **habit garden** that grows as you build habits.
- **Insights & data explorer** with real WHO/IHME mental-health datasets and visualizations.
- **Privacy first** — every byte stays in the browser (localStorage). No cloud, no tracking, no account data collected.
- Works **offline** as a PWA.

---

## 🔗 Live Demonstration Link

> ⏳ Deployment in progress — the live demo link will be added here once hosted (Netlify/Vercel/GitHub Pages).

---

## 🛠 Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite, JavaScript, Tailwind CSS v4, Framer Motion |
| Routing | React Router v7 |
| AI Companion | OpenAI-compatible Chat Completions API (Groq Llama 3.3 default), Gemini fallback, offline mock mode |
| Voice Input | Web Speech API |
| Data Visualization | Recharts |
| Offline / PWA | Vite PWA (Workbox service worker) |
| Data Layer | Browser localStorage (privacy-first) |
| Authentication | React Context API + SHA-256 hashed demo credentials |
| Data Science | Python, Jupyter Notebook, pandas (EDA & prediction experiments) |

---

## 👥 Team Members

| Name | Role | GitHub |
|---|---|---|
| Atharv Kulshrestha | Project Lead · Frontend · UI/UX · AI Integration | [@Atharvkulshrestha08](https://github.com/Atharvkulshrestha08) |
| _Add teammate_ | _Role_ | _GitHub_ |
| _Add teammate_ | _Role_ | _GitHub_ |

---

## 🚦 Setup Instructions

### Prerequisites

- Node.js 18+
- npm

### Clone the Repository

```bash
git clone https://github.com/Atharvkulshrestha08/MindEase-2.0.git
```

Move into the project

```bash
cd MindEase-2.0
```

Install dependencies

```bash
npm install
```

Start the development server

```bash
npm run dev
```

Build for production

```bash
npm run build
```

Preview the production build

```bash
npm run preview
```

### AI Companion (optional)

The app works fully offline out of the box. To enable real AI responses, copy `.env.example` to `.env` and add a free key:

```bash
# OpenAI-compatible (recommended): https://console.groq.com
VITE_AI_API_KEY=your-groq-key
# Optional Gemini fallback: https://aistudio.google.com/apikey
VITE_AI_GEMINI_API_KEY=your-gemini-key
```

---

## 📂 Project Structure

```
src/
│
├── components/     # UI kit, layout (Dock, AppLayout), SOS, onboarding
├── context/        # Auth & toast providers
├── data/           # Mock data + real WHO/IHME CSV datasets
├── hooks/          # useLocalStorage, useMoodData, useDarkMode, useProfile…
├── lib/            # AI client, audio engine, dates, demo data, alarm
├── pages/          # Dashboard, Companion, Journal, Music, Insights…
├── styles/         # Global theme (light/dark tokens)
│
├── App.jsx
└── main.jsx

public/
Data/               # Research datasets & design docs
```

---

## 📌 Roadmap

- **Phase 1** — Core platform, mood tracking, journal, dashboard
- **Phase 2** — AI companion, personalized recommendations, insights
- **Phase 3** — Music therapy, habit garden, wellness streaks
- **Phase 4** — Community, university wellness integration, smart notifications

---

## 🏆 Achievements

🥇 **Winner — HACKMoR 2026**, Manav Rachna University

🏅 **Grand Finale — Tech-BIP**, Technology Business Idea Pitch at EDII, Ahmedabad

---

## 📜 License

This project is licensed under the MIT License.

---

## ❤️ Acknowledgements

- React, Vite, Tailwind CSS, Framer Motion, Recharts
- Groq, Google Gemini, OpenAI-compatible APIs
- WHO World Mental Health Report 2022 & IHME Global Burden of Disease Study (dataset sources)
- The open-source community

---

> "Mental wellness isn't a destination. It's a habit."

Made with ❤️ by Team MindEase.
