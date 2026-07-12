"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/Logo";

export type NavItem = { href: string; label: string; icon: React.ReactNode };

export function PortalShell({
  items,
  userName,
  roleLabel,
  logoutAction,
  children,
}: {
  items: NavItem[];
  userName: string;
  roleLabel: string;
  logoutAction: () => Promise<void>;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen flex-col bg-cream lg:flex-row">
      <aside className="flex flex-col border-b border-ink/5 bg-white lg:w-64 lg:shrink-0 lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between px-5 py-4">
          <Logo />
        </div>
        <div className="px-5 pb-3">
          <p className="text-sm font-bold text-ink">{userName}</p>
          <p className="text-xs text-ink-soft">{roleLabel}</p>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:pb-0">
          {items.map((item) => {
            const active =
              item.href === pathname ||
              (item.href !== items[0].href && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex shrink-0 items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
                  active
                    ? "bg-blush text-terracotta-deep"
                    : "text-ink-soft hover:bg-cream hover:text-ink"
                }`}
              >
                <span aria-hidden className="[&>svg]:h-5 [&>svg]:w-5">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto hidden p-4 lg:block">
          <form action={logoutAction}>
            <button className="w-full rounded-xl border border-ink/10 px-4 py-2.5 text-sm font-bold text-ink-soft transition-colors hover:border-terracotta hover:text-terracotta">
              Dilni
            </button>
          </form>
        </div>
      </aside>
      <div className="flex-1">
        <div className="flex items-center justify-end gap-3 px-6 pt-4 lg:hidden">
          <form action={logoutAction}>
            <button className="rounded-full border border-ink/10 px-4 py-1.5 text-xs font-bold text-ink-soft">
              Dilni
            </button>
          </form>
        </div>
        <main className="mx-auto max-w-5xl px-4 py-8 sm:px-8">{children}</main>
      </div>
    </div>
  );
}
