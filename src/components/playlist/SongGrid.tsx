"use client";

import { useEffect, useState } from "react";
import { getMediaItems } from "@/lib/getMediaItems";
import { Song } from "@/types/song";
import { SongCard } from "./SongCard";
import { usePlayerStore } from "@/store/playerStore";

interface Props {
  songs?: Song[];
}

export function SongGrid({ songs: externalSongs }: Props) {
  const [internalSongs, setInternalSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(!externalSongs);

  const setQueue = usePlayerStore((state) => state.setQueue);

  const songs = externalSongs || internalSongs;

  useEffect(() => {
    if (externalSongs) return;

    const loadSongs = async () => {
      const items = await getMediaItems();
      setInternalSongs(items);
      setLoading(false);
    };

    loadSongs();
  }, [externalSongs]);

  useEffect(() => {
    setQueue(songs);
  }, [songs, setQueue]);

  if (loading) {
    return <p className="conexionrock-muted">Cargando contenido...</p>;
  }

  if (songs.length === 0) {
    return (
      <p className="conexionrock-muted">Todavía no hay contenido cargado.</p>
    );
  }

  return (
    <div className="conexionrock-song-grid">
      {songs.map((song) => (
        <SongCard key={song.id} song={song} />
      ))}
    </div>
  );
}
