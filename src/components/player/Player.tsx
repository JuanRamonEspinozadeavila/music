"use client";

import { useEffect, useRef, useState } from "react";
import {
  Heart,
  Pause,
  Play,
  Repeat,
  Shuffle,
  SkipForward,
  Volume2,
  VolumeX,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { usePlayerStore } from "@/store/playerStore";

export function Player() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const {
    currentSong,
    isPlaying,
    togglePlay,
    playNext,
    playRandom,
    setIsPlaying,
  } = usePlayerStore();

  const [userId, setUserId] = useState("");
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const [volume, setVolume] = useState(0.8);
  const [lastVolume, setLastVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);

  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUserId(data.user?.id || "");
    };

    loadUser();
  }, []);

  useEffect(() => {
    const pauseMainPlayer = () => {
      audioRef.current?.pause();
      setIsPlaying(false);
    };

    window.addEventListener("brame:pause-main-player", pauseMainPlayer);

    return () => {
      window.removeEventListener("brame:pause-main-player", pauseMainPlayer);
    };
  }, [setIsPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = muted ? 0 : volume;
    audio.muted = muted;
  }, [volume, muted, currentSong]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentSong) return;

    if (isPlaying) {
      window.dispatchEvent(new Event("brame:pause-radio-player"));

      audio.play().catch((error) => {
        console.error("Audio play error:", error);
        setIsPlaying(false);
      });
    } else {
      audio.pause();
    }
  }, [isPlaying, currentSong, setIsPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.loop = repeat;
  }, [repeat]);

  useEffect(() => {
    const checkLiked = async () => {
      if (!currentSong || !userId) return;

      const { data } = await supabase
        .from("favorites")
        .select("id")
        .eq("user_id", userId)
        .eq("media_id", currentSong.id)
        .maybeSingle();

      setLiked(!!data);
    };

    checkLiked();
  }, [currentSong, userId]);

  const handleLike = async () => {
    if (!currentSong || !userId) {
      alert("Necesitas iniciar sesión.");
      return;
    }

    const response = await fetch("/api/favorites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, mediaId: currentSong.id }),
    });

    const result = await response.json();

    if (!response.ok) {
      alert(result.error || "Error al actualizar favorito");
      return;
    }

    setLiked(result.liked);
  };

  const handleMainPlay = () => {
    if (!isPlaying) {
      window.dispatchEvent(new Event("brame:pause-radio-player"));
    }

    togglePlay();
  };

  const handleNext = () => {
    window.dispatchEvent(new Event("brame:pause-radio-player"));

    if (shuffle) {
      playRandom();
      return;
    }

    playNext();
  };

  const handleEnded = () => {
    if (repeat) return;

    if (shuffle) {
      playRandom();
      return;
    }

    playNext();
  };

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);

    setVolume(value);

    if (value > 0) {
      setLastVolume(value);
      setMuted(false);
    } else {
      setMuted(true);
    }

    if (audioRef.current) {
      audioRef.current.volume = value;
      audioRef.current.muted = value === 0;
    }
  };

  const toggleMute = () => {
    if (muted || volume === 0) {
      const restoredVolume = lastVolume || 0.8;

      setMuted(false);
      setVolume(restoredVolume);

      if (audioRef.current) {
        audioRef.current.muted = false;
        audioRef.current.volume = restoredVolume;
      }

      return;
    }

    setLastVolume(volume);
    setMuted(true);

    if (audioRef.current) {
      audioRef.current.muted = true;
    }
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (!audioRef.current) return;
    setDuration(audioRef.current.duration || 0);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;

    const value = Number(e.target.value);
    audioRef.current.currentTime = value;
    setCurrentTime(value);
  };

  const formatTime = (time: number) => {
    if (!Number.isFinite(time)) return "0:00";

    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);

    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const controlButtonStyle = (active = false): React.CSSProperties => ({
    width: "42px",
    height: "42px",
    borderRadius: "50%",
    border: active
      ? "1px solid rgba(29,185,84,.65)"
      : "1px solid rgba(255,255,255,.1)",
    background: active ? "rgba(29,185,84,.18)" : "rgba(255,255,255,.06)",
    color: active ? "#1db954" : "rgba(255,255,255,.78)",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
  });

  useEffect(() => {
  setCurrentTime(0);
  setDuration(0);
}, [currentSong?.id]);

  if (!currentSong) return null;

  return (
    <div className="brame-player">
      <div className="brame-player-inner">
        <div className="brame-player-song">
          <img
            src={currentSong.cover}
            alt={currentSong.title}
            className="brame-player-cover"
          />

          <div style={{ minWidth: 0 }}>
            <p className="brame-player-title">{currentSong.title}</p>
           <div className="brame-player-meta">
  <p className="brame-player-artist">{currentSong.artist}</p>

  {isPlaying && (
    <div className="brame-equalizer" aria-label="Reproduciendo">
      <span />
      <span />
      <span />
      <span />
    </div>
  )}
</div>
          </div>
        </div>

        <div className="brame-player-center">
          <div className="brame-player-controls">
            <button
              type="button"
              onClick={() => setShuffle(!shuffle)}
              style={controlButtonStyle(shuffle)}
            >
              <Shuffle size={19} strokeWidth={2.4} />
            </button>

            <button
              type="button"
              onClick={handleMainPlay}
              className="brame-main-play"
            >
              {isPlaying ? (
                <Pause size={24} fill="currentColor" />
              ) : (
                <Play size={24} fill="currentColor" style={{ marginLeft: 3 }} />
              )}
            </button>

            <button
              type="button"
              onClick={handleNext}
              style={controlButtonStyle(false)}
            >
              <SkipForward size={19} strokeWidth={2.4} />
            </button>

            <button
              type="button"
              onClick={() => setRepeat(!repeat)}
              style={controlButtonStyle(repeat)}
            >
              <Repeat size={19} strokeWidth={2.4} />
            </button>

            <button
              type="button"
              onClick={handleLike}
              style={controlButtonStyle(liked)}
            >
              <Heart
                size={19}
                strokeWidth={2.4}
                fill={liked ? "currentColor" : "none"}
              />
            </button>
          </div>

          <div className="brame-progress-row">
            <span>{formatTime(currentTime)}</span>

            <input
              className="brame-range"
              type="range"
              min={0}
              max={duration || 0}
              step={0.01}
              value={currentTime}
              onChange={handleSeek}
            />

            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <div className="brame-volume uk-visible@m">
          <button
            type="button"
            onClick={toggleMute}
            style={controlButtonStyle(muted || volume === 0)}
          >
            {muted || volume === 0 ? (
              <VolumeX size={19} strokeWidth={2.4} />
            ) : (
              <Volume2 size={19} strokeWidth={2.4} />
            )}
          </button>

          <input
            className="brame-range"
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={muted ? 0 : volume}
            onChange={handleVolume}
          />
        </div>

        <audio
          ref={audioRef}
          src={currentSong.audio}
          preload="metadata"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleEnded}
        />
      </div>
    </div>
  );
}