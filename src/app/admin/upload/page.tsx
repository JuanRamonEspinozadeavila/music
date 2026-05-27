"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { CDO_OPTIONS } from "@/types/cdo";
import { isAdmin } from "@/lib/isAdmin";

export default function UploadMediaPage() {
  const [userId, setUserId] = useState("");

  const [type, setType] = useState<"song" | "podcast">("song");
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [description, setDescription] = useState("");
  const [cdo, setCdo] = useState("");

  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const checkAccess = async () => {
      const allowedAdmin = await isAdmin();

      if (!allowedAdmin) {
        window.location.href = "/";
        return;
      }

      setAllowed(true);
    };

    checkAccess();
  }, []);

  const handleUpload = async () => {
    try {
      if (!userId) {
        alert("No hay sesión activa");
        return;
      }

      if (!title || !type || !audioFile) {
        alert("Faltan campos obligatorios");
        return;
      }

      setLoading(true);

      const formData = new FormData();
      formData.append("title", title);
      formData.append("artist", artist);
      formData.append("description", description);
      formData.append("type", type);
      formData.append("cdo", cdo);
      formData.append("createdBy", userId);
      formData.append("audio", audioFile);

      if (coverFile) {
        formData.append("cover", coverFile);
      }

      const response = await fetch("/api/media/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        alert(result.error || "Error al subir archivo");
        return;
      }

      alert("Archivo subido correctamente");

      setTitle("");
      setArtist("");
      setDescription("");
      setCdo("");
      setAudioFile(null);
      setCoverFile(null);
    } catch (error) {
      console.error(error);
      alert("Error inesperado al subir");
    } finally {
      setLoading(false);
    }
  };

  if (!allowed) {
    return (
      <main className="conexionrock-shell uk-flex uk-flex-center uk-flex-middle">
        <div className="uk-card conexionrock-card uk-card-body">
          <p className="conexionrock-muted uk-margin-remove">
            Validando permisos...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="conexionrock-shell uk-flex uk-flex-center uk-flex-middle">
      <div
        className="uk-card conexionrock-card uk-card-body"
        style={{
          width: "100%",
          maxWidth: "720px",
          margin: "40px",
        }}
      >
        <h1 className="conexionrock-title uk-margin-remove-bottom">
          Subir contenido
        </h1>

        <p className="conexionrock-muted uk-margin-small-top">
          Carga canciones o podcasts para conexionrock Music.
        </p>

        <div className="uk-margin">
          <label className="uk-form-label conexionrock-muted">Tipo</label>
          <select
            className="uk-select conexionrock-select"
            value={type}
            onChange={(e) => setType(e.target.value as "song" | "podcast")}
          >
            <option value="song">Canción</option>
            <option value="podcast">Podcast</option>
          </select>
        </div>

        <div className="uk-margin">
          <label className="uk-form-label conexionrock-muted">Título</label>
          <input
            className="uk-input conexionrock-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Nombre del contenido"
          />
        </div>

        <div className="uk-margin">
          <label className="uk-form-label conexionrock-muted">
            Artista / Autor
          </label>
          <input
            className="uk-input conexionrock-input"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            placeholder="Artista, locutor o programa"
          />
        </div>

        <div className="uk-margin">
          <label className="uk-form-label conexionrock-muted">
            Descripción
          </label>
          <textarea
            className="uk-textarea conexionrock-input"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descripción breve"
            style={{ height: "auto", paddingTop: "14px" }}
          />
        </div>

        <div className="uk-margin">
          <label className="uk-form-label conexionrock-muted">
            CDO / Playlist
          </label>
          <select
            className="uk-select conexionrock-select"
            value={cdo}
            onChange={(e) => setCdo(e.target.value)}
          >
            <option value="">General</option>
            {CDO_OPTIONS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div className="uk-margin">
          <label className="uk-form-label conexionrock-muted">
            Archivo de audio
          </label>
          <input
            className="uk-input conexionrock-input"
            type="file"
            accept="audio/*"
            onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
          />
        </div>

        <div className="uk-margin">
          <label className="uk-form-label conexionrock-muted">Portada</label>
          <input
            className="uk-input conexionrock-input"
            type="file"
            accept="image/*"
            onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
          />
        </div>

        <button
          type="button"
          className="uk-button conexionrock-button uk-width-1-1"
          onClick={handleUpload}
          disabled={loading}
          style={{
            height: "54px",
            marginTop: "20px",
          }}
        >
          {loading ? "Subiendo..." : "Subir contenido"}
        </button>
      </div>
    </main>
  );
}
