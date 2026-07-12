import Link from "next/link";
import { getSettings } from "@/lib/settings";
import { Hero, type HeroPhoto } from "@/components/home/Hero";
import { Reveal, RevealStagger, RevealItem } from "@/components/Reveal";
import { SectionHeading } from "@/components/ui";
import {
  IconBook,
  IconPalette,
  IconBall,
  IconSprout,
  IconTarget,
  IconClock,
  IconBackpack,
} from "@/components/icons";

export const dynamic = "force-dynamic";

const services = [
  {
    icon: <IconTarget />,
    title: "Aktivitet mbështetës arsimor",
    text: "Aktivitete të përditshme që mbështesin dhe forcojnë mësimin e fëmijës në shkollë.",
  },
  {
    icon: <IconSprout />,
    title: "Mësimnxënie",
    text: "Nxitje e të mësuarit përmes përvojës, kuriozitetit dhe pyetjeve — jo vetëm memorizim.",
  },
  {
    icon: <IconClock />,
    title: "Qëndrim ditor",
    text: "Kujdes dhe mbikëqyrje çdo ditë, nga mëngjesi deri te dera e shkollës e prapë.",
  },
  {
    icon: <IconBackpack />,
    title: "Asistencë në detyra të shtëpisë",
    text: "Ndihmë e drejtpërdrejtë me detyrat e shtëpisë, me ritmin dhe nevojat e secilit fëmijë.",
  },
  {
    icon: <IconBook />,
    title: "Mësim plotësues",
    text: "Orë shtesë për fëmijët që kanë nevojë për më shumë kohë me një lëndë të caktuar.",
  },
];

const benefits = [
  {
    icon: <IconSprout />,
    title: "Vetëbesim që rritet nga brenda",
    text: "Çdo detyrë e përfunduar vetë, çdo vizatim i lavdëruar — hapa të vegjël që ndërtojnë besim të vërtetë.",
  },
  {
    icon: <IconPalette />,
    title: "Krijimtari e vazhdueshme",
    text: "Vizatim, punime dore dhe projekte grupi që i japin fëmijës mënyra të reja për t'u shprehur.",
  },
  {
    icon: <IconBall />,
    title: "Miqësi dhe bashkëpunim",
    text: "Lojërat dhe aktivitetet në grup i mësojnë fëmijët të presin radhën, të ndihmojnë dhe të bashkëpunojnë.",
  },
  {
    icon: <IconTarget />,
    title: "Ndihmë e përshtatur kur nevojitet",
    text: "Për ata që kanë nevojë për më shumë kohë me një lëndë, ofrojmë orë shtesë pas orarit shkollor.",
  },
];

const HERO_PLACEHOLDER_PHOTOS: HeroPhoto[] = Array.from({ length: 4 }, (_, i) => ({
  id: `hero-placeholder-${i + 1}`,
  url: `/gallery/kujtim-${String(i + 1).padStart(2, "0")}.svg`,
  caption: null,
  width: 1200,
  height: 900,
}));

export default async function HomePage() {
  const settings = await getSettings();

  return (
    <>
      <Hero
        headline={settings.hero_headline}
        subline={settings.hero_subline}
        photos={HERO_PLACEHOLDER_PHOTOS}
      />

      {/* What we offer */}
      <section className="texture-paper bg-paper py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal>
            <SectionHeading
              eyebrow="Ne ofrojmë"
              title="Çfarë përfshin programi ynë"
            />
          </Reveal>
          <RevealStagger className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {services.map((s) => (
              <RevealItem key={s.title}>
                <div className="h-full rounded-3xl bg-white p-7 shadow-soft transition-shadow hover:shadow-lift">
                  <span aria-hidden className="inline-block text-terracotta [&>svg]:h-9 [&>svg]:w-9">
                    {s.icon}
                  </span>
                  <h3 className="mt-4 font-display text-xl font-semibold">{s.title}</h3>
                  <p className="mt-2 leading-relaxed text-ink-soft">{s.text}</p>
                </div>
              </RevealItem>
            ))}
          </RevealStagger>
        </div>
      </section>

      {/* What the child gains */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <Reveal>
          <SectionHeading
            eyebrow="Çfarë fiton fëmija juaj"
            title="Rritje çdo ditë, në mënyra të ndryshme"
            intro="Mësimi Kreativ ofron një program edukativo-arsimor që synon të jetë një dorë përkrahëse për fëmijët që, për arsye të ndryshme, shënojnë ngecje në përvetësimin e lëndëve të caktuara shkollore. Ndihmojmë në zhvillimin e të menduarit kritik, përkrahim nxënësit në zgjidhjen e detyrave të shtëpisë dhe nxisim kreativitetin përmes aktiviteteve të ndryshme edukative."
          />
        </Reveal>
        <RevealStagger className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((b) => (
            <RevealItem key={b.title}>
              <div className="h-full rounded-3xl bg-sage/10 p-7 transition-colors hover:bg-sage/15">
                <span aria-hidden className="inline-block text-sage-deep [&>svg]:h-9 [&>svg]:w-9">
                  {b.icon}
                </span>
                <h3 className="mt-4 font-display text-xl font-semibold">{b.title}</h3>
                <p className="mt-2 leading-relaxed text-ink-soft">{b.text}</p>
              </div>
            </RevealItem>
          ))}
        </RevealStagger>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <Reveal>
          <div className="texture-paper relative overflow-hidden rounded-[2.5rem] bg-terracotta px-6 py-14 text-center text-white sm:px-12 sm:py-16">
            <div aria-hidden className="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-sun/25 blur-2xl" />
            <div aria-hidden className="absolute -bottom-12 -right-8 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
            <h2 className="relative font-display text-3xl font-semibold sm:text-4xl">
              Kontaktoni qendrën
            </h2>
            <p className="relative mx-auto mt-4 max-w-xl text-lg text-white/85">
              Regjistroni fëmijën online ose caktoni një vizitë në qendër.
            </p>
            <div className="relative mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/regjistrohu"
                className="rounded-full bg-white px-7 py-3.5 font-bold text-terracotta-deep shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift"
              >
                Regjistro fëmijën
              </Link>
              <Link
                href="/kontakti"
                className="rounded-full border-2 border-white/60 px-7 py-3.5 font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-white/10"
              >
                Caktoni një vizitë
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
