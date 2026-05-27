"use client";

import { useEffect, useMemo, useState } from "react";

import { Sidebar } from "@/components/sidebar/Sidebar";
import { SongGrid } from "@/components/playlist/SongGrid";
import { getMediaItems } from "@/lib/getMediaItems";
import { Song } from "@/types/song";

export default function SearchPage() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSongs = async () => {
      const items = await getMediaItems();
      setSongs(items);
      setLoading(false);
    };

    loadSongs();
  }, []);

  const filteredSongs = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return songs;

    return songs.filter((song) => {
      return (
        song.title?.toLowerCase().includes(query) ||
        song.artist?.toLowerCase().includes(query) ||
        song.description?.toLowerCase().includes(query) ||
        song.cdo?.toLowerCase().includes(query) ||
        song.type?.toLowerCase().includes(query)
      );
    });
  }, [songs, search]);

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
        <div className="uk-container uk-container-expand uk-padding">
          <div className="uk-card conexionrock-card uk-card-body uk-margin-medium-bottom">
            <p className="conexionrock-muted uk-margin-small-bottom">
              EXPLORAR
            </p>

            <h1 className="conexionrock-title uk-margin-remove">
              Encuentra canciones, podcasts y playlists.
            </h1>

            <p className="conexionrock-muted uk-margin-small-top uk-margin-remove-bottom">
              Busca por título, artista, CDO, descripción o tipo de contenido.
            </p>
          </div>

          <div className=" uk-margin-medium-bottom">
            <input
              style={{ borderRadius: "50px" }}
              className="el-input uk-input  conexionrock-search-input"
              type="search"
              placeholder="Buscar en conexionrock Music..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
            />
          </div>

          {loading ? (
            <p className="conexionrock-muted">Cargando contenido...</p>
          ) : filteredSongs.length > 0 ? (
            <SongGrid songs={filteredSongs} />
          ) : (
            <div className="uk-card conexionrock-card uk-card-body">
              <h3 className="uk-margin-remove-bottom">
                No encontramos resultados
              </h3>

              <p className="conexionrock-muted uk-margin-small-top">
                Intenta buscar por artista, canción, podcast o CDO.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
