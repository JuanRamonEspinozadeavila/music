"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

import { Sidebar } from "@/components/sidebar/Sidebar";
import { Header } from "@/components/layout/Header";
import { SongGrid } from "@/components/playlist/SongGrid";
import { Player } from "@/components/player/Player";

export default function HomePage() {
  const [name, setName] = useState("Usuario");
  const [email, setEmail] = useState("");
  const [cdo, setCdo] = useState("");
  const [loading, setLoading] = useState(true);

  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) {
      return "Buenos días";
    }

    if (hour >= 12 && hour < 19) {
      return "Buenas tardes";
    }

    return "Buenas noches";
  };

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
          <p className="brame-muted uk-margin-remove">Cargando...</p>
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
          paddingBottom: "110px",
        }}
      >
        <div className="uk-container uk-container-expand uk-padding">
          <div className="uk-card brame-card uk-card-body uk-margin-medium-bottom">
            <div
              className="uk-flex uk-flex-between uk-flex-middle uk-flex-wrap"
              style={{ gap: "20px" }}
            >
              <div>
                <p className="brame-muted uk-margin-small-bottom">
                  Bienvenido a BRAME Music
                </p>

                <h1 className="brame-title uk-margin-remove">
                  {getGreeting()}, {name}
                </h1>

                <p className="brame-muted uk-margin-small-top uk-margin-remove-bottom">
                  {email}
                </p>

                {cdo && (
                  <p className="uk-margin-small-top uk-margin-remove-bottom brame-accent uk-text-bold">
                    CDO: {cdo}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="uk-button brame-button"
              >
                Cerrar sesión
              </button>
            </div>
          </div>

          <Header />

          <div className="uk-margin-large-top">
            <SongGrid />
          </div>
        </div>
      </section>

    
    </main>
  );
}