/** First name (or best short label) for greetings — parsed from full name or email. */
export function getDisplayName(
  fullName: string | null | undefined,
  email: string | null | undefined,
): string | null {
  if (fullName?.trim()) {
    const first = fullName.trim().split(/\s+/)[0];
    if (first) return capitalize(first);
  }

  if (email) {
    const local = email.split("@")[0] ?? "";
    const word = local.split(/[._-]/)[0];
    if (word) return capitalize(word);
  }

  return null;
}

/** Full name when available, otherwise a readable short label. */
export function getFullDisplayName(
  fullName: string | null | undefined,
  email: string | null | undefined,
): string | null {
  if (fullName?.trim()) return fullName.trim();
  return getDisplayName(fullName, email);
}

function capitalize(value: string): string {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}
