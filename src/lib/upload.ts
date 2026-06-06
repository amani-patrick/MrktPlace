import { createClient } from "@/lib/supabase/client";

export async function uploadFile(
  file: File,
  bucket: "listing-images" | "agent-documents",
  folder: string,
): Promise<{ url?: string; error?: string }> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not signed in" };

  const ext = file.name.split(".").pop() ?? "bin";
  const path = `${folder}/${user.id}/${Date.now()}.${ext}`;

  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    upsert: false,
    contentType: file.type,
  });

  if (error) return { error: error.message };

  if (bucket === "listing-images") {
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return { url: data.publicUrl };
  }

  const { data: signed } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, 60 * 60 * 24 * 7);

  return { url: signed?.signedUrl ?? path };
}
