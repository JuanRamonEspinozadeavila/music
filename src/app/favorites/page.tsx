"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

import { Sidebar } from "@/components/sidebar/Sidebar";
import { SongGrid } from "@/components/playlist/SongGrid";
import { Song } from "@/types/song";

interface FavoriteMediaItem {
  id: string;
  title: string | null;
  artist: string | null;
  description: string | null;
  type: "song" | "podcast";
  cdo: string | null;
  audio_url: string | null;
  cover_url: string | null;
}

interface FavoriteRow {
  media_items: FavoriteMediaItem | FavoriteMediaItem[] | null;
}

export default function FavoritesPage() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFavorites = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
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
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Favorites error:", error.message);
        setSongs([]);
        setLoading(false);
        return;
      }

      const rows = (data || []) as FavoriteRow[];

      const mappedSongs: Song[] = rows
        .map((favorite) => {
          if (Array.isArray(favorite.media_items)) {
            return favorite.media_items[0] || null;
          }

          return favorite.media_items;
        })
        .filter((item): item is FavoriteMediaItem => Boolean(item))
        .map((item) => ({
          id: item.id,
          title: item.title || "Sin título",
          artist: item.artist || "conexionrock Music",
          description: item.description || "",
          type: item.type,
          cdo: item.cdo || "",
          audio: item.audio_url || "",
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
      <main className="conexionrock-shell uk-flex uk-flex-center uk-flex-middle">
        <div className="uk-card conexionrock-card uk-card-body">
          <p className="conexionrock-muted uk-margin-remove">
            Cargando favoritos...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="conexionrock-shell" style={{ display: "flex" }}>
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
          <Link href="/" className="conexionrock-muted">
            ← Volver al inicio
          </Link>

          <div className="uk-card conexionrock-card uk-card-body uk-margin-medium-top uk-margin-large-bottom">
            <p className="uk-text-uppercase conexionrock-muted uk-margin-small-bottom">
              Biblioteca personal
            </p>

            <h1 className="conexionrock-title uk-margin-remove">Favoritos</h1>

            <p className="conexionrock-muted uk-margin-small-top">
              Tus canciones y podcasts guardados.
            </p>
          </div>

          {songs.length === 0 ? (
            <div className="uk-card conexionrock-card uk-card-body">
              <p className="conexionrock-muted uk-margin-remove">
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