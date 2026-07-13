import Link from "next/link";
import { Logo } from "@/components/Logo";
import { getSettings } from "@/lib/settings";
import { IconSun } from "@/components/icons";

export async function SiteFooter() {
  const s = await getSettings();
  return (
    <footer className="texture-paper mt-auto bg-paper">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
        <div className="space-y-3">
          <Logo />
          <p className="max-w-xs text-sm leading-relaxed text-ink-soft">{s.tagline}.</p>
          <a
            href={s.facebook_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-sky/10 px-4 py-2 text-sm font-bold text-sky transition-colors hover:bg-sky/20"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12Z" />
            </svg>
            Na ndiqni në Facebook
          </a>
        </div>
        <div>
          <h3 className="font-display text-base font-semibold">Faqet</h3>
          <ul className="mt-3 space-y-2 text-sm text-ink-soft">
            {[
              ["/galeria", "Galeria"],
              ["/gjeneratat", "Gjeneratat"],
              ["/pyetjet", "Pyetje të shpeshta"],
              ["/regjistrohu", "Regjistrimi"],
            ].map(([href, label]) => (
              <li key={href}>
                <Link href={href} className="transition-colors hover:text-terracotta">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-display text-base font-semibold">Na gjeni</h3>
          <ul className="mt-3 space-y-2 text-sm text-ink-soft">
            <li>{s.address}</li>
            <li>
              <a href={`tel:${s.phone.replace(/\s/g, "")}`} className="hover:text-terracotta">
                {s.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${s.email}`} className="hover:text-terracotta">
                {s.email}
              </a>
            </li>
            <li>{s.hours}</li>
          </ul>
        </div>
        <div>
          <h3 className="font-display text-base font-semibold">Për prindërit</h3>
          <ul className="mt-3 space-y-2 text-sm text-ink-soft">
            <li>
              <Link href="/hyrje" className="hover:text-terracotta">
                Hyrja në portal
              </Link>
            </li>
            <li>
              <Link href="/regjistrohu" className="hover:text-terracotta">
                Regjistro fëmijën
              </Link>
            </li>
            <li>
              <Link href="/kontakti" className="hover:text-terracotta">
                Kontakti
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-ink/5">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-ink-soft sm:flex-row sm:px-6">
          <p>© {new Date().getFullYear()} {s.site_name}. Të gjitha të drejtat e rezervuara.</p>
          <p className="flex items-center gap-1.5">
            Bërë me kujdes për fëmijët tanë
            <IconSun className="h-4 w-4" aria-hidden />
          </p>
        </div>
      </div>
    </footer>
  );
}
