import { routing, type Locale } from "./routing";

const localePattern = new RegExp(`^/(${routing.locales.join("|")})(/|$)`);

export function stripLocale(pathname: string): string {
  const match = pathname.match(localePattern);
  if (!match) return pathname;
  const rest = pathname.slice(match[0].length - (match[2] === "/" ? 1 : 0));
  return rest || "/";
}

export function getLocaleFromPath(pathname: string): Locale {
  const match = pathname.match(localePattern);
  if (match && routing.locales.includes(match[1] as Locale)) {
    return match[1] as Locale;
  }
  return routing.defaultLocale;
}
