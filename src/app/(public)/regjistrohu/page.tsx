import type { Metadata } from "next";
import Link from "next/link";
import { getSettings } from "@/lib/settings";
import { submitEnrollment } from "@/app/actions/public";
import { Field, SubmitButton } from "@/components/ui";
import { Reveal } from "@/components/Reveal";
import { IconConfetti, IconUser, IconChild, IconAlert, IconNote } from "@/components/icons";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Regjistro fëmijën — Aplikimi online",
  description:
    "Regjistroni fëmijën tuaj në Mësimi Kreativ me formularin online — merr vetëm dy minuta, dhe ju kontaktojmë brenda ditës.",
};

const steps = [
  { n: "1", title: "Plotësoni formularin", text: "Dy minuta — vetëm të dhënat bazë." },
  { n: "2", title: "Ju kontaktojmë", text: "Brenda ditës, për një bisedë të shkurtër njohëse." },
  { n: "3", title: "Vizita njohëse", text: "Ejani me fëmijën, shihni ambientin, njihuni me stafin." },
  { n: "4", title: "Mirë se erdhët!", text: "Fëmija juaj bëhet pjesë e Mësimit Kreativ." },
];

export default async function EnrollPage({
  searchParams,
}: {
  searchParams: Promise<{ sukses?: string; gabim?: string }>;
}) {
  const [{ sukses, gabim }, s] = await Promise.all([searchParams, getSettings()]);

  if (sukses) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 pt-24 pb-16">
        <Reveal className="w-full max-w-lg">
          <div className="rounded-3xl bg-white p-10 text-center shadow-lift">
            <IconConfetti className="mx-auto h-14 w-14 text-terracotta" />
            <h1 className="mt-4 font-display text-3xl font-semibold">
              Aplikimi u dërgua me sukses!
            </h1>
            <p className="mt-4 leading-relaxed text-ink-soft">
              Faleminderit për besimin! Do t&apos;ju kontaktojmë brenda ditës në numrin që
              latë, për të caktuar një vizitë njohëse. Ndërkohë, ndiquni fotot tona më të
              reja në Facebook.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/galeria"
                className="rounded-full bg-terracotta px-6 py-3 font-bold text-white shadow-soft transition-all hover:bg-terracotta-deep"
              >
                Shiko galerinë
              </Link>
              <Link
                href="/"
                className="rounded-full border-2 border-ink/10 px-6 py-3 font-bold text-ink transition-colors hover:border-sage"
              >
                Kthehu në ballinë
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20">
      <section className="texture-paper bg-blush/50 py-14 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-terracotta">
              Regjistrimi online
            </p>
            <h1 className="mt-3 font-display text-4xl font-semibold sm:text-5xl">
              Regjistro fëmijën <span className="underline-hand">online</span>
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-ink-soft">
              Plotësoni formularin. Nëse preferoni
              bisedën direkte, na telefononi në{" "}
              <a href={`tel:${s.phone.replace(/\s/g, "")}`} className="font-bold text-terracotta">
                {s.phone}
              </a>
              .
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pt-14 sm:px-6">
        <Reveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((st) => (
              <div key={st.n} className="rounded-2xl bg-white p-5 shadow-soft">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sun font-display font-semibold text-ink">
                  {st.n}
                </span>
                <h3 className="mt-3 font-display font-semibold">{st.title}</h3>
                <p className="mt-1 text-sm text-ink-soft">{st.text}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.1} className="mx-auto mt-12 max-w-2xl">
          <div className="rounded-3xl bg-white p-8 shadow-lift sm:p-10">
            {gabim && (
              <p className="mb-6 rounded-xl bg-terracotta/10 px-4 py-3 text-sm font-semibold text-terracotta-deep">
                Diçka nuk shkoi me të dhënat. Ju lutemi kontrolloni fushat e detyrueshme dhe
                provoni përsëri.
              </p>
            )}
            <form action={submitEnrollment} className="space-y-8">
              <fieldset className="space-y-4">
                <legend className="flex items-center gap-2 font-display text-xl font-semibold">
                  <IconUser className="h-5.5 w-5.5 text-ink-soft" /> Të dhënat e prindit
                </legend>
                <Field label="Emri dhe mbiemri" name="parentName" required />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Telefoni" name="phone" type="tel" required placeholder="+383 4X XXX XXX" />
                  <Field label="Email" name="email" type="email" placeholder="ju@email.com" />
                </div>
              </fieldset>

              <fieldset className="space-y-4">
                <legend className="flex items-center gap-2 font-display text-xl font-semibold">
                  <IconChild className="h-5.5 w-5.5 text-ink-soft" /> Të dhënat e fëmijës
                </legend>
                <Field label="Emri dhe mbiemri i fëmijës" name="childName" required />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Mosha" name="childAge" type="number" placeholder="p.sh. 8" />
                  <Field label="Ditëlindja" name="childBirthday" type="date" />
                </div>
              </fieldset>

              <fieldset className="space-y-4">
                <legend className="flex items-center gap-2 font-display text-xl font-semibold">
                  <IconAlert className="h-5.5 w-5.5 text-ink-soft" /> Kontakti emergjent{" "}
                  <span className="text-sm font-normal text-ink-soft">(opsionale)</span>
                </legend>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Emri" name="emergencyName" />
                  <Field label="Telefoni" name="emergencyPhone" type="tel" />
                </div>
              </fieldset>

              <fieldset className="space-y-4">
                <legend className="flex items-center gap-2 font-display text-xl font-semibold">
                  <IconNote className="h-5.5 w-5.5 text-ink-soft" /> Informata shtesë{" "}
                  <span className="text-sm font-normal text-ink-soft">(opsionale)</span>
                </legend>
                <Field
                  label="Përvoja e mëparshme me çerdhe/qendra"
                  name="previousCare"
                  placeholder="p.sh. ka ndjekur një qendër tjetër më parë"
                />
                <Field
                  label="Shënime për fëmijën"
                  name="notes"
                  type="textarea"
                  placeholder="Alergji, interesa, gjëra që duhet t'i dimë..."
                  hint="Çdo detaj që na ndihmon ta presim fëmijën tuaj sa më mirë."
                />
              </fieldset>

              <SubmitButton>Dërgo aplikimin</SubmitButton>
              <p className="text-center text-xs text-ink-soft">
                Të dhënat tuaja përdoren vetëm për procesin e regjistrimit dhe nuk ndahen me
                askënd tjetër.
              </p>
            </form>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
