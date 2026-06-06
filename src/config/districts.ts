/**
 * All 30 districts of Rwanda + featured defaults for searchable dropdowns.
 * `boostScore` is reserved for future paid placement (agents, featured districts).
 */

export interface DistrictOption {
  slug: string;
  name: string;
  province: string;
  /** Shown in default list before user searches */
  featured: boolean;
  /** Higher = appears earlier when featured (future: paid boosts) */
  boostScore: number;
}

export const RWANDA_DISTRICTS: DistrictOption[] = [
  // Kigali City
  { slug: "gasabo", name: "Gasabo", province: "Kigali", featured: true, boostScore: 100 },
  { slug: "kicukiro", name: "Kicukiro", province: "Kigali", featured: true, boostScore: 95 },
  { slug: "nyarugenge", name: "Nyarugenge", province: "Kigali", featured: true, boostScore: 90 },
  // Eastern
  { slug: "bugesera", name: "Bugesera", province: "Eastern", featured: true, boostScore: 70 },
  { slug: "gatsibo", name: "Gatsibo", province: "Eastern", featured: false, boostScore: 0 },
  { slug: "kayonza", name: "Kayonza", province: "Eastern", featured: false, boostScore: 0 },
  { slug: "kirehe", name: "Kirehe", province: "Eastern", featured: false, boostScore: 0 },
  { slug: "ngoma", name: "Ngoma", province: "Eastern", featured: false, boostScore: 0 },
  { slug: "nyagatare", name: "Nyagatare", province: "Eastern", featured: false, boostScore: 0 },
  { slug: "rwamagana", name: "Rwamagana", province: "Eastern", featured: false, boostScore: 0 },
  // Northern
  { slug: "burera", name: "Burera", province: "Northern", featured: false, boostScore: 0 },
  { slug: "gakenke", name: "Gakenke", province: "Northern", featured: false, boostScore: 0 },
  { slug: "gicumbi", name: "Gicumbi", province: "Northern", featured: false, boostScore: 0 },
  { slug: "musanze", name: "Musanze", province: "Northern", featured: true, boostScore: 65 },
  { slug: "rulindo", name: "Rulindo", province: "Northern", featured: false, boostScore: 0 },
  // Southern
  { slug: "gisagara", name: "Gisagara", province: "Southern", featured: false, boostScore: 0 },
  { slug: "huye", name: "Huye", province: "Southern", featured: true, boostScore: 60 },
  { slug: "kamonyi", name: "Kamonyi", province: "Southern", featured: false, boostScore: 0 },
  { slug: "muhanga", name: "Muhanga", province: "Southern", featured: false, boostScore: 0 },
  { slug: "nyamagabe", name: "Nyamagabe", province: "Southern", featured: false, boostScore: 0 },
  { slug: "nyanza", name: "Nyanza", province: "Southern", featured: false, boostScore: 0 },
  { slug: "nyaruguru", name: "Nyaruguru", province: "Southern", featured: false, boostScore: 0 },
  { slug: "ruhango", name: "Ruhango", province: "Southern", featured: false, boostScore: 0 },
  // Western
  { slug: "karongi", name: "Karongi", province: "Western", featured: false, boostScore: 0 },
  { slug: "ngororero", name: "Ngororero", province: "Western", featured: false, boostScore: 0 },
  { slug: "nyabihu", name: "Nyabihu", province: "Western", featured: false, boostScore: 0 },
  { slug: "nyamasheke", name: "Nyamasheke", province: "Western", featured: false, boostScore: 0 },
  { slug: "rubavu", name: "Rubavu", province: "Western", featured: false, boostScore: 0 },
  { slug: "rutsiro", name: "Rutsiro", province: "Western", featured: false, boostScore: 0 },
  { slug: "rusizi", name: "Rusizi", province: "Western", featured: false, boostScore: 0 },
];

export const FEATURED_DISTRICTS = RWANDA_DISTRICTS.filter((d) => d.featured).sort(
  (a, b) => b.boostScore - a.boostScore,
);

export function findDistrictBySlug(slug: string): DistrictOption | undefined {
  return RWANDA_DISTRICTS.find((d) => d.slug === slug.toLowerCase());
}

export function findDistrictByName(name: string): DistrictOption | undefined {
  const normalized = name.trim().toLowerCase();
  return RWANDA_DISTRICTS.find((d) => d.name.toLowerCase() === normalized);
}

/** Options for SearchableSelect — featured first, then rest A–Z */
export function getDistrictSelectOptions(search = ""): {
  value: string;
  label: string;
  group?: string;
  featured?: boolean;
}[] {
  const q = search.trim().toLowerCase();
  const filtered = q
    ? RWANDA_DISTRICTS.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.province.toLowerCase().includes(q) ||
          d.slug.includes(q),
      )
    : FEATURED_DISTRICTS;

  const pool = q
    ? filtered.sort((a, b) => b.boostScore - a.boostScore || a.name.localeCompare(b.name))
    : filtered;

  return pool.map((d) => ({
    value: d.name,
    label: d.name,
    group: d.province,
    featured: d.featured,
  }));
}

/** Apply paid boost overrides from DB (future monetization) */
export function applyDistrictBoosts(
  districts: DistrictOption[],
  boosts: Record<string, number>,
): DistrictOption[] {
  return districts
    .map((d) => ({
      ...d,
      boostScore: boosts[d.slug] ?? d.boostScore,
      featured: (boosts[d.slug] ?? d.boostScore) > 0 ? true : d.featured,
    }))
    .sort((a, b) => b.boostScore - a.boostScore || a.name.localeCompare(b.name));
}
