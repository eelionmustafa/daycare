import { NextResponse } from "next/server";
import { syncFacebookPhotos } from "@/lib/facebook";

/**
 * Vercel Cron target — pulls new Facebook posts/photos on a schedule
 * (see vercel.json) so the gallery/Aktivitetet feed stays current without
 * an admin having to click "Sinkronizo tani". Runs the same sync used by
 * the manual button, repeatedly if there's more than one page of results
 * (each call imports up to ~200 photos before Facebook paginates).
 *
 * Protected by CRON_SECRET: Vercel Cron sends it automatically as a
 * Bearer token when the env var is set on the project.
 */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = req.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const results = [];
  let hasMore = true;
  let guard = 0;
  while (hasMore && guard < 6) {
    guard++;
    const result = await syncFacebookPhotos();
    results.push(result);
    if (!result.ok) break;
    hasMore = result.hasMore;
  }

  return NextResponse.json({ runs: results });
}
