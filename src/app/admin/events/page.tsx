"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { isAdmin } from "@/lib/isAdmin";

interface SponsorEvent {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  link_url: string | null;
  label: string | null;
  is_active: boolean;
  sort_order: number | null;
}

export default function AdminEventsPage() {
  const [items, setItems] = useState<SponsorEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [label, setLabel] = useState("Evento");
  const [sortOrder, setSortOrder] = useState(1);
  const [allowed, setAllowed] = useState(false);

  const loadItems = async () => {
    const { data, error } = await supabase
      .from("sponsors_events")
      .select(
        "id, title, description, image_url, link_url, label, is_active, sort_order",
      )
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("Error loading events:", error.message);
      setLoading(false);
      return;
    }

    setItems(data || []);
    setLoading(false);
  };

  useEffect(() => {
    const checkAccess = async () => {
      const allowedAdmin = await isAdmin();

      if (!allowedAdmin) {
        window.location.href = "/";
        return;
      }

      setAllowed(true);
      await loadItems();
    };

    checkAccess();
  }, []);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setImageUrl("");
    setLinkUrl("");
    setLabel("Evento");
    setSortOrder(1);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("Agrega un título.");
      return;
    }

    setSaving(true);

    const { error } = await supabase.from("sponsors_events").insert({
      title: title.trim(),
      description: description.trim() || null,
      image_url: imageUrl.trim() || null,
      link_url: linkUrl.trim() || null,
      label: label.trim() || "Evento",
      sort_order: sortOrder,
      is_active: true,
    });

    setSaving(false);

    if (error) {
      console.error("Error creating event:", error.message);
      alert("No se pudo crear el evento.");
      return;
    }

    resetForm();
    await loadItems();
  };

  const toggleActive = async (item: SponsorEvent) => {
    const { error } = await supabase
      .from("sponsors_events")
      .update({ is_active: !item.is_active })
      .eq("id", item.id);

    if (error) {
      alert("No se pudo actualizar.");
      return;
    }

    await loadItems();
  };

  const deleteItem = async (id: string) => {
    const ok = confirm("¿Eliminar este evento/patrocinador?");
    if (!ok) return;

    const { error } = await supabase
      .from("sponsors_events")
      .delete()
      .eq("id", id);

    if (error) {
      alert("No se pudo eliminar.");
      return;
    }

    await loadItems();
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
          <div className="conexionrock-admin-events-hero">
            <p className="conexionrock-eyebrow uk-margin-small-bottom">
              ADMINISTRACIÓN
            </p>

            <h1 className="conexionrock-events-title uk-margin-remove">
              Eventos y patrocinadores
            </h1>

            <p className="conexionrock-muted uk-margin-small-top">
              Crea y administra los espacios que aparecen en el sidebar y en la
              página de eventos.
            </p>
          </div>

          <section className="conexionrock-admin-events-layout uk-margin-large-top">
            <form onSubmit={handleCreate} className="conexionrock-admin-form">
              <h2>Nuevo espacio</h2>

              <label>Título</label>
              <input
                className="uk-input conexionrock-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej. Festival conexionrock 2026"
              />

              <label>Descripción</label>
              <textarea
                className="uk-textarea conexionrock-input conexionrock-textarea"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descripción del evento o patrocinador"
              />

              <label>URL de imagen</label>
              <input
                className="uk-input conexionrock-input"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://..."
              />

              <label>Link</label>
              <input
                className="uk-input conexionrock-input"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="/events o https://..."
              />

              <label>Etiqueta</label>
              <select
                className="uk-select conexionrock-select"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
              >
                <option>Evento</option>
                <option>Patrocinador</option>
                <option>Campaña</option>
                <option>Aliado</option>
              </select>

              <label>Orden</label>
              <input
                type="number"
                className="uk-input conexionrock-input"
                value={sortOrder}
                onChange={(e) => setSortOrder(Number(e.target.value))}
              />

              <button
                type="submit"
                className="uk-button conexionrock-button uk-width-1-1"
                disabled={saving}
              >
                {saving ? "Guardando..." : "Crear espacio"}
              </button>
            </form>

            <div className="conexionrock-admin-list">
              <h2>Publicados</h2>

              {loading ? (
                <p className="conexionrock-muted">Cargando...</p>
              ) : items.length === 0 ? (
                <p className="conexionrock-muted">
                  Todavía no hay espacios creados.
                </p>
              ) : (
                <div className="conexionrock-admin-items">
                  {items.map((item) => (
                    <article key={item.id} className="conexionrock-admin-item">
                      {item.image_url ? (
                        <img src={item.image_url} alt={item.title} />
                      ) : (
                        <div className="conexionrock-admin-placeholder">
                          {item.label || "Evento"}
                        </div>
                      )}

                      <div>
                        <p className="conexionrock-event-label">
                          {item.label || "Evento"} · Orden{" "}
                          {item.sort_order || 0}
                        </p>

                        <h3>{item.title}</h3>

                        <p>{item.description || "Sin descripción"}</p>

                        <div className="conexionrock-admin-actions">
                          <button
                            type="button"
                            onClick={() => toggleActive(item)}
                          >
                            {item.is_active ? "Desactivar" : "Activar"}
                          </button>

                          <button
                            type="button"
                            onClick={() => deleteItem(item.id)}
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
