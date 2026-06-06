"use client";

import { useCallback, useState } from "react";
import { AuthPromptDialog } from "@/components/amnii/auth-prompt-dialog";
import { FeedbackModal } from "@/components/amnii/feedback-modal";
import { EngagementTracker } from "@/components/amnii/engagement-tracker";
import { AuthPromptContext } from "@/hooks/use-auth-prompt";
import { FavoritesProvider } from "@/providers/favorites-provider";
import { ToastProvider } from "@/providers/toast-provider";

interface AppProvidersProps {
  children: React.ReactNode;
  isAuthenticated: boolean;
  initialFavoriteIds: string[];
}

export function AppProviders({
  children,
  isAuthenticated,
  initialFavoriteIds,
}: AppProvidersProps) {
  const [authPromptOpen, setAuthPromptOpen] = useState(false);
  const [authPromptContext, setAuthPromptContext] = useState<"favorite" | "review" | "report">("favorite");
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  const openAuthPrompt = useCallback((context: "favorite" | "review" | "report" = "favorite") => {
    setAuthPromptContext(context);
    setAuthPromptOpen(true);
  }, []);

  const triggerFeedback = useCallback(() => {
    if (!isAuthenticated) return;
    setFeedbackOpen(true);
  }, [isAuthenticated]);

  return (
    <AuthPromptContext.Provider value={{ openAuthPrompt }}>
      <ToastProvider>
      <FavoritesProvider
        initialFavoriteIds={initialFavoriteIds}
        isAuthenticated={isAuthenticated}
        onAuthRequired={openAuthPrompt}
      >
        <EngagementTracker
          isAuthenticated={isAuthenticated}
          onTriggerFeedback={triggerFeedback}
        />
        {children}
      <AuthPromptDialog
        open={authPromptOpen}
        onOpenChange={setAuthPromptOpen}
        context={authPromptContext}
      />
        <FeedbackModal open={feedbackOpen} onOpenChange={setFeedbackOpen} />
      </FavoritesProvider>
      </ToastProvider>
    </AuthPromptContext.Provider>
  );
}
