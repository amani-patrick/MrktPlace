"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SearchableSelectOption {
  value: string;
  label: string;
  group?: string;
  featured?: boolean;
}

interface SearchableSelectProps {
  options: SearchableSelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyLabel?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  /** When true, show search input inside dropdown */
  searchable?: boolean;
}

export function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = "Select…",
  searchPlaceholder = "Search…",
  emptyLabel = "No results",
  required,
  disabled,
  className,
  searchable = true,
}: SearchableSelectProps) {
  const id = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const selected = options.find((o) => o.value === value);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      const featured = options.filter((o) => o.featured);
      return featured.length > 0 ? featured : options.slice(0, 6);
    }
    return options.filter(
      (o) =>
        o.label.toLowerCase().includes(q) ||
        o.value.toLowerCase().includes(q) ||
        (o.group?.toLowerCase().includes(q) ?? false),
    );
  }, [options, query]);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        type="button"
        id={id}
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex h-11 w-full items-center justify-between rounded-lg border border-border bg-white px-3 text-left text-sm outline-none transition-colors",
          "focus:border-amnii-gold focus:ring-2 focus:ring-amnii-gold/20",
          disabled && "cursor-not-allowed opacity-50",
        )}
      >
        <span className={selected ? "text-foreground" : "text-muted-foreground"}>
          {selected?.label ?? placeholder}
        </span>
        <ChevronDown
          className={cn("size-4 text-muted-foreground transition-transform", open && "rotate-180")}
          aria-hidden="true"
        />
      </button>

      {required ? (
        <input
          tabIndex={-1}
          className="sr-only"
          value={value}
          required
          onChange={() => {}}
          aria-hidden="true"
        />
      ) : null}

      {open ? (
        <div className="absolute z-50 mt-1 max-h-64 w-full overflow-hidden rounded-lg border border-border bg-white shadow-lg">
          {searchable ? (
            <div className="border-b border-border p-2">
              <div className="relative">
                <Search
                  className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="h-9 w-full rounded-md border border-border pl-8 pr-3 text-sm outline-none focus:border-amnii-gold"
                  autoFocus
                />
              </div>
              {!query ? (
                <p className="mt-1.5 px-1 text-xs text-muted-foreground">
                  Type to search all {options.length} options
                </p>
              ) : null}
            </div>
          ) : null}

          <ul className="max-h-48 overflow-y-auto py-1" role="listbox">
            {filtered.length === 0 ? (
              <li className="px-3 py-2 text-sm text-muted-foreground">{emptyLabel}</li>
            ) : (
              filtered.map((opt) => (
                <li key={opt.value}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={value === opt.value}
                    onClick={() => {
                      onChange(opt.value);
                      setOpen(false);
                      setQuery("");
                    }}
                    className={cn(
                      "flex w-full flex-col px-3 py-2 text-left text-sm hover:bg-amnii-cream/60",
                      value === opt.value && "bg-amnii-cream font-medium text-amnii-navy",
                    )}
                  >
                    <span>{opt.label}</span>
                    {opt.group ? (
                      <span className="text-xs text-muted-foreground">{opt.group}</span>
                    ) : null}
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
