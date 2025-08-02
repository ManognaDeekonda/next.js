# 🎙️ Offline Voice Chat App (Next.js + Whisper + OpenAI + TTS)

A progressive web app (PWA) built with **Next.js + TypeScript** that captures microphone input, transcribes speech locally using **Whisper WASM**, sends the transcript to **OpenAI Chat Completion**, converts the response into audio using a local **TTS engine**, and plays it back — with **offline support** except for the OpenAI call.

---

## 🚀 Features

- 🎤 Local speech-to-text using Whisper (WASM in a Web Worker)
- 🧠 Sends final transcript to OpenAI Chat Completion endpoint
- 🔊 Local text-to-speech using a Coqui-style TTS engine (WASM)
- ⚙️ Audio recorded in real-time and streamed in chunks
- 📱 Works offline (PWA) after initial load, except OpenAI call
- ⏱️ Logs latency and aims for sub-1.2s total response time

---

## 📦 Tech Stack

- [Next.js](https://nextjs.org/) + [TypeScript](https://www.typescriptlang.org/)
- Web Workers (for STT and TTS in parallel threads)
- `MediaRecorder` API for audio capture
- `next-pwa` for PWA support
- OpenAI API (Chat Completion)
- Whisper (via WASM, integrated manually)
- Coqui TTS (WASM, simulated for now)

---

## 🛠️ Installation

```bash
git clone https://github.com/your-username/offline-voice-chat.git
cd offline-voice-chat

npm install
