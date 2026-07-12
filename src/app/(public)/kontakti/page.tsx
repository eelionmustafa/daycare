import type { Metadata } from "next";
import { getSettings } from "@/lib/settings";
import { submitContact } from "@/app/actions/public";
import { Field, SubmitButton } from "@/components/ui";
import { Reveal } from "@/components/Reveal";
import { IconPin, IconPhone, IconMail, IconClock } from "@/components/icons";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Kontakti — Na gjeni dhe na shkruani",
  description:
    "Adresa, telefoni, orari dhe formulari i kontaktit i qendrës Mësimi Kreativ. Ejani për një vizitë!",
};

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ sukses?: string; gabim?: string }>;
}) {
  const [{ sukses, gabim }, s] = await Promise.all([searchParams, getSettings()]);

  const infoItems = [
    { icon: <IconPin className="h-7 w-7" />, label: "Adresa", value: s.address },
    { icon: <IconPhone className="h-7 w-7" />, label: "Telefoni", value: s.phone, href: `tel:${s.phone.replace(/\s/g, "")}` },
    { icon: <IconMail className="h-7 w-7" />, label: "Email", value: s.email, href: `mailto:${s.email}` },
    { icon: <IconClock className="h-7 w-7" />, label: "Orari", value: s.hours },
  ];

  return (
    <div className="pt-24 pb-20">
      <section className="texture-paper bg-blush/50 py-14 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-terracotta">
              Kontakti
            </p>
            <h1 className="mt-3 font-display text-4xl font-semibold sm:text-5xl">
              Dera jonë është <span className="underline-hand">gjithmonë e hapur</span>
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-ink-soft">
              Na telefononi, na shkruani ose thjesht ejani — vizita njohëse është gjithmonë
              e mirëseardhur dhe pa asnjë obligim.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-4 pt-14 sm:px-6 lg:grid-cols-[1fr_1.1fr]">
        <div className="space-y-6">
          <Reveal>
            <div className="grid gap-4 sm:grid-cols-2">
              {infoItems.map((item) => (
                <div key={item.label} className="rounded-2xl bg-white p-5 shadow-soft">
                  <span aria-hidden className="inline-block text-ink-soft">{item.icon}</span>
                  <p className="mt-2 text-xs font-bold uppercase tracking-wider text-sage-deep">
                    {item.label}
                  </p>
                  {item.href ? (
                    <a href={item.href} className="mt-1 block font-semibold text-ink hover:text-terracotta">
                      {item.value}
                    </a>
                  ) : (
                    <p className="mt-1 font-semibold text-ink">{item.value}</p>
                  )}
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="overflow-hidden rounded-3xl shadow-soft">
              <iframe
                title="Harta — Mësimi Kreativ"
                src={`https://www.google.com/maps?q=${encodeURIComponent(s.maps_query)}&output=embed`}
                className="h-72 w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <a
              href={s.facebook_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-2xl bg-sky/10 p-5 transition-colors hover:bg-sky/20"
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" className="text-sky" aria-hidden>
                <path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12Z" />
              </svg>
              <div>
                <p className="font-bold text-sky">Na ndiqni në Facebook</p>
                <p className="text-sm text-ink-soft">
                  Aty ndajmë çdo ditë fotot dhe njoftimet më të reja.
                </p>
              </div>
            </a>
          </Reveal>
        </div>

        <Reveal delay={0.05}>
          <div className="rounded-3xl bg-white p-8 shadow-lift sm:p-10">
            <h2 className="font-display text-2xl font-semibold">Na shkruani</h2>
            <p className="mt-2 text-ink-soft">
              Përgjigjemi zakonisht brenda pak orësh gjatë ditës së punës.
            </p>
            {sukses && (
              <p className="mt-4 rounded-xl bg-sage/15 px-4 py-3 text-sm font-semibold text-sage-deep">
                Faleminderit! Mesazhi juaj u dërgua — ju kontaktojmë së shpejti.
              </p>
            )}
            {gabim && (
              <p className="mt-4 rounded-xl bg-terracotta/10 px-4 py-3 text-sm font-semibold text-terracotta-deep">
                Diçka nuk shkoi. Kontrolloni fushat dhe provoni përsëri.
              </p>
            )}
            <form action={submitContact} className="mt-6 space-y-4">
              <Field label="Emri juaj" name="name" required placeholder="Emri dhe mbiemri" />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Telefoni" name="phone" type="tel" placeholder="+383 4X XXX XXX" />
                <Field label="Email" name="email" type="email" placeholder="ju@email.com" />
              </div>
              <Field
                label="Mesazhi"
                name="message"
                type="textarea"
                required
                placeholder="Si mund t'ju ndihmojmë?"
              />
              <SubmitButton>Dërgo mesazhin</SubmitButton>
            </form>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
