"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

import { Sidebar } from "@/components/sidebar/Sidebar";
import { SongGrid } from "@/components/playlist/SongGrid";
import { Song } from "@/types/song";

export default function FavoritesPage() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFavorites = async () => {
      const { data: userData } = await supabase.auth.getUser();

      if (!userData.user) {
        window.location.href = "/login";
        return;
      }

      const { data, error } = await supabase
        .from("favorites")
        .select(
          `
          media_items (
            id,
            title,
            artist,
            description,
            type,
            cdo,
            audio_url,
            cover_url
          )
        `
        )
        .eq("user_id", userData.user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Favorites error:", error.message);
        setSongs([]);
        setLoading(false);
        return;
      }

      const mappedSongs: Song[] = (data || [])
        .map((favorite: any) => favorite.media_items)
        .filter(Boolean)
        .map((item: any) => ({
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

      setSongs(mappedSongs);
      setLoading(false);
    };

    loadFavorites();
  }, []);

  if (loading) {
    return (
      <main className="brame-shell uk-flex uk-flex-center uk-flex-middle">
        <div className="uk-card brame-card uk-card-body">
          <p className="brame-muted uk-margin-remove">Cargando favoritos...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="brame-shell" style={{ display: "flex" }}>
      <Sidebar />

      <section
        style={{
          flex: 1,
          minHeight: "100vh",
          paddingBottom: "140px",
          minWidth: 0,
        }}
      >
        <div className="uk-container uk-container-expand uk-padding-large">
          <Link href="/" className="brame-muted">
            ← Volver al inicio
          </Link>

          <div className="uk-card brame-card uk-card-body uk-margin-medium-top uk-margin-large-bottom">
            <p className="uk-text-uppercase brame-muted uk-margin-small-bottom">
              Biblioteca personal
            </p>

            <h1 className="brame-title uk-margin-remove">Favoritos</h1>

            <p className="brame-muted uk-margin-small-top">
              Tus canciones y podcasts guardados.
            </p>
          </div>

          {songs.length === 0 ? (
            <div className="uk-card brame-card uk-card-body">
              <p className="brame-muted uk-margin-remove">
                Todavía no tienes favoritos guardados.
              </p>
            </div>
          ) : (
            <SongGrid songs={songs} />
          )}
        </div>
      </section>
    </main>
  );
}