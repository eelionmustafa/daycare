import Link from "next/link";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { formatMoney, formatShortDate } from "@/lib/format";
import { StatusBadge } from "@/components/ui";

export default async function InvoicesPage() {
  const user = await requireUser("PARENT");
  const invoices = await db.invoice.findMany({
    where: { parentId: user.id, status: { not: "DRAFT" } },
    orderBy: { issuedAt: "desc" },
    include: { child: true },
  });

  const open = invoices.filter((i) => i.status === "SENT" || i.status === "OVERDUE");
  const openTotal = open.reduce((s, i) => s + i.amountCents, 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-semibold">Faturat</h1>
        <p className="mt-1 text-ink-soft">
          Historiku i faturave dhe pagesave tuaja. Klikoni një faturë për detajet dhe
          kuponat.
        </p>
      </div>

      {open.length > 0 && (
        <div className="rounded-3xl bg-sun/15 p-6">
          <p className="font-display text-lg font-semibold">
            Keni {open.length} faturë{open.length > 1 ? "" : ""} të hapur —{" "}
            {formatMoney(openTotal)}
          </p>
          <p className="mt-1 text-sm text-ink-soft">
            Mund të paguani në qendër ose me transfertë bankare. Detajet i gjeni brenda
            faturës.
          </p>
        </div>
      )}

      <div className="overflow-hidden rounded-3xl bg-white shadow-soft">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-ink/10 text-xs font-bold uppercase tracking-wider text-ink-soft">
              <th className="px-6 py-4">Fatura</th>
              <th className="hidden px-4 py-4 sm:table-cell">Fëmija</th>
              <th className="hidden px-4 py-4 sm:table-cell">Afati</th>
              <th className="px-4 py-4">Shuma</th>
              <th className="px-6 py-4">Statusi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/5">
            {invoices.map((inv) => (
              <tr key={inv.id} className="transition-colors hover:bg-cream/70">
                <td className="px-6 py-4">
                  <Link href={`/portali/faturat/${inv.id}`} className="font-semibold text-ink hover:text-terracotta">
                    {inv.title}
                    <span className="block text-xs font-normal text-ink-soft">{inv.number}</span>
                  </Link>
                </td>
                <td className="hidden px-4 py-4 text-ink-soft sm:table-cell">
                  {inv.child ? inv.child.firstName : "—"}
                </td>
                <td className="hidden px-4 py-4 text-ink-soft sm:table-cell">
                  {formatShortDate(inv.dueAt)}
                </td>
                <td className="px-4 py-4 font-display font-semibold">
                  {formatMoney(inv.amountCents, inv.currency)}
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={inv.status} />
                </td>
              </tr>
            ))}
            {invoices.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-ink-soft">
                  Ende nuk keni fatura.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
