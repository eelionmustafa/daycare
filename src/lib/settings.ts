import { cache } from "react";
import { db } from "@/lib/db";

/**
 * Everything a daycare owner should be able to change without a developer
 * lives in SiteSetting. These defaults keep the site coherent before the
 * real details are entered in Admin → Cilësimet.
 */
export const SETTING_DEFAULTS: Record<string, string> = {
  site_name: "Mësimi Kreativ",
  tagline: "Qendër ditore dhe mësim kreativ për fëmijë 6–11 vjeç",
  address: "Rruga Henry Dunant, C15-III, Nr.46, Prishtinë 10000",
  phone: "+383 44 584 180",
  email: "mesimikreativ@gmail.com",
  hours: "E hënë – E premte, 07:00 – 17:30",
  facebook_url: "https://www.facebook.com/mesimikreativ/",
  instagram_url: "",
  maps_query: "Rruga Henry Dunant, C15-III, Nr.46, Prishtinë 10000",
  ages: "6–11 vjeç",
  hero_headline: "Mirësevini në programin tonë të qëndrimit ditor.",
  hero_subline:
    "Mësimi Kreativ është vend i vlerave edukativo-arsimore, ku fëmija juaj fiton mundësi të reja që ta kapë hapin e suksesit.",
  bank_name: "",
  bank_account: "",
  bank_holder: "Mësimi Kreativ",
  fb_page_id: "",
  fb_access_token: "",
};

export const getSettings = cache(async (): Promise<Record<string, string>> => {
  const rows = await db.siteSetting.findMany();
  const map = { ...SETTING_DEFAULTS };
  for (const row of rows) {
    if (row.value.trim() !== "") map[row.key] = row.value;
  }
  return map;
});

export async function setSetting(key: string, value: string) {
  await db.siteSetting.upsert({
    where: { key },
    create: { key, value },
    update: { value },
  });
}
