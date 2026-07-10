import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { formatShortDate, formatWeekday } from "@/lib/format";
import { StatusBadge } from "@/components/ui";

export default async function AttendancePage() {
  const user = await requireUser("PARENT");
  const children = await db.child.findMany({
    where: { parentId: user.id },
    orderBy: { firstName: "asc" },
    include: {
      attendance: { orderBy: { date: "desc" }, take: 30 },
    },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-semibold">Prezenca</h1>
        <p className="mt-1 text-ink-soft">
          Prezenca mbahet çdo ditë nga stafi ynë. Këtu shihni 30 ditët e fundit për secilin
          fëmijë.
        </p>
      </div>

      {children.map((c) => {
        const present = c.attendance.filter((a) => a.status === "PRESENT").length;
        return (
          <section key={c.id} className="rounded-3xl bg-white p-6 shadow-soft">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-display text-xl font-semibold">
                {c.firstName} {c.lastName}
              </h2>
              {c.attendance.length > 0 && (
                <p className="text-sm font-semibold text-sage-deep">
                  {present} nga {c.attendance.length} ditë i pranishëm
                </p>
              )}
            </div>
            {c.attendance.length === 0 ? (
              <p className="mt-4 text-sm text-ink-soft">Ende pa të dhëna prezence.</p>
            ) : (
              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[28rem] text-left text-sm">
                  <thead>
                    <tr className="border-b border-ink/10 text-xs font-bold uppercase tracking-wider text-ink-soft">
                      <th className="py-2 pr-4">Data</th>
                      <th className="py-2 pr-4">Dita</th>
                      <th className="py-2 pr-4">Statusi</th>
                      <th className="py-2">Shënim</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink/5">
                    {c.attendance.map((a) => (
                      <tr key={a.id}>
                        <td className="py-2.5 pr-4 font-semibold">{formatShortDate(a.date)}</td>
                        <td className="py-2.5 pr-4 text-ink-soft">{formatWeekday(a.date)}</td>
                        <td className="py-2.5 pr-4">
                          <StatusBadge status={a.status} />
                        </td>
                        <td className="py-2.5 text-ink-soft">{a.note ?? "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
