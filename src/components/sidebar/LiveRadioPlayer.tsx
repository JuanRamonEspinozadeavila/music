"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play, Radio, Volume2, VolumeX } from "lucide-react";

const STREAM_URL =
  "https://server2.sit-mexico.com:2199/proxy/conexion?mp=/stream";

export function LiveRadioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);

  const stopRadio = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.pause();
    audio.removeAttribute("src");
    audio.load();
    setPlaying(false);
  };

  useEffect(() => {
    const handlePauseRadio = () => {
      stopRadio();
    };

    window.addEventListener("brame:pause-radio-player", handlePauseRadio);

    return () => {
      window.removeEventListener("brame:pause-radio-player", handlePauseRadio);
    };
  }, []);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (playing) {
      stopRadio();
      return;
    }

    window.dispatchEvent(new Event("brame:pause-main-player"));

    audio.src = STREAM_URL;
    audio.volume = muted ? 0 : volume;
    audio.muted = muted;

    try {
      await audio.play();
      setPlaying(true);
    } catch (error) {
      console.error("Live stream error:", error);
      setPlaying(false);
      alert("No se pudo reproducir la radio en vivo.");
    }
  };

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);

    setVolume(value);
    setMuted(value === 0);

    if (audioRef.current) {
      audioRef.current.volume = value;
      audioRef.current.muted = value === 0;
    }
  };

  const toggleMute = () => {
    const nextMuted = !muted;
    setMuted(nextMuted);

    if (audioRef.current) {
      audioRef.current.muted = nextMuted;
    }
  };

  return (
    <div className="brame-live-radio">
      <div className="brame-live-radio-top">
        <span className="brame-live-dot" />
        <span>EN VIVO</span>
      </div>

      <div className="uk-text-center brame-live-radio-title">
        <Radio size={18} />
        <strong>Radio Brame</strong>
      </div>

      <button type="button" onClick={togglePlay} className="brame-live-play">
        {playing ? (
          <>
            <Pause size={18} fill="currentColor" />
            Pausar
          </>
        ) : (
          <>
            <Play size={18} fill="currentColor" />
            Escuchar
          </>
        )}
      </button>

      <div className="brame-live-volume">
        <button type="button" onClick={toggleMute}>
          {muted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>

        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={muted ? 0 : volume}
          onChange={handleVolume}
        />
      </div>

      <audio ref={audioRef} preload="none" />
    </div>
  );
}