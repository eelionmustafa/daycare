import Image from "next/image";
import { db } from "@/lib/db";
import { getSettings } from "@/lib/settings";
import { runFacebookSync, uploadPhotos } from "@/app/actions/photos";
import { updatePhoto, togglePhotoFlag, deletePhoto } from "@/app/actions/admin";
import { formatDate } from "@/lib/format";
import { IconSync, IconUpload } from "@/components/icons";

function FlagButton({
  photoId,
  flag,
  on,
  labelOn,
  labelOff,
}: {
  photoId: string;
  flag: string;
  on: boolean;
  labelOn: string;
  labelOff: string;
}) {
  return (
    <form action={togglePhotoFlag}>
      <input type="hidden" name="id" value={photoId} />
      <input type="hidden" name="flag" value={flag} />
      <button
        className={`rounded-full px-3 py-1 text-xs font-bold transition-colors ${
          on ? "bg-sage text-white" : "bg-ink/5 text-ink-soft hover:bg-ink/10"
        }`}
      >
        {on ? labelOn : labelOff}
      </button>
    </form>
  );
}

export default async function AdminGalleryPage({
  searchParams,
}: {
  searchParams: Promise<{
    sync?: string;
    imported?: string;
    skipped?: string;
    more?: string;
    msg?: string;
    upload?: string;
  }>;
}) {
  const [{ sync, imported, skipped, more, msg, upload }, photos, albums, settings] =
    await Promise.all([
      searchParams,
      db.photo.findMany({
        orderBy: [{ visible: "asc" }, { createdAt: "desc" }, { sortOrder: "asc" }],
        include: { album: true, post: true },
      }),
      db.album.findMany({ orderBy: { sortOrder: "asc" } }),
      getSettings(),
    ]);

  const pending = photos.filter((p) => !p.visible);
  const fbConfigured = Boolean(
    (settings.fb_page_id && settings.fb_access_token) ||
      (process.env.FACEBOOK_PAGE_ID && process.env.FACEBOOK_ACCESS_TOKEN)
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-semibold">Galeria</h1>
        <p className="mt-1 text-ink-soft">
          {photos.length} foto gjithsej · {pending.length} të fshehura
        </p>
      </div>

      {sync === "ok" && (
        <p className="rounded-xl bg-sage/15 px-4 py-3 text-sm font-semibold text-sage-deep">
          Sinkronizimi përfundoi: {imported} foto të reja u importuan ({skipped} ekzistonin).
          Fotot janë publike menjëherë dhe u kategorizuan automatikisht sipas përshkrimit —
          më poshtë mund të fshihni ose fshini ato që nuk i doni.
          {more === "1" && (
            <>
              {" "}Facebook-u ka ende foto të tjera — shtypni &quot;Sinkronizo tani&quot;
              përsëri për t&apos;i sjellë ato që mbetën.
            </>
          )}
        </p>
      )}
      {sync === "err" && (
        <p className="rounded-xl bg-terracotta/10 px-4 py-3 text-sm font-semibold text-terracotta-deep">
          {msg}
        </p>
      )}
      {upload && (
        <p className="rounded-xl bg-sage/15 px-4 py-3 text-sm font-semibold text-sage-deep">
          {upload} foto u ngarkuan me sukses.
        </p>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Facebook sync */}
        <section className="rounded-3xl bg-white p-6 shadow-soft">
          <h2 className="flex items-center gap-2 font-display text-xl font-semibold">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" className="text-sky" aria-hidden>
              <path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12Z" />
            </svg>
            Sinkronizimi me Facebook
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            Importon fotot më të reja nga faqja juaj e Facebook-ut. Fotot publikohen
            <strong> menjëherë</strong> në galeri — më poshtë mund të fshihni ose fshini
            ato që s&apos;i doni, dhe të zgjidhni cilat dalin në ballinë e në cilin album shkojnë.
          </p>
          {!fbConfigured && (
            <p className="mt-3 rounded-xl bg-sun/15 px-4 py-3 text-sm">
              <strong>Kujdes:</strong> Lidhja me Facebook s&apos;është konfiguruar ende. Shtoni
              Page ID dhe Access Token te <strong>Cilësimet</strong>, ose ngarkoni fotot
              manualisht djathtas.
            </p>
          )}
          <form action={runFacebookSync} className="mt-4">
            <button className="inline-flex items-center gap-2 rounded-full bg-sky px-6 py-3 font-bold text-white shadow-soft transition-colors hover:opacity-90">
              <IconSync className="h-4.5 w-4.5" /> Sinkronizo tani
            </button>
          </form>
        </section>

        {/* Manual upload */}
        <section className="rounded-3xl bg-white p-6 shadow-soft">
          <h2 className="flex items-center gap-2 font-display text-xl font-semibold">
            <IconUpload className="h-5 w-5 text-terracotta" /> Ngarkim manual
          </h2>
          <p className="mt-2 text-sm text-ink-soft">
            Ngarkoni foto direkt nga kompjuteri ose telefoni (deri 8MB secila).
          </p>
          <form action={uploadPhotos} className="mt-4 space-y-3">
            <input
              type="file"
              name="files"
              accept="image/*"
              multiple
              required
              className="w-full rounded-xl border border-dashed border-ink/20 bg-cream px-4 py-6 text-sm file:mr-3 file:rounded-full file:border-0 file:bg-terracotta file:px-4 file:py-2 file:text-sm file:font-bold file:text-white"
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <select name="albumId" className="rounded-xl border border-ink/10 bg-white px-4 py-2.5 text-sm shadow-soft">
                <option value="">— Pa album —</option>
                {albums.map((a) => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
              <input
                name="caption"
                placeholder="Përshkrimi (opsionale)"
                className="rounded-xl border border-ink/10 bg-white px-4 py-2.5 text-sm shadow-soft"
              />
            </div>
            <button className="rounded-full bg-terracotta px-6 py-3 font-bold text-white shadow-soft transition-colors hover:bg-terracotta-deep">
              Ngarko fotot
            </button>
          </form>
        </section>
      </div>

      {/* Photo management grid */}
      <section>
        <h2 className="font-display text-xl font-semibold">Të gjitha fotot</h2>
        <p className="mt-1 text-sm text-ink-soft">
          E dukshme = shfaqet në galeri · Ballina = seksioni i fotove në faqen kryesore ·
          Hero = kolazhi i madh i ballinës
        </p>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {photos.map((p) => (
            <article
              key={p.id}
              className={`rounded-3xl bg-white p-4 shadow-soft ${!p.visible ? "ring-2 ring-sun/60" : ""}`}
            >
              <div className="relative overflow-hidden rounded-xl">
                <Image
                  src={p.url}
                  alt={p.caption ?? "Foto"}
                  width={p.width ?? 600}
                  height={p.height ?? 450}
                  className="aspect-4/3 w-full object-cover"
                />
                <span className="absolute left-2 top-2 rounded-full bg-ink/70 px-2.5 py-1 text-[11px] font-bold text-white">
                  {p.source === "FACEBOOK" ? "Facebook" : "Ngarkuar"}
                  {p.post && ` · postimi ${formatDate(p.post.postedAt)}`}
                </span>
                {!p.visible && (
                  <span className="absolute right-2 top-2 rounded-full bg-sun px-2.5 py-1 text-[11px] font-bold text-ink">
                    E fshehur
                  </span>
                )}
              </div>

              <div className="mt-3 flex flex-wrap gap-1.5">
                <FlagButton photoId={p.id} flag="visible" on={p.visible} labelOn="E dukshme ✓" labelOff="E fshehur" />
                <FlagButton photoId={p.id} flag="featured" on={p.featured} labelOn="Ballina ✓" labelOff="Ballina" />
                <FlagButton photoId={p.id} flag="homepage" on={p.homepage} labelOn="Hero ✓" labelOff="Hero" />
              </div>

              <form action={updatePhoto} className="mt-3 space-y-2">
                <input type="hidden" name="id" value={p.id} />
                {/* keep current flags when saving caption/album */}
                {p.visible && <input type="hidden" name="visible" value="on" />}
                {p.featured && <input type="hidden" name="featured" value="on" />}
                {p.homepage && <input type="hidden" name="homepage" value="on" />}
                <input
                  name="caption"
                  defaultValue={p.caption ?? ""}
                  placeholder="Përshkrimi..."
                  className="w-full rounded-lg border border-ink/10 px-3 py-2 text-sm"
                />
                <div className="flex gap-2">
                  <select
                    name="albumId"
                    defaultValue={p.albumId ?? ""}
                    className="flex-1 rounded-lg border border-ink/10 bg-white px-2 py-2 text-sm"
                  >
                    <option value="">— Pa album —</option>
                    {albums.map((a) => (
                      <option key={a.id} value={a.id}>{a.name}</option>
                    ))}
                  </select>
                  <button className="rounded-lg bg-ink px-4 py-2 text-xs font-bold text-white">
                    Ruaj
                  </button>
                </div>
              </form>

              <form action={deletePhoto} className="mt-2 text-right">
                <input type="hidden" name="id" value={p.id} />
                <button className="text-xs font-bold text-terracotta-deep/70 hover:text-terracotta-deep hover:underline">
                  Fshi foton
                </button>
              </form>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
