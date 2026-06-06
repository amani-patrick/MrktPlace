"use client";

import { createContext, useContext } from "react";

type AuthPromptContext = "favorite" | "review" | "report";

interface AuthPromptValue {
  openAuthPrompt: (context?: AuthPromptContext) => void;
}

export const AuthPromptContext = createContext<AuthPromptValue | null>(null);

export function useAuthPrompt() {
  const ctx = useContext(AuthPromptContext);
  if (!ctx) {
    return { openAuthPrompt: () => {} };
  }
  return ctx;
}
