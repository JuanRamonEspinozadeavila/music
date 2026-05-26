import { supabase } from "@/lib/supabase";
import { Song } from "@/types/song";

export async function getWeeklyFeatured(): Promise<Song[]> {
  const { data, error } = await supabase
    .from("media_items")
    .select("id, title, artist, description, type, cdo, audio_url, cover_url")
    .eq("is_weekly_featured", true)
    .order("weekly_order", { ascending: true })
    .limit(4);

  if (error) {
    console.error("Error loading weekly featured:", error.message);
    return [];
  }

  return (data || []).map((item) => ({
    id: item.id,
    title: item.title,
    artist: item.artist || "BRAME Music",
    description: item.description || "",
    type: item.type,
    cdo: item.cdo || "",
    audio: item.audio_url,
    cover:
      item.cover_url ||
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=800&auto=format&fit=crop",
  }));
}