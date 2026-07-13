"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { saveImage } from "@/lib/storage";

const MAX_UPLOAD = 8 * 1024 * 1024; // 8MB per file

export async function uploadPhotos(formData: FormData) {
  await requireUser("ADMIN");
  const files = formData.getAll("files") as File[];
  const albumId = String(formData.get("albumId") ?? "");
  const caption = String(formData.get("caption") ?? "").trim();

  let uploaded = 0;
  for (const file of files) {
    if (!(file instanceof File) || file.size === 0) continue;
    if (file.size > MAX_UPLOAD || !file.type.startsWith("image/")) continue;
    const buffer = Buffer.from(await file.arrayBuffer());
    const url = await saveImage(buffer, file.name, file.type);
    await db.photo.create({
      data: {
        url,
        caption: caption || null,
        source: "UPLOAD",
        albumId: albumId || null,
        visible: true,
      },
    });
    uploaded++;
  }
  revalidatePath("/admin/galeria");
  revalidatePath("/galeria");
  revalidatePath("/");
  redirect(`/admin/galeria?upload=${uploaded}`);
}
