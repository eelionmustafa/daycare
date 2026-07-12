import Link from "next/link";
import { db } from "@/lib/db";
import { formatMoney, formatShortDate, todayUTC } from "@/lib/format";
import { StatusBadge } from "@/components/ui";
import { IconChild, IconCalendar, IconInbox, IconCard, IconMail } from "@/components/icons";

export default async function AdminHome() {
  const today = todayUTC();
  const [childCount, presentToday, newApps, openInvoices, unreadMessages, latestApps] =
    await Promise.all([
      db.child.count({ where: { active: true } }),
      db.attendanceRecord.count({ where: { date: today, status: "PRESENT" } }),
      db.enrollmentApplication.count({ where: { status: "NEW" } }),
      db.invoice.findMany({ where: { status: { in: ["SENT", "OVERDUE"] } } }),
      db.contactMessage.count({ where: { read: false } }),
      db.enrollmentApplication.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
    ]);

  const openTotal = openInvoices.reduce((s, i) => s + i.amountCents, 0);

  const stats = [
    { label: "Fëmijë aktivë", value: String(childCount), href: "/admin/femijet", icon: <IconChild /> },
    { label: "Prezent sot", value: String(presentToday), href: "/admin/prezenca", icon: <IconCalendar /> },
    { label: "Aplikime të reja", value: String(newApps), href: "/admin/aplikimet", icon: <IconInbox /> },
    { label: "Pa paguar", value: formatMoney(openTotal), href: "/admin/faturat", icon: <IconCard /> },
    { label: "Mesazhe të palexuara", value: String(unreadMessages), href: "/admin/mesazhet", icon: <IconMail /> },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-semibold">Paneli i administrimit</h1>
        <p className="mt-1 text-ink-soft">Përmbledhja e ditës në Mësimin Kreativ.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="rounded-3xl bg-white p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift"
          >
            <span aria-hidden className="inline-block text-terracotta [&>svg]:h-7 [&>svg]:w-7">{s.icon}</span>
            <p className="mt-2 font-display text-2xl font-semibold">{s.value}</p>
            <p className="text-xs font-bold uppercase tracking-wider text-ink-soft">{s.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-3xl bg-white p-6 shadow-soft">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold">Aplikimet e fundit</h2>
            <Link href="/admin/aplikimet" className="text-sm font-bold text-terracotta hover:underline">
              Të gjitha →
            </Link>
          </div>
          <ul className="mt-4 divide-y divide-ink/5">
            {latestApps.map((a) => (
              <li key={a.id} className="flex items-center justify-between gap-2 py-3">
                <div>
                  <p className="font-semibold">{a.childName}</p>
                  <p className="text-xs text-ink-soft">
                    {a.parentName} · {formatShortDate(a.createdAt)}
                  </p>
                </div>
                <StatusBadge status={a.status} />
              </li>
            ))}
            {latestApps.length === 0 && (
              <li className="py-3 text-sm text-ink-soft">Ende pa aplikime.</li>
            )}
          </ul>
        </section>

        <section className="rounded-3xl bg-white p-6 shadow-soft">
          <h2 className="font-display text-xl font-semibold">Veprime të shpejta</h2>
          <div className="mt-4 grid gap-3">
            {[
              ["/admin/prezenca", "Mbaj prezencën e sotme"],
              ["/admin/faturat/shto", "Krijo faturë të re"],
              ["/admin/femijet/shto", "Regjistro familje të re"],
              ["/admin/galeria", "Menaxho fotot / sinkronizo Facebook"],
            ].map(([href, label]) => (
              <Link
                key={href}
                href={href}
                className="rounded-2xl bg-cream px-5 py-3.5 font-semibold transition-colors hover:bg-blush"
              >
                {label}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
