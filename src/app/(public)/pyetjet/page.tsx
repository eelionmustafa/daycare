import type { Metadata } from "next";
import Link from "next/link";
import { getSettings } from "@/lib/settings";
import { Reveal } from "@/components/Reveal";
import { FaqList } from "@/components/FaqList";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Pyetje të shpeshta",
  description:
    "Përgjigjet e pyetjeve më të shpeshta të prindërve: moshat, regjistrimi, orari, aktivitetet, prezenca dhe pagesat.",
};

export default async function FaqPage() {
  const s = await getSettings();

  const faqs = [
    {
      q: "Çfarë moshash pranoni?",
      a: `Pranojmë fëmijë të moshës ${s.ages} — pra fëmijë të shkollës fillore. Nëse fëmija juaj është afër këtyre moshave, na kontaktoni dhe e shohim bashkë rastin.`,
    },
    {
      q: "Si ta regjistroj fëmijën tim?",
      a: "Plotësoni formularin online te faqja 'Regjistro fëmijën' — merr vetëm dy minuta. Ne ju kontaktojmë brenda ditës për të caktuar një vizitë njohëse. Regjistrimi bëhet edhe me telefon ose duke ardhur direkt në qendër.",
    },
    {
      q: "Çfarë aktivitetesh bëjnë fëmijët?",
      a: "Fëmijët bëjnë detyrat e shtëpisë dhe përgatiten për teste në lëndë të ndryshme, bëjnë aktivitete kreative, dalin në park e natyrë dhe festojnë festat zyrtare bashkë. Për ata që kanë nevojë për ndihmë shtesë, ofrojmë edhe orë shtesë si kurse. Galeria jonë tregon më së miri si duket kjo në praktikë.",
    },
    {
      q: "Cili është orari juaj?",
      a: `Jemi të hapur ${s.hours}. Nga ora 07:00 deri në 12:30 fëmijët hanë mëngjes e drekë, bëjnë detyrat e shtëpisë, përgatiten për teste, bëjnë aktivitete dhe dalin në park. Në orën 13:00 mësueset i dërgojnë vetë në shkollë. Pas orarit shkollor, mësueset i marrin përsëri dhe fëmijët presin te qendra derisa vijnë prindërit, më së largu deri në 17:30.`,
    },
    {
      q: "Si mund ta kontaktoj qendrën?",
      a: `Na telefononi në ${s.phone}, na shkruani në ${s.email}, ose përdorni formularin e kontaktit. Përgjigjemi gjatë orarit ${s.hours}. Edhe dera jonë është gjithmonë e hapur — ejani për një kafe dhe një vizitë.`,
    },
    {
      q: "A mund ta vizitoj qendrën para se të vendos?",
      a: "Patjetër — madje e inkurajojmë! Ejani bashkë me fëmijën, shihni ambientet, njihuni me stafin dhe qëndroni sa të doni. Vizita nuk ju obligon për asgjë.",
    },
    {
      q: "Kush i shoqëron fëmijët në shkollë?",
      a: "Mësueset tona i dërgojnë vetë fëmijët në shkollë në orën 13:00, të ushqyer dhe të përgatitur. Pas mbarimit të orarit shkollor, po mësueset i marrin dhe i kthejnë te qendra derisa vijnë prindërit.",
    },
    {
      q: "A ofroni ndihmë shtesë për fëmijët që kanë vështirësi me mësimet?",
      a: "Po — për fëmijët që kanë nevojë për më shumë kohë me një lëndë, ofrojmë orë shtesë si kurse, pas orarit shkollor. Na kontaktoni për të biseduar për nevojat specifike të fëmijës suaj.",
    },
  ];

  return (
    <div className="pt-24 pb-20">
      <section className="texture-paper bg-blush/50 py-14 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-terracotta">
              Pyetje të shpeshta
            </p>
            <h1 className="mt-3 font-display text-4xl font-semibold sm:text-5xl">
              Gjithçka që <span className="underline-hand">doni të dini</span>
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-ink-soft">
              Përgjigjet e pyetjeve që na i bëjnë më shpesh prindërit e rinj. Nuk e gjeni
              pyetjen tuaj? Pyesni asistentin tonë ose na kontaktoni direkt.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 pt-12 sm:px-6">
        <FaqList faqs={faqs} />
        <Reveal className="mt-12 rounded-3xl bg-sage/10 p-8 text-center">
          <p className="font-display text-xl font-semibold">Keni pyetje tjetër?</p>
          <p className="mt-2 text-ink-soft">
            Na kontaktoni pa hezitim — përgjigjemi me kënaqësi.
          </p>
          <Link
            href="/kontakti"
            className="mt-5 inline-block rounded-full bg-terracotta px-7 py-3 font-bold text-white shadow-soft transition-all hover:-translate-y-0.5 hover:bg-terracotta-deep"
          >
            Na shkruani
          </Link>
        </Reveal>
      </section>

      {/* FAQ structured data for search engines */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }),
        }}
      />
    </div>
  );
}
