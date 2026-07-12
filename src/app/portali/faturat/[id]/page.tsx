import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { getSettings } from "@/lib/settings";
import { formatMoney, formatDate, formatShortDate } from "@/lib/format";
import { StatusBadge } from "@/components/ui";
import { IconEuro, IconBank } from "@/components/icons";

export default async function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireUser("PARENT");
  const [invoice, settings] = await Promise.all([
    db.invoice.findFirst({
      where: { id, parentId: user.id },
      include: { child: true, payments: { orderBy: { paidAt: "desc" } } },
    }),
    getSettings(),
  ]);
  if (!invoice) notFound();

  const paid = invoice.payments.reduce((s, p) => s + p.amountCents, 0);
  const remaining = Math.max(0, invoice.amountCents - paid);
  const isOpen = invoice.status === "SENT" || invoice.status === "OVERDUE";
  const hasBank = settings.bank_name && settings.bank_account;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link href="/portali/faturat" className="text-sm font-bold text-terracotta hover:underline">
        ← Kthehu te faturat
      </Link>

      <div className="rounded-3xl bg-white p-8 shadow-soft">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-ink-soft">
              Fatura {invoice.number}
            </p>
            <h1 className="mt-1 font-display text-2xl font-semibold">{invoice.title}</h1>
            {invoice.child && (
              <p className="mt-1 text-sm text-ink-soft">
                Për: {invoice.child.firstName} {invoice.child.lastName}
              </p>
            )}
          </div>
          <StatusBadge status={invoice.status} />
        </div>

        {invoice.description && (
          <p className="mt-4 text-sm leading-relaxed text-ink-soft">{invoice.description}</p>
        )}

        <dl className="mt-6 grid gap-4 rounded-2xl bg-cream p-5 text-sm sm:grid-cols-3">
          <div>
            <dt className="font-bold text-ink-soft">Lëshuar</dt>
            <dd className="mt-0.5 font-semibold">{formatShortDate(invoice.issuedAt)}</dd>
          </div>
          <div>
            <dt className="font-bold text-ink-soft">Afati</dt>
            <dd className="mt-0.5 font-semibold">{formatShortDate(invoice.dueAt)}</dd>
          </div>
          <div>
            <dt className="font-bold text-ink-soft">Shuma</dt>
            <dd className="mt-0.5 font-display text-lg font-semibold">
              {formatMoney(invoice.amountCents, invoice.currency)}
            </dd>
          </div>
        </dl>

        {isOpen && remaining > 0 && (
          <div className="mt-6 rounded-2xl bg-sun/15 p-5">
            <p className="font-display font-semibold">
              Për pagesë: {formatMoney(remaining, invoice.currency)}
            </p>
            <div className="mt-3 space-y-2 text-sm leading-relaxed text-ink-soft">
              <p className="flex gap-2">
                <IconEuro className="mt-0.5 h-4 w-4 shrink-0" />
                <span><strong>Në qendër:</strong> paguani me para në dorë te administrata — kuponi ju jepet menjëherë.</span>
              </p>
              {hasBank ? (
                <p className="flex gap-2">
                  <IconBank className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>
                    <strong>Me bankë:</strong> {settings.bank_name}, llogaria{" "}
                    <span className="font-mono">{settings.bank_account}</span> ({settings.bank_holder}).
                    Në përshkrim shënoni numrin e faturës: <strong>{invoice.number}</strong>.
                  </span>
                </p>
              ) : (
                <p className="flex gap-2">
                  <IconBank className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>
                    <strong>Me bankë:</strong> na kontaktoni në {settings.phone} për të dhënat
                    bankare.
                  </span>
                </p>
              )}
            </div>
          </div>
        )}

        {invoice.payments.length > 0 && (
          <div className="mt-6">
            <h2 className="font-display text-lg font-semibold">Pagesat</h2>
            <ul className="mt-3 divide-y divide-ink/5">
              {invoice.payments.map((p) => (
                <li key={p.id} className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm">
                  <div>
                    <p className="font-semibold">
                      {formatMoney(p.amountCents, invoice.currency)}{" "}
                      <span className="font-normal text-ink-soft">
                        · {p.method === "CASH" ? "Në qendër" : p.method === "BANK" ? "Bankë" : p.method === "CARD" ? "Kartelë" : "Tjetër"}
                      </span>
                    </p>
                    <p className="text-xs text-ink-soft">{formatDate(p.paidAt)}</p>
                  </div>
                  <Link
                    href={`/portali/kuponi/${p.id}`}
                    className="rounded-full border border-sage px-4 py-1.5 text-xs font-bold text-sage-deep transition-colors hover:bg-sage hover:text-white"
                  >
                    Shkarko kuponin
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
