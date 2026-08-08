<p align="center">
  <img src="apps/frontend/src/lib/assets/openbot.png" alt="OpenBot" width="220" />
</p>

> ### **OpenBot** is a general-purpose, multi-model AI chatbot for streaming and continuing conversations across providers.

## 🔑 Key features

- 💬 **Streaming multi-model chat** — Google Gemini, Groq Llama, and Ollama models, rendered token-by-token with markdown and mermaid.
- 🗂️ **Persistent conversations** — every message is saved; reload a past chat and the full history hydrates.
- 🧩 **Per-request model selection** — the available set is derived from which provider keys are configured.
- 🔐 **Authentication** — email/password with verification, plus Google OAuth, via Clerk.
- 🗃️ **Conversation management** — sidebar list, create/delete, search, and shareable `/c/[id]` routes.
- 📱 **Responsive shell** — persistent sidebar on desktop, slide-in drawer on mobile.

## 🛠️ Installation guide

1. **Clone the repository**

```bash
git clone https://github.com/Gazi2050/OpenBot.git
cd OpenBot
```

2. **Install dependencies**

```bash
pnpm install
```

3. **Create `.env`**

Copy from `.env.example` and set:

```bash
# ---- Backend ----
DATABASE_URL=
PORT=3000
# CLERK_SECRET_KEY also need in frontend too
CLERK_SECRET_KEY=
CLERK_PUBLISHABLE_KEY=
GOOGLE_GENERATIVE_AI_API_KEY=
GROQ_API_KEY=
OLLAMA_API_KEY=

# ---- Frontend ----
PUBLIC_API_URL=http://localhost:3000
PUBLIC_CLERK_PUBLISHABLE_KEY=
PUBLIC_CLERK_SIGN_IN_URL=/
PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/
```

4. **Start the database**

```bash
docker compose up -d
```

5. **Run the development server**

```bash
pnpm dev
```

## 📚 Docs

- 📄 [Features](./FEATURES.md) — full feature documentation
- 🎨 [Design system](./DESIGN.md) — design spec

## 🚀 Live

- Frontend: https://openbott.vercel.app
- API: https://openbot-api.vercel.app/api/health
