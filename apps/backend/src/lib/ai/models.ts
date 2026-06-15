export const models = [
  // Google
  { id: "gemma-4-31b", label: "Gemma 4", provider: "google" },
  {
    id: "gemini-3.1-flash-lite",
    label: "Gemini 3.1 Flash Lite",
    provider: "google",
  },
  // Groq
  { id: "llama-3.1-8b-instant", label: "Llama 3.1", provider: "groq" },
  // Ollama Cloud
  { id: "gpt-oss:20b-cloud", label: "GPT-OSS", provider: "ollama" },
  {
    id: "deepseek-v4-flash:cloud",
    label: "DeepSeek V4 Flash",
    provider: "ollama",
  },
] as const;

export const DEFAULT_MODEL = "gemma-4-31b";
