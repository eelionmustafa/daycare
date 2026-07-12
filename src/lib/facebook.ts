import { db } from "@/lib/db";
import { getSettings } from "@/lib/settings";
import { saveImage } from "@/lib/storage";
import { categorizeCaption } from "@/lib/categorize";

type FbSubattachment = {
  type?: string;
  media?: { image?: { src: string; width: number; height: number } };
  target?: { id?: string };
};
type FbAttachment = {
  type?: string;
  media?: { image?: { src: string; width: number; height: number } };
  target?: { id?: string };
  subattachments?: { data: FbSubattachment[] };
};
type FbPost = {
  id: string;
  message?: string;
  created_time: string;
  attachments?: { data: FbAttachment[] };
};

export type SyncResult =
  | { ok: true; imported: number; skipped: number; hasMore: boolean }
  | { ok: false; error: string };

/**
 * Pulls the Page's posts (newest first) from the Facebook Graph API and
 * imports each post's photos as a single grouped Post — same order the
 * photos appear in the original post, same posted date — so the gallery
 * and Aktivitetet feed can mirror the Page's real timeline instead of a
 * flat, re-sorted photo pile. Posts with no photo attachments are skipped.
 *
 * Imported photos/posts go public immediately; the admin can hide or
 * delete individual ones afterwards from Admin → Galeria.
 *
 * Requires fb_page_id + fb_access_token in Cilësimet (a Page Access Token
 * with pages_read_engagement, from developers.facebook.com), or the
 * FACEBOOK_PAGE_ID / FACEBOOK_ACCESS_TOKEN env vars.
 */
export async function syncFacebookPhotos(): Promise<SyncResult> {
  const s = await getSettings();
  const pageId = s.fb_page_id || process.env.FACEBOOK_PAGE_ID;
  const token = s.fb_access_token || process.env.FACEBOOK_ACCESS_TOKEN;
  if (!pageId || !token) {
    return {
      ok: false,
      error:
        "Mungon Facebook Page ID ose Access Token. Plotësojini te Cilësimet, ose ngarkoni fotot manualisht më poshtë.",
    };
  }

  const fields =
    "id,message,created_time,attachments{type,media,subattachments{media,target}}";
  let url = `https://graph.facebook.com/v21.0/${encodeURIComponent(
    pageId
  )}/posts?fields=${fields}&limit=25&access_token=${encodeURIComponent(token)}`;

  let imported = 0;
  let skipped = 0;
  let pages = 0;

  // Album slugs → ids, so captions can be auto-categorized on import.
  const localAlbums = await db.album.findMany({ select: { id: true, slug: true } });
  const albumIdBySlug = new Map(localAlbums.map((a) => [a.slug, a.id]));

  try {
    while (url && pages < 4) {
      pages++;
      const res = await fetch(url);
      const data = await res.json();
      if (!res.ok || data.error) {
        return {
          ok: false,
          error: `Facebook API: ${data.error?.message ?? `HTTP ${res.status}`}`,
        };
      }

      for (const post of (data.data ?? []) as FbPost[]) {
        const exists = await db.post.findUnique({ where: { fbId: post.id } });
        if (exists) {
          skipped++;
          continue;
        }

        // Flatten this post's photo attachments in their original order.
        // A multi-photo post has one top-level attachment of type "album"
        // whose subattachments are the individual photos; a single-photo
        // post has one top-level photo attachment and no subattachments.
        const images: { fbId: string; src: string; width: number; height: number }[] = [];
        for (const att of post.attachments?.data ?? []) {
          if (att.subattachments?.data?.length) {
            for (const sub of att.subattachments.data) {
              if (sub.media?.image && sub.target?.id) {
                images.push({
                  fbId: sub.target.id,
                  src: sub.media.image.src,
                  width: sub.media.image.width,
                  height: sub.media.image.height,
                });
              }
            }
          } else if (att.media?.image && att.type === "photo" && att.target?.id) {
            images.push({
              fbId: att.target.id,
              src: att.media.image.src,
              width: att.media.image.width,
              height: att.media.image.height,
            });
          }
        }

        if (images.length === 0) continue; // text-only or non-photo post

        const caption = post.message?.slice(0, 500) ?? null;
        const albumSlug = categorizeCaption(caption);
        const albumId = albumSlug ? albumIdBySlug.get(albumSlug) ?? null : null;

        const createdPost = await db.post.create({
          data: {
            fbId: post.id,
            message: caption,
            postedAt: new Date(post.created_time),
            source: "FACEBOOK",
            visible: true,
          },
        });

        let order = 0;
        for (const img of images) {
          const already = await db.photo.findUnique({ where: { fbId: img.fbId } });
          if (already) {
            skipped++;
            order++;
            continue;
          }
          const imgRes = await fetch(img.src);
          if (!imgRes.ok) {
            order++;
            continue;
          }
          const buffer = Buffer.from(await imgRes.arrayBuffer());
          const storedUrl = await saveImage(buffer, `fb-${img.fbId}.jpg`);

          await db.photo.create({
            data: {
              url: storedUrl,
              fbId: img.fbId,
              caption,
              source: "FACEBOOK",
              width: img.width,
              height: img.height,
              visible: true,
              albumId,
              postId: createdPost.id,
              postOrder: order,
            },
          });
          imported++;
          order++;
        }
      }

      url = data.paging?.next ?? "";
    }
    return { ok: true, imported, skipped, hasMore: Boolean(url) };
  } catch (e) {
    return {
      ok: false,
      error: `Sinkronizimi dështoi: ${e instanceof Error ? e.message : "gabim i panjohur"}`,
    };
  }
}
