import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { Reveal } from "@/components/Reveal";
import { StoryThread, StoryBeat, ValueCloud, PhotoConstellation } from "@/components/StoryFlow";
import {
  IconShield,
  IconPalette,
  IconSprout,
  IconHands,
  IconSparkle,
  IconTarget,
} from "@/components/icons";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Rreth nesh — Historia jonë",
  description:
    "Si lindi Mësimi Kreativ, çfarë besojmë për fëmijët dhe si duket një ditë brenda qendrës sonë.",
};

const story = [
  {
    eyebrow: "Rritja",
    title: "Zgjerimi i shërbimeve",
    text: "Me kohë shtuam më shumë aktivitete, punëtori dhe shërbime për familjet — gjithmonë duke dëgjuar se çfarë u nevojitej fëmijëve dhe prindërve.",
    accent: "terracotta" as const,
  },
  {
    eyebrow: "Sot",
    title: "Qendër për fëmijë 6-11 vjeç",
    text: "Sot Mësimi Kreativ ofron ndihmë me detyra, aktivitete kreative dhe kujdes pas shkollës — çdo ditë, në një ambient ku fëmijët njihen me emër.",
    accent: "sky" as const,
  },
];

const philosophy = [
  {
    icon: <IconShield />,
    title: "Siguria para së gjithash",
    text: "Prindërit duhet ta dinë gjithmonë se fëmija i tyre është në duar të sigurta. Prezenca mbahet çdo ditë dhe çdo detaj i rëndësishëm ndahet me familjen.",
  },
  {
    icon: <IconPalette />,
    title: "Krijimtaria si gjuhë",
    text: "Fëmijët shprehen përmes duarve: vizatojnë, ndërtojnë, ngjyrosin. Ne u japim materialet, hapësirën dhe lirinë — pjesën tjetër e bëjnë vetë.",
  },
  {
    icon: <IconSprout />,
    title: "Vetëbesimi rritet ngadalë",
    text: "Një detyrë e zgjidhur vetë, një vizatim i lavdëruar, një lojë e fituar në grup. Vetëbesimi ndërtohet me momente të vogla, çdo ditë.",
  },
  {
    icon: <IconHands />,
    title: "Shoqëria është mësim",
    text: "Të presësh radhën, të ndihmosh shokun, të kërkosh falje. Këto nuk shkruhen në fletore, por mësohen vetëm bashkë me të tjerët.",
  },
  {
    icon: <IconSparkle />,
    title: "Mësimi përmes përvojës",
    text: "Një eksperiment me ngjyra vlen sa dhjetë faqe teori. Fëmijët mësojnë duke bërë, duke provuar dhe nganjëherë duke gabuar.",
  },
  {
    icon: <IconTarget />,
    title: "Ndihmë shtesë kur nevojitet",
    text: "Për fëmijët që kanë nevojë për më shumë kohë me një lëndë, ofrojmë orë shtesë si kurse — pas orarit shkollor, derisa vijnë prindërit.",
  },
];

const dayMoments = [
  { title: "Ardhja", text: "Dyert hapen dhe qendra mbushet me zëra. Fëmijët presin njëri-tjetrin me buzëqeshje, gati për një ditë të re.", accent: "terracotta" as const },
  { title: "Mëngjesi", text: "Fëmijët hanë mëngjes bashkë, në qetësi, para se të nisë dita e mësimit.", accent: "sun" as const },
  { title: "Ora e detyrave", text: "Detyrat e shtëpisë dhe përgatitja për teste në lëndë të ndryshme, me ndihmën e mësueseve — secili me ritmin e vet.", accent: "sky" as const },
  { title: "Aktivitete & park", text: "Aktivitete kreative, dalje në park e natyrë, ose festimi i festave zyrtare kur bie rasti.", accent: "sage" as const },
  { title: "Dreka", text: "Një drekë e ngrohtë bashkë, para se fëmijët të nisen për në shkollë.", accent: "sun" as const },
  { title: "Shkolla", text: "Mësueset tona i dërgojnë vetë fëmijët në shkollë, të përgatitur dhe të qetë.", accent: "terracotta" as const },
  { title: "Rikthimi", text: "Mësueset i marrin fëmijët nga shkolla dhe kthehen te qendra. Kush ka nevojë për ndihmë shtesë, vazhdon me orë shtesë të organizuara nga ne.", accent: "sage" as const },
  { title: "Përcjellja", text: "Fëmijët presin në qetësi, me lojëra e miq, derisa vijnë prindërit t'i marrin.", accent: "sky" as const },
];

