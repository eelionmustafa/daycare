"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Logo } from "@/components/Logo";

const links = [
  { href: "/", label: "Ballina" },
  { href: "/rreth-nesh", label: "Rreth nesh" },
  { href: "/galeria", label: "Galeria" },
  { href: "/gjeneratat", label: "Gjeneratat" },
  { href: "/pyetjet", label: "Pyetjet" },
  { href: "/kontakti", label: "Kontakti" },
];

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const [prevPathname, setPrevPathname] = useState(pathname);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu on route change — adjusted during render (not in
  // an effect) per https://react.dev/learn/you-might-not-need-an-effect
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setOpen(false);
  }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled || open
          ? "bg-cream/95 shadow-soft backdrop-blur"
          : "bg-linear-to-b from-cream/90 to-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Logo />
        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`rounded-full px-3.5 py-2 text-sm font-semibold transition-colors ${
                pathname === l.href
                  ? "bg-blush text-terracotta-deep"
                  : "text-ink-soft hover:bg-blush/60 hover:text-ink"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 lg:flex">
          <Link
            href="/hyrje"
            className="rounded-full px-4 py-2 text-sm font-semibold text-ink-soft transition-colors hover:text-ink"
          >
            Portali i prindërve
          </Link>
          <Link
            href="/regjistrohu"
            className="rounded-full bg-terracotta px-5 py-2.5 text-sm font-bold text-white shadow-soft transition-all hover:-translate-y-0.5 hover:bg-terracotta-deep hover:shadow-lift"
          >
            Regjistro fëmijën
          </Link>
        </div>
        <button
          onClick={() => setOpen((v) => !v)}
          className="rounded-lg p-2 text-ink lg:hidden"
          aria-label={open ? "Mbyll menynë" : "Hap menynë"}
          aria-expanded={open}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {open ? (
              <>
                <line x1="5" y1="5" x2="19" y2="19" />
                <line x1="19" y1="5" x2="5" y2="19" />
              </>
            ) : (
              <>
                <line x1="4" y1="7" x2="20" y2="7" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="17" x2="20" y2="17" />
              </>
            )}
          </svg>
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-paper lg:hidden"
          >
            <div className="space-y-1 px-4 py-4">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`block rounded-xl px-4 py-2.5 font-semibold ${
                    pathname === l.href ? "bg-blush text-terracotta-deep" : "text-ink-soft"
                  }`}
                >
                  {l.label}
                </Link>
              ))}
              <div className="flex gap-2 pt-3">
                <Link
                  href="/hyrje"
                  className="flex-1 rounded-full border border-paper px-4 py-2.5 text-center text-sm font-bold text-ink"
                >
                  Portali
                </Link>
                <Link
                  href="/regjistrohu"
                  className="flex-1 rounded-full bg-terracotta px-4 py-2.5 text-center text-sm font-bold text-white"
                >
                  Regjistro fëmijën
                </Link>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
