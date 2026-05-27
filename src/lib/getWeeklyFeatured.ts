import { supabase } from "@/lib/supabase";
import { Song } from "@/types/song";

export interface FeaturedContent extends Song {
  featured_link?: string;
}

export async function getWeeklyFeatured(): Promise<FeaturedContent[]> {
  const { data, error } = await supabase
    .from("media_items")
    .select(
      "id, title, artist, description, type, cdo, audio_url, cover_url, featured_link",
    )
    .eq("is_featured_content", true)
    .order("featured_order", { ascending: true })
    .limit(3);

  if (error) {
    console.error("Error loading featured content:", error.message);
    return [];
  }

  return (data || []).map((item) => ({
    id: item.id,
    title: item.title,
    artist: item.artist || "conexionrock Music",
    description: item.description || "",
    type: item.type,
    cdo: item.cdo || "",
    audio: item.audio_url,
    cover:
      item.cover_url ||
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=800&auto=format&fit=crop",
    featured_link: item.featured_link || "",
  }));
}
