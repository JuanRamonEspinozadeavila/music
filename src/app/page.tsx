"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

import { Sidebar } from "@/components/sidebar/Sidebar";
import { Header } from "@/components/layout/Header";
import { SongGrid } from "@/components/playlist/SongGrid";
import { usePlayerStore } from "@/store/playerStore";

export default function HomePage() {
  const [name, setName] = useState("Usuario");
  const [email, setEmail] = useState("");
  const [cdo, setCdo] = useState("");
  const [loading, setLoading] = useState(true);

  const currentSong = usePlayerStore((state) => state.currentSong);
  const isPlaying = usePlayerStore((state) => state.isPlaying);

  useEffect(() => {
    const loadSession = async () => {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        window.location.href = "/login";
        return;
      }

      const displayName =
        data.user.user_metadata?.display_name ||
        data.user.email?.split("@")[0] ||
        "Usuario";

      setName(displayName);
      setEmail(data.user.email || "");

      const { data: profile } = await supabase
        .from("profiles")
        .select("cdo")
        .eq("id", data.user.id)
        .single();

      setCdo(profile?.cdo || data.user.user_metadata?.cdo || "");
      setLoading(false);
    };

    loadSession();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  if (loading) {
    return (
      <main className="brame-shell uk-flex uk-flex-center uk-flex-middle">
        <div className="uk-card brame-card uk-card-body">
          <p className="brame-muted uk-margin-remove">
            Cargando experiencia...
          </p>
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
          paddingBottom: "120px",
          minWidth: 0,
        }}
      >
        <div className="uk-container uk-container-expand uk-padding">
          <section
            className="brame-home-hero uk-margin-medium-bottom"
            style={{
              backgroundImage: currentSong
                ? `linear-gradient(90deg, rgba(18,18,18,0.96) 0%, rgba(18,18,18,0.82) 48%, rgba(18,18,18,0.45) 100%), url(${currentSong.cover})`
                : undefined,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="brame-hero-glow" />

            <div className="brame-hero-layout">
              <div className="brame-hero-left">
                <p className="brame-eyebrow uk-margin-small-bottom">
                  {currentSong
                    ? isPlaying
                      ? "REPRODUCIENDO AHORA"
                      : "LISTO PARA ESCUCHAR"
                    : "BRAME MUSIC · CURADURÍA INTERNA"}
                </p>

                <h1 className="brame-hero-title uk-margin-remove">
                  {currentSong
                    ? currentSong.title
                    : "Música para equipos que se mueven distinto."}
                </h1>

                <p className="brame-hero-copy uk-margin-small-top">
                  {currentSong
                    ? `${currentSong.artist} · ${
                        currentSong.cdo || "BRAME Music"
                      }`
                    : "Explora canciones, podcasts y contenidos seleccionados para tu CDO."}
                </p>

                <div className="brame-user-strip">
                  {currentSong ? (
                    <>
                      <span>{currentSong.type || "Contenido"}</span>
                      {currentSong.cdo && <span>CDO: {currentSong.cdo}</span>}
                      <span>{isPlaying ? "En reproducción" : "Pausado"}</span>
                    </>
                  ) : (
                    <>
                      <span>{name}</span>
                      <span>{email}</span>
                      {cdo && <span>CDO: {cdo}</span>}
                    </>
                  )}
                </div>

                <div className="brame-hero-actions brame-hero-actions-bottom">
                  <a href="/search" className="brame-pill-button">
                    Buscar contenido
                  </a>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="brame-ghost-button"
                  >
                    Cerrar sesión
                  </button>
                </div>
              </div>

              <aside className="brame-weekly-feature">
                <p className="brame-weekly-kicker">
                  Música destacada
                </p>

                <h2>De la semana</h2>

                {currentSong ? (
                  <div className="brame-weekly-current">
                    <img
                      src={currentSong.cover}
                      alt={currentSong.title}
                      className="brame-weekly-cover"
                    />

                    <div>
                      <p className="brame-weekly-label">
                        {isPlaying ? "Sonando ahora" : "Última selección"}
                      </p>

                      <h3>{currentSong.title}</h3>

                      <p>{currentSong.artist}</p>
                    </div>
                  </div>
                ) : (
                  <p>
                    Descubre canciones, podcasts y contenidos recomendados para
                    esta semana.
                  </p>
                )}

                <a href="/search" className="brame-weekly-link">
                  Explorar selección
                </a>
              </aside>
            </div>
          </section>

          <Header />

          <section className="uk-margin-small-top">
            <div className="brame-section-heading">
              <div>
                <p className="brame-eyebrow uk-margin-remove">
                  NUEVO EN BRAME
                </p>

                <h2 className="brame-section-title uk-margin-remove">
                  Selección destacada
                </h2>
              </div>

              <a href="/search" className="brame-section-link">
                Ver todo
              </a>
            </div>

            <SongGrid />
          </section>
        </div>
      </section>
    </main>
  );
}