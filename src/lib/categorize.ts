/**
 * Auto-categorizes a photo into one of the gallery albums based on its
 * caption text (Albanian, diacritic-insensitive). Used by the Facebook sync
 * so imported photos land in the right album automatically; the admin can
 * always re-assign manually afterwards.
 */

const RULES: { slug: string; keywords: string[] }[] = [
  {
    slug: "festa",
    keywords: [
      "ditelindje", "festa", "festojme", "festuam", "gezuar", "urime",
      "birthday", "torta", "tortë", "kek", "ballon", "surpriz",
    ],
  },
  {
    slug: "evente",
    keywords: [
      "event", "manifestim", "shfaqje", "koncert", "vizite", "ekskursion",
      "1 qershor", "dita e femijeve", "pavaresi", "flamur", "abetare",
      "diplomim", "ceremoni", "panair",
    ],
  },
  {
    slug: "aktivitete-jashte",
    keywords: [
      "park", "natyr", "oborr", "shetitje", "jashte", "piknik",
      "ajer te paster", "bore", "gjelber", "lulishte", "mal",
    ],
  },
  {
    slug: "projekte-kreative",
    keywords: [
      "vizatim", "vizatuam", "pikture", "punim", "punime", "krijim",
      "krijuam", "art", "ngjyros", "duart", "dore", "plastelin",
      "maska", "origami", "zbukurim",
    ],
  },
  {
    slug: "momente-klase",
    keywords: [
      "detyra", "mesim", "mesuam", "lexim", "lexuam", "test", "klas",
      "shkoll", "libr", "shkrim", "matematike", "abetar", "ora e",
    ],
  },
  {
    slug: "aktivitete",
    keywords: [
      "loje", "lojera", "luajtem", "shah", "turne", "aktivitet",
      "garat", "gara", "sport", "argetim",
    ],
  },
];

/** Lowercase + strip Albanian diacritics so "Ditëlindje" matches "ditelindj". */
function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/ë/g, "e")
    .replace(/ç/g, "c")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

/** Returns the album slug for a caption, or null when nothing matches. */
export function categorizeCaption(caption: string | null | undefined): string | null {
  if (!caption) return null;
  const t = normalize(caption);
  for (const rule of RULES) {
    if (rule.keywords.some((k) => t.includes(k))) return rule.slug;
  }
  return null;
}
