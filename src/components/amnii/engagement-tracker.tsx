"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "@/i18n/navigation";

const FEEDBACK_KEY = "amnii_feedback_shown";
const VISIT_KEY = "amnii_visit_data";
const MIN_SECONDS = 90;
const MIN_PAGE_VIEWS = 3;

interface VisitData {
  pageViews: number;
  startedAt: number;
}

interface EngagementTrackerProps {
  isAuthenticated: boolean;
  onTriggerFeedback: () => void;
}

export function EngagementTracker({
  isAuthenticated,
  onTriggerFeedback,
}: EngagementTrackerProps) {
  const pathname = usePathname();
  const triggered = useRef(false);

  useEffect(() => {
    if (!isAuthenticated || triggered.current) return;
    if (typeof window === "undefined") return;
    if (localStorage.getItem(FEEDBACK_KEY)) return;

    const raw = localStorage.getItem(VISIT_KEY);
    const data: VisitData = raw
      ? (JSON.parse(raw) as VisitData)
      : { pageViews: 0, startedAt: Date.now() };

    data.pageViews += 1;
    localStorage.setItem(VISIT_KEY, JSON.stringify(data));

    const elapsed = (Date.now() - data.startedAt) / 1000;
    const shouldShow =
      data.pageViews >= MIN_PAGE_VIEWS && elapsed >= MIN_SECONDS;

    if (shouldShow) {
      triggered.current = true;
      localStorage.setItem(FEEDBACK_KEY, "1");
      const timer = window.setTimeout(onTriggerFeedback, 1500);
      return () => window.clearTimeout(timer);
    }
  }, [pathname, isAuthenticated, onTriggerFeedback]);

  return null;
}
