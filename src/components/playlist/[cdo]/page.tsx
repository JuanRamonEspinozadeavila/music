"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

import { Sidebar } from "@/components/sidebar/Sidebar";
import { Player } from "@/components/player/Player";
import { SongCard } from "@/components/playlist/SongCard";
import { Song } from "@/types/song";

interface Props {
  params: Promise<{
    cdo: string;
  }>;
}

export default function PlaylistCdoPage({ params }: Props) {
  const [cdoName, setCdoName] = useState("");
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPlaylist = async () => {
      const resolvedParams = await params;
      const decodedCdo = decodeURIComponent(resolvedParams.cdo);

      setCdoName(decodedCdo);

      const { data: userData } = await supabase.auth.getUser();

      if (!userData.user) {
        window.location.href = "/login";
        return;
      }

      const { data, error } = await supabase
        .from("media_items")
        .select("id,title,artist,description,type,cdo,audio_url,cover_url")
        .eq("cdo", decodedCdo)
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error.message);
        setSongs([]);
        setLoading(false);
        return;
      }

      const mappedSongs: Song[] = (data || []).map((item) => ({
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
      }));

      setSongs(mappedSongs);
      setLoading(false);
    };

    loadPlaylist();
  }, [params]);

  if (loading) {
    return (
      <main className="conexionrock-shell uk-flex uk-flex-center uk-flex-middle">
        <div className="uk-card conexionrock-card uk-card-body">
          <p className="conexionrock-muted uk-margin-remove">
            Cargando playlist...
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
          paddingBottom: "110px",
        }}
      >
        <div className="uk-container uk-container-expand uk-padding-large">
          <Link href="/" className="conexionrock-muted">
            ← Volver al inicio
          </Link>

          <div className="uk-card conexionrock-card uk-card-body uk-margin-medium-top uk-margin-large-bottom">
            <p className="uk-text-uppercase conexionrock-muted uk-margin-small-bottom">
              Playlist CDO
            </p>

            <h1 className="conexionrock-title uk-margin-remove">{cdoName}</h1>

            <p className="conexionrock-muted uk-margin-small-top">
              Contenido disponible para este CDO.
            </p>
          </div>

          {songs.length === 0 ? (
            <div className="uk-card conexionrock-card uk-card-body">
              <p className="conexionrock-muted uk-margin-remove">
                Todavía no hay canciones o podcasts para este CDO.
              </p>
            </div>
          ) : (
            <div
              className="uk-grid-small uk-child-width-1-2@s uk-child-width-1-3@m uk-child-width-1-4@l"
              data-uk-grid
            >
              {songs.map((song) => (
                <div key={song.id}>
                  <SongCard song={song} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Player />
    </main>
  );
}