export default async function AboutPage() {
  const photos = await db.photo.findMany({
    where: { visible: true, source: "FACEBOOK" },
    orderBy: [{ featured: "desc" }, { sortOrder: "asc" }],
    take: 16,
  });
  const dayPhotos = photos.slice(0, 8);
  const communityPhotos = photos.slice(8, 16);

  return (
    <div
      className="pt-24"
      style={{
        background:
          "linear-gradient(180deg, #fdf1e9 0%, #faf6ef 18%, #faf6ef 55%, #f2f7f2 80%, #faf6ef 100%)",
      }}
    >
      {/* Opening — no eyebrow/label pattern repeated below, this is the only one */}
      <section className="mx-auto max-w-3xl px-4 pb-8 pt-12 text-center sm:px-6 sm:pt-16">
        <Reveal>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-terracotta">
            Historia jonë
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold leading-tight sm:text-5xl">
            Rreth <span className="underline-hand">Mësimit Kreativ</span>
          </h1>
        </Reveal>
      </section>

      {/* One continuous thread — origin story flows straight into philosophy
          and the daily rhythm, with photos woven in rather than boxed off. */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <StoryThread>
          {story.map((s, i) => (
            <StoryBeat
              key={s.title}
              eyebrow={s.eyebrow}
              title={s.title}
              text={s.text}
              accent={s.accent}
              align={i % 2 === 0 ? "left" : "right"}
              photo={
                dayPhotos[i]
                  ? {
                      url: dayPhotos[i].url,
                      width: dayPhotos[i].width,
                      height: dayPhotos[i].height,
                      alt: "Moment nga Mësimi Kreativ",
                    }
                  : undefined
              }
            />
          ))}

          {dayMoments.map((m, i) => (
            <StoryBeat
              key={m.title}
              title={m.title}
              text={m.text}
              accent={m.accent}
              align={(i + story.length) % 2 === 0 ? "left" : "right"}
              photo={
                dayPhotos[i + 3]
                  ? {
                      url: dayPhotos[i + 3].url,
                      width: dayPhotos[i + 3].width,
                      height: dayPhotos[i + 3].height,
                      alt: "Moment nga dita jonë",
                    }
                  : undefined
              }
            />
          ))}
        </StoryThread>
      </div>

      {/* Philosophy — a loose cloud of values, not a boxed grid section */}
      <div className="mx-auto mt-16 max-w-5xl px-4 sm:px-6">
        <Reveal className="mx-auto max-w-xl text-center">
          <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
            Bindjet që na udhëheqin
          </h2>
        </Reveal>
        <div className="mt-10">
          <ValueCloud items={philosophy} />
        </div>
      </div>

      {/* Community — a loose constellation of real photos, flowing straight
          into the closing call to action, no separate boxed-off section. */}
      <div className="mx-auto mt-20 max-w-5xl px-4 pb-24 sm:px-6">
        <Reveal className="mx-auto max-w-xl text-center">
          <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
            Komuniteti ynë
          </h2>
          <p className="mt-3 text-ink-soft">
            Foto dhe njoftime nga aktivitetet publikohen në{" "}
            <a
              href="https://www.facebook.com/mesimikreativ/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-sky hover:underline"
            >
              faqen tonë të Facebook-ut
            </a>
            .
          </p>
        </Reveal>

        {communityPhotos.length > 0 && (
          <div className="mt-12">
            <PhotoConstellation
              photos={communityPhotos.map((p) => ({
                id: p.id,
                url: p.url,
                width: p.width,
                height: p.height,
                alt: p.caption ?? "Komuniteti i Mësimit Kreativ",
              }))}
            />
          </div>
        )}

        <Reveal className="mt-16 text-center">
          <p className="font-display text-xl text-ink">
            Dëshironi që fëmija juaj të jetë pjesë e kësaj historie?
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/regjistrohu"
              className="rounded-full bg-terracotta px-7 py-3.5 font-bold text-white shadow-soft transition-all hover:-translate-y-0.5 hover:bg-terracotta-deep"
            >
              Regjistro fëmijën
            </Link>
            <Link
              href="/galeria"
              className="rounded-full border-2 border-sage px-7 py-3.5 font-bold text-sage-deep transition-all hover:-translate-y-0.5 hover:bg-sage hover:text-white"
            >
              Shiko kujtimet tona
            </Link>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
