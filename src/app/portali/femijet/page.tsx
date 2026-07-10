import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { formatDate, ageFromBirthday } from "@/lib/format";

export default async function ChildrenPage() {
  const user = await requireUser("PARENT");
  const children = await db.child.findMany({
    where: { parentId: user.id },
    orderBy: { firstName: "asc" },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-semibold">Fëmijët e mi</h1>
        <p className="mt-1 text-ink-soft">
          Të dhënat që mban qendra për fëmijët tuaj. Për ndryshime, kontaktoni stafin.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {children.map((c) => (
          <article key={c.id} className="rounded-3xl bg-white p-7 shadow-soft">
            <div className="flex items-center gap-4">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-sun font-display text-2xl font-semibold text-ink" aria-hidden>
                {c.firstName.charAt(0)}
              </span>
              <div>
                <h2 className="font-display text-xl font-semibold">
                  {c.firstName} {c.lastName}
                </h2>
                {c.birthday && (
                  <p className="text-sm text-ink-soft">
                    {ageFromBirthday(c.birthday)} vjeç · {formatDate(c.birthday)}
                  </p>
                )}
              </div>
              {!c.active && (
                <span className="ml-auto rounded-full bg-ink/10 px-3 py-1 text-xs font-bold text-ink-soft">
                  Joaktiv
                </span>
              )}
            </div>

            <dl className="mt-6 space-y-4 text-sm">
              <div>
                <dt className="font-bold uppercase tracking-wider text-sage-deep">Prindi</dt>
                <dd className="mt-1 text-ink">
                  {user.name} {user.phone ? `· ${user.phone}` : ""} · {user.email}
                </dd>
              </div>
              {(c.emergencyName || c.emergencyPhone) && (
                <div>
                  <dt className="font-bold uppercase tracking-wider text-sage-deep">
                    Kontakti emergjent
                  </dt>
                  <dd className="mt-1 text-ink">
                    {c.emergencyName}
                    {c.emergencyRelation ? ` (${c.emergencyRelation})` : ""}
                    {c.emergencyPhone ? ` · ${c.emergencyPhone}` : ""}
                  </dd>
                </div>
              )}
              {c.notes && (
                <div>
                  <dt className="font-bold uppercase tracking-wider text-sage-deep">
                    Shënime të rëndësishme
                  </dt>
                  <dd className="mt-1 rounded-xl bg-blush/60 px-4 py-3 leading-relaxed text-ink">
                    {c.notes}
                  </dd>
                </div>
              )}
            </dl>
          </article>
        ))}
        {children.length === 0 && (
          <p className="text-ink-soft">
            Ende nuk ka fëmijë të regjistruar në llogarinë tuaj. Kontaktoni qendrën.
          </p>
        )}
      </div>
    </div>
  );
}
