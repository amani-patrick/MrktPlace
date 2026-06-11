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
  searchHint?: string;
  loadMoreLabel?: string;
  useCustomLabel?: (value: string) => string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  /** When true, show search input inside dropdown */
  searchable?: boolean;
  /** Items shown per page before "Load more" */
  pageSize?: number;
  /** Allow selecting typed text when it does not match an option */
  allowCustom?: boolean;
}

function sortOptions(options: SearchableSelectOption[]) {
  return [...options].sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return a.label.localeCompare(b.label);
  });
}

export function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = "Select…",
  searchPlaceholder = "Search…",
  emptyLabel = "No results",
  searchHint,
  loadMoreLabel = "Show more",
  useCustomLabel = (v) => `Use "${v}"`,
  required,
  disabled,
  className,
  searchable = true,
  pageSize = 8,
  allowCustom = false,
}: SearchableSelectProps) {
  const id = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const selected =
    options.find((o) => o.value === value) ??
    (value ? { value, label: value } : undefined);

  const sortedOptions = useMemo(() => sortOptions(options), [options]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return sortedOptions;
    return sortedOptions.filter(
      (o) =>
        o.label.toLowerCase().includes(q) ||
        o.value.toLowerCase().includes(q) ||
        (o.group?.toLowerCase().includes(q) ?? false),
    );
  }, [sortedOptions, query]);

  const visibleCount = page * pageSize;
  const visible = filtered.slice(0, visibleCount);
  const hasMore = visible.length < filtered.length;

  const trimmedQuery = query.trim();
  const hasExactMatch =
    trimmedQuery.length > 0 &&
    filtered.some(
      (o) =>
        o.label.toLowerCase() === trimmedQuery.toLowerCase() ||
        o.value.toLowerCase() === trimmedQuery.toLowerCase(),
    );
  const showCustom = allowCustom && trimmedQuery.length > 0 && !hasExactMatch;

  useEffect(() => {
    setPage(1);
  }, [query]);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  function selectValue(next: string) {
    onChange(next);
    setOpen(false);
    setQuery("");
    setPage(1);
  }

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
        <div className="absolute z-50 mt-1 max-h-72 w-full overflow-hidden rounded-lg border border-border bg-white shadow-lg">
          {searchable ? (
            <div className="border-b border-border p-2">
              <div className="relative">
                <Search
                  className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <input
                  type="search"
                  enterKeyHint="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="h-9 w-full rounded-md border border-border pr-3 pl-8 text-sm outline-none focus:border-amnii-gold"
                  autoFocus
                />
              </div>
              {searchHint ? (
                <p className="mt-1.5 px-1 text-xs text-muted-foreground">{searchHint}</p>
              ) : null}
            </div>
          ) : null}

          <ul className="max-h-52 overflow-y-auto py-1" role="listbox">
            {showCustom ? (
              <li>
                <button
                  type="button"
                  role="option"
                  onClick={() => selectValue(trimmedQuery)}
                  className="flex w-full border-b border-border/60 px-3 py-2.5 text-left text-sm font-medium text-amnii-navy hover:bg-amnii-cream/60"
                >
                  {useCustomLabel(trimmedQuery)}
                </button>
              </li>
            ) : null}

            {visible.length === 0 && !showCustom ? (
              <li className="px-3 py-2 text-sm text-muted-foreground">{emptyLabel}</li>
            ) : (
              visible.map((opt) => (
                <li key={opt.value}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={value === opt.value}
                    onClick={() => selectValue(opt.value)}
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

          {hasMore ? (
            <div className="border-t border-border p-2">
              <button
                type="button"
                onClick={() => setPage((p) => p + 1)}
                className="w-full rounded-md py-2 text-sm font-medium text-amnii-navy hover:bg-amnii-cream/60"
              >
                {loadMoreLabel}
              </button>
            </div>
          ) : null}

          {filtered.length > 0 && visible.length > 0 ? (
            <p className="border-t border-border/60 px-3 py-1.5 text-xs text-muted-foreground">
              {visible.length} / {filtered.length}
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
