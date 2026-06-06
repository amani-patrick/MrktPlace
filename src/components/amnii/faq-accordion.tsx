"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqAccordionProps {
  items: readonly FaqItem[];
}

export function FaqAccordion({ items }: FaqAccordionProps) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="divide-y divide-border rounded-2xl border border-border bg-white">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.question}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-amnii-cream/40 sm:px-6"
              aria-expanded={isOpen}
            >
              <span className="font-medium text-amnii-navy">{item.question}</span>
              <ChevronDown
                className={cn(
                  "size-5 shrink-0 text-amnii-gold transition-transform",
                  isOpen && "rotate-180",
                )}
                aria-hidden="true"
              />
            </button>
            {isOpen ? (
              <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground sm:px-6">
                {item.answer}
              </p>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
