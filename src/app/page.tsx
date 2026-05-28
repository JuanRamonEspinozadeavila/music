"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

import { Sidebar } from "@/components/sidebar/Sidebar";
import { Header } from "@/components/layout/Header";
import { SongGrid } from "@/components/playlist/SongGrid";
import { usePlayerStore } from "@/store/playerStore";
import { getWeeklyFeatured } from "@/lib/getWeeklyFeatured";
import { Song } from "@/types/song";

export default function HomePage() {
  const [name, setName] = useState("Invitado");
  const [email, setEmail] = useState("");
  const [cdo, setCdo] = useState("");
  const [loading, setLoading] = useState(true);
  const [weeklySongs, setWeeklySongs] = useState<Song[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const currentSong = usePlayerStore((state) => state.currentSong);
  const isPlaying = usePlayerStore((state) => state.isPlaying);

  useEffect(() => {
    const loadSession = async () => {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        setName("Invitado");
        setEmail("");
        setCdo("");
        setIsLoggedIn(false);

        const featured = await getWeeklyFeatured();
        setWeeklySongs(featured);

        setLoading(false);
        return;
      }

      setIsLoggedIn(true);

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

      const featured = await getWeeklyFeatured();
      setWeeklySongs(featured);

      setLoading(false);
    };

    loadSession();
  }, []);

  const handleAuthAction = async () => {
    if (!isLoggedIn) {
      window.location.href = "/login";
      return;
    }

    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  if (loading) {
    return (
      <main className="conexionrock-shell uk-flex uk-flex-center uk-flex-middle">
        <div className="uk-card conexionrock-card uk-card-body">
          <p className="conexionrock-muted uk-margin-remove">
            Cargando experiencia...
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
          paddingBottom: "120px",
          minWidth: 0,
        }}
      >
        <div className="uk-container uk-container-expand uk-padding">
          <section
            className="conexionrock-home-hero uk-margin-medium-bottom"
            style={{
              backgroundImage: currentSong
                ? `linear-gradient(90deg, rgba(18,18,18,0.96) 0%, rgba(18,18,18,0.82) 48%, rgba(18,18,18,0.45) 100%), url(${currentSong.cover})`
                : undefined,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="conexionrock-hero-glow" />

            <div className="conexionrock-hero-layout">
              <div className="conexionrock-hero-left">
                <p className="conexionrock-eyebrow uk-margin-small-bottom">
                  {currentSong
                    ? isPlaying
                      ? "REPRODUCIENDO AHORA"
                      : "LISTO PARA ESCUCHAR"
                    : "conexionrock MUSIC · MODO INVITADO"}
                </p>

                <h1 className="conexionrock-hero-title uk-margin-remove">
                  {currentSong
                    ? currentSong.title
                    : "Música independiente, podcasts y contenidos seleccionados."}
                </h1>

                <p className="conexionrock-hero-copy uk-margin-small-top">
                  {currentSong
                    ? `${currentSong.artist} · ${currentSong.cdo || "conexionrock Music"
                    }`
                    : isLoggedIn
                      ? "Explora canciones, podcasts y contenidos seleccionados para tu CDO."
                      : "Puedes escuchar como invitado. Para guardar favoritos necesitas iniciar sesión."}
                </p>

                <div className="conexionrock-user-strip">
                  {currentSong ? (
                    <>
                      <span>{currentSong.type || "Contenido"}</span>
                      {currentSong.cdo && <span>CDO: {currentSong.cdo}</span>}
                      <span>{isPlaying ? "En reproducción" : "Pausado"}</span>
                    </>
                  ) : (
                    <>
                      <span>{name}</span>
                      {email && <span>{email}</span>}
                      {cdo && <span>CDO: {cdo}</span>}
                    </>
                  )}
                </div>

                <div className="conexionrock-hero-actions conexionrock-hero-actions-bottom">
                  <a href="/search" className="conexionrock-pill-button">
                    Buscar contenido
                  </a>

                  <button
                    type="button"
                    onClick={handleAuthAction}
                    className="conexionrock-ghost-button"
                  >
                    {isLoggedIn ? "Cerrar sesión" : "Iniciar sesión"}
                  </button>
                </div>
              </div>

              <aside className="conexionrock-weekly-feature">
                <p className="conexionrock-weekly-kicker">
                  Contenido destacado
                </p>

                {weeklySongs.length > 0 ? (
                  <div className="conexionrock-featured-content-list">
                    {weeklySongs.map((song) => (
                      <button
                        key={song.id}
                        type="button"
                        className="conexionrock-featured-content-card"
                        onClick={() => usePlayerStore.getState().setSong(song)}
                      >
                        <img src={song.cover} alt={song.title} />
                        <strong>{song.title}</strong>
                      </button>
                    ))}
                  </div>
                ) : (
                  <p>Todavía no hay contenido destacado.</p>
                )}
              </aside>
            </div>
          </section>

          <Header />

          <section className="uk-margin-small-top">
            <div className="conexionrock-section-heading">
              <div>
                <p className="conexionrock-eyebrow uk-margin-remove">
                  NUEVO EN conexionrock
                </p>

                <h2 className="conexionrock-section-title uk-margin-remove">
                  Selección destacada
                </h2>
              </div>

              <a href="/search" className="conexionrock-section-link">
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