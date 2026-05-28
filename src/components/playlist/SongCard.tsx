"use client";

import { useEffect, useState } from "react";
import { Heart, Pause, Play } from "lucide-react";
import { Song } from "@/types/song";
import { supabase } from "@/lib/supabase";
import { usePlayerStore } from "@/store/playerStore";

interface Props {
  song: Song;
}

export function SongCard({ song }: Props) {
  const setSong = usePlayerStore((state) => state.setSong);
  const currentSong = usePlayerStore((state) => state.currentSong);
  const isPlaying = usePlayerStore((state) => state.isPlaying);
  const setIsPlaying = usePlayerStore((state) => state.setIsPlaying);

  const isCurrentSong = currentSong?.id === song.id;
  const isPlayingThisSong = isCurrentSong && isPlaying;

  const [userId, setUserId] = useState("");
  const [liked, setLiked] = useState(false);
  const [savingLike, setSavingLike] = useState(false);

  useEffect(() => {
    const loadLike = async () => {
      const { data: userData } = await supabase.auth.getUser();
      const currentUserId = userData.user?.id || "";

      setUserId(currentUserId);

      if (!currentUserId) return;

      const { data } = await supabase
        .from("favorites")
        .select("id")
        .eq("user_id", currentUserId)
        .eq("media_id", song.id)
        .maybeSingle();

      setLiked(!!data);
    };

    loadLike();
  }, [song.id]);

  const handleLike = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    if (!userId) {
      alert("Necesitas iniciar sesión.");
      return;
    }

    setSavingLike(true);

    const response = await fetch("/api/favorites", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        mediaId: song.id,
      }),
    });

    const result = await response.json();

    setSavingLike(false);

    if (!response.ok) {
      alert(result.error || "Error al actualizar favorito");
      return;
    }

    setLiked(result.liked);
  };

  const handlePlay = (e?: React.MouseEvent<HTMLButtonElement>) => {
    e?.stopPropagation();

    if (isPlayingThisSong) {
      setIsPlaying(false);
      return;
    }

    setSong(song);
  };

  return (
    <div
      className="conexionrock-song-card uk-position-relative"
      onClick={() => handlePlay()}
    >
      <div className="conexionrock-song-cover-wrap">
        <img
          src={song.cover}
          alt={song.title}
          className="conexionrock-song-cover"
        />

        <span className="conexionrock-song-badge">
          {song.type || "Canción"}
        </span>

        <button
          type="button"
          className={`conexionrock-card-like ${liked ? "is-liked" : ""}`}
          aria-label="Like"
          onClick={handleLike}
          disabled={savingLike}
        >
          <Heart
            size={20}
            strokeWidth={2.4}
            fill={liked ? "currentColor" : "none"}
          />
        </button>

        <button
          type="button"
          className="conexionrock-card-play"
          onClick={handlePlay}
          aria-label={isPlayingThisSong ? "Pausar" : "Reproducir"}
        >
          {isPlayingThisSong ? (
            <Pause size={28} fill="currentColor" />
          ) : (
            <Play size={28} fill="currentColor" />
          )}
        </button>
      </div>

      <div className="conexionrock-song-info">
        <h3>{song.title}</h3>
        <p>{song.artist}</p>

        {song.cdo && <span className="conexionrock-song-cdo">{song.cdo}</span>}
      </div>
    </div>
  );
}