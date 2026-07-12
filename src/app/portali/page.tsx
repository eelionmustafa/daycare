import Link from "next/link";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { formatMoney, formatShortDate, ageFromBirthday } from "@/lib/format";
import { StatusBadge } from "@/components/ui";

export default async function PortalHome() {
  const user = await requireUser("PARENT");
  const [children, openInvoices, recentAttendance] = await Promise.all([
    db.child.findMany({ where: { parentId: user.id, active: true } }),
    db.invoice.findMany({
      where: { parentId: user.id, status: { in: ["SENT", "OVERDUE"] } },
      orderBy: { issuedAt: "desc" },
      include: { child: true },
    }),
    db.attendanceRecord.findMany({
      where: { child: { parentId: user.id } },
      orderBy: { date: "desc" },
      take: 8,
      include: { child: true },
    }),
  ]);

  const openTotal = openInvoices.reduce((sum, i) => sum + i.amountCents, 0);
  const firstName = user.name.split(" ")[0];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-semibold">
          Mirë se erdhët, {firstName}!
        </h1>
        <p className="mt-1 text-ink-soft">
          Këtu gjeni gjithçka për fëmijët tuaj në Mësimin Kreativ.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-3xl bg-white p-6 shadow-soft">
          <p className="text-sm font-bold uppercase tracking-wider text-sage-deep">Fëmijët</p>
          <p className="mt-2 font-display text-3xl font-semibold">{children.length}</p>
          <Link href="/portali/femijet" className="mt-2 inline-block text-sm font-bold text-terracotta hover:underline">
            Shiko profilet →
          </Link>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-soft">
          <p className="text-sm font-bold uppercase tracking-wider text-sage-deep">
            Fatura të hapura
          </p>
          <p className="mt-2 font-display text-3xl font-semibold">
            {openInvoices.length > 0 ? formatMoney(openTotal) : "0 €"}
          </p>
          <Link href="/portali/faturat" className="mt-2 inline-block text-sm font-bold text-terracotta hover:underline">
            Shiko faturat →
          </Link>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-soft">
          <p className="text-sm font-bold uppercase tracking-wider text-sage-deep">Prezenca</p>
          <p className="mt-2 font-display text-3xl font-semibold">
            {recentAttendance.filter((a) => a.status === "PRESENT").length}
            <span className="text-base font-normal text-ink-soft"> / {recentAttendance.length} ditët e fundit</span>
          </p>
          <Link href="/portali/prezenca" className="mt-2 inline-block text-sm font-bold text-terracotta hover:underline">
            Historiku i plotë →
          </Link>
        </div>
      </div>

      {openInvoices.length > 0 && (
        <section className="rounded-3xl bg-white p-6 shadow-soft">
          <h2 className="font-display text-xl font-semibold">Fatura për pagesë</h2>
          <ul className="mt-4 divide-y divide-ink/5">
            {openInvoices.map((inv) => (
              <li key={inv.id}>
                <Link
                  href={`/portali/faturat/${inv.id}`}
                  className="flex flex-wrap items-center justify-between gap-2 py-3 transition-colors hover:text-terracotta"
                >
                  <div>
                    <p className="font-semibold">{inv.title}</p>
                    <p className="text-sm text-ink-soft">
                      Afati: {formatShortDate(inv.dueAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-display font-semibold">
                      {formatMoney(inv.amountCents, inv.currency)}
                    </span>
                    <StatusBadge status={inv.status} />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="rounded-3xl bg-white p-6 shadow-soft">
        <h2 className="font-display text-xl font-semibold">Prezenca e fundit</h2>
        <ul className="mt-4 divide-y divide-ink/5">
          {recentAttendance.map((a) => (
            <li key={a.id} className="flex items-center justify-between py-2.5">
              <span className="text-sm">
                <span className="font-semibold">{a.child.firstName}</span>{" "}
                <span className="text-ink-soft">· {formatShortDate(a.date)}</span>
              </span>
              <StatusBadge status={a.status} />
            </li>
          ))}
          {recentAttendance.length === 0 && (
            <li className="py-3 text-sm text-ink-soft">Ende pa të dhëna prezence.</li>
          )}
        </ul>
      </section>

      <section className="rounded-3xl bg-sage/10 p-6">
        <h2 className="font-display text-lg font-semibold">Fëmijët tuaj</h2>
        <div className="mt-3 flex flex-wrap gap-3">
          {children.map((c) => (
            <Link
              key={c.id}
              href="/portali/femijet"
              className="rounded-2xl bg-white px-5 py-3 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift"
            >
              <p className="font-display font-semibold">
                {c.firstName} {c.lastName}
              </p>
              {c.birthday && (
                <p className="text-xs text-ink-soft">{ageFromBirthday(c.birthday)} vjeç</p>
              )}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
