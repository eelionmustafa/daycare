import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { getSettings } from "@/lib/settings";
import { formatMoney, formatDate } from "@/lib/format";
import { PrintButton } from "@/components/PrintButton";

export default async function ReceiptPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireUser("PARENT");
  const [payment, settings] = await Promise.all([
    db.payment.findFirst({
      where: { id, invoice: { parentId: user.id } },
      include: { invoice: { include: { child: true, parent: true } } },
    }),
    getSettings(),
  ]);
  if (!payment) notFound();

  const inv = payment.invoice;
  const methodLabel =
    payment.method === "CASH" ? "Para në dorë" :
    payment.method === "BANK" ? "Transfertë bankare" :
    payment.method === "CARD" ? "Kartelë" : "Tjetër";

  return (
    <div className="mx-auto max-w-lg">
      <div className="no-print mb-6 flex items-center justify-between">
        <Link href={`/portali/faturat/${inv.id}`} className="text-sm font-bold text-terracotta hover:underline">
          ← Kthehu te fatura
        </Link>
        <PrintButton />
      </div>

      <div className="rounded-3xl border border-ink/10 bg-white p-8">
        <div className="flex items-center justify-between border-b border-dashed border-ink/20 pb-5">
          <div>
            <p className="font-display text-xl font-semibold">{settings.site_name}</p>
            <p className="text-xs text-ink-soft">{settings.address}</p>
            <p className="text-xs text-ink-soft">{settings.phone} · {settings.email}</p>
          </div>
          <span className="text-3xl" aria-hidden>☀️</span>
        </div>

        <div className="py-5 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-ink-soft">
            Kupon pagese
          </p>
          <p className="mt-1 font-display text-lg font-semibold">{payment.receiptNo}</p>
        </div>

        <dl className="space-y-3 border-t border-dashed border-ink/20 pt-5 text-sm">
          <div className="flex justify-between">
            <dt className="text-ink-soft">Data e pagesës</dt>
            <dd className="font-semibold">{formatDate(payment.paidAt)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink-soft">Paguar nga</dt>
            <dd className="font-semibold">{inv.parent.name}</dd>
          </div>
          {inv.child && (
            <div className="flex justify-between">
              <dt className="text-ink-soft">Për fëmijën</dt>
              <dd className="font-semibold">{inv.child.firstName} {inv.child.lastName}</dd>
            </div>
          )}
          <div className="flex justify-between">
            <dt className="text-ink-soft">Fatura</dt>
            <dd className="font-semibold">{inv.number} — {inv.title}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink-soft">Mënyra e pagesës</dt>
            <dd className="font-semibold">{methodLabel}</dd>
          </div>
          {payment.note && (
            <div className="flex justify-between">
              <dt className="text-ink-soft">Shënim</dt>
              <dd className="font-semibold">{payment.note}</dd>
            </div>
          )}
        </dl>

        <div className="mt-5 flex items-center justify-between rounded-2xl bg-cream px-5 py-4">
          <span className="font-bold">Shuma e paguar</span>
          <span className="font-display text-2xl font-semibold">
            {formatMoney(payment.amountCents, inv.currency)}
          </span>
        </div>

        <p className="mt-6 text-center text-xs text-ink-soft">
          Faleminderit për besimin! — {settings.site_name}
        </p>
      </div>
    </div>
  );
}
