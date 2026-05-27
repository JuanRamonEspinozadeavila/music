"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Sidebar } from "@/components/sidebar/Sidebar";

interface SponsorEvent {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  link_url: string | null;
  label: string | null;
}

export default function EventsPage() {
  const [items, setItems] = useState<SponsorEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEvents = async () => {
      const { data, error } = await supabase
        .from("sponsors_events")
        .select("id, title, description, image_url, link_url, label")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });

      if (error) {
        console.error("Error loading events:", error.message);
        setLoading(false);
        return;
      }

      setItems(data || []);
      setLoading(false);
    };

    loadEvents();
  }, []);

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
          <section className="conexionrock-events-hero">
            <p className="conexionrock-eyebrow uk-margin-small-bottom">
              conexionrock MUSIC
            </p>

            <h1 className="conexionrock-events-title uk-margin-remove">
              Eventos y patrocinadores
            </h1>

            <p className="conexionrock-muted uk-margin-small-top">
              Espacio para campañas, eventos internos, lanzamientos y aliados.
            </p>
          </section>

          {loading ? (
            <p className="conexionrock-muted uk-margin-large-top">
              Cargando...
            </p>
          ) : items.length === 0 ? (
            <p className="conexionrock-muted uk-margin-large-top">
              No hay eventos activos por ahora.
            </p>
          ) : (
            <section className="conexionrock-events-grid uk-margin-large-top">
              {items.map((item) => (
                <article key={item.id} className="conexionrock-event-card">
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="conexionrock-event-image"
                    />
                  ) : (
                    <div className="conexionrock-event-placeholder">
                      {item.label || "Evento"}
                    </div>
                  )}

                  <div className="conexionrock-event-body">
                    <p className="conexionrock-event-label">
                      {item.label || "Patrocinador / Evento"}
                    </p>

                    <h2>{item.title}</h2>

                    <p>{item.description || "Más información próximamente."}</p>

                    {item.link_url && (
                      <a
                        href={item.link_url}
                        target={
                          item.link_url.startsWith("http") ? "_blank" : "_self"
                        }
                        className="conexionrock-event-link"
                      >
                        Ver más
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </section>
          )}
        </div>
      </section>
    </main>
  );
}
