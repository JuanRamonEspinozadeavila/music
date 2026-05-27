"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { CDO_OPTIONS } from "@/types/cdo";
import { isAdmin } from "@/lib/isAdmin";

interface MediaItem {
  id: string;
  title: string;
  artist: string;
  description: string;
  type: "song" | "podcast";
  cdo: string;
  audio_url: string;
  cover_url: string;
  is_featured_content: boolean;
  featured_order: number;
  featured_link: string;
}

export default function AdminMediaPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState("");
  const [allowed, setAllowed] = useState(false);

  const loadItems = async () => {
    const { data, error } = await supabase
      .from("media_items")
      .select(
        "id,title,artist,description,type,cdo,audio_url,cover_url,is_featured_content,featured_order,featured_link",
      )
      .order("id", { ascending: false });

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    setItems((data || []) as MediaItem[]);
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

  const updateItem = (
    id: string,
    field: keyof MediaItem,
    value: string | boolean | number,
  ) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    );
  };

  const saveItem = async (item: MediaItem) => {
    setSavingId(item.id);

    const response = await fetch(`/api/media/${item.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: item.title,
        artist: item.artist,
        description: item.description,
        type: item.type,
        cdo: item.cdo,
        is_featured_content: item.is_featured_content,
        featured_order: item.featured_order || 0,
        featured_link: item.featured_link || "",
      }),
    });

    const result = await response.json();

    setSavingId("");

    if (!response.ok) {
      alert(result.error || "Error al guardar");
      return;
    }

    alert("Contenido actualizado");
  };

  const deleteItem = async (id: string) => {
    const confirmDelete = confirm(
      "¿Seguro que quieres eliminar este contenido?",
    );

    if (!confirmDelete) return;

    const response = await fetch(`/api/media/${id}`, {
      method: "DELETE",
    });

    const result = await response.json();

    if (!response.ok) {
      alert(result.error || "Error al eliminar");
      return;
    }

    setItems((prev) => prev.filter((item) => item.id !== id));
    alert("Contenido eliminado");
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

  if (loading) {
    return (
      <main className="conexionrock-shell uk-flex uk-flex-center uk-flex-middle">
        <div className="uk-card conexionrock-card uk-card-body">
          <p className="conexionrock-muted uk-margin-remove">
            Cargando contenido...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="conexionrock-shell" style={{ minHeight: "100vh" }}>
      <div className="uk-container uk-container-expand uk-padding-large">
        <div className="uk-flex uk-flex-between uk-flex-middle uk-margin-medium-bottom">
          <div>
            <h1 className="conexionrock-title uk-margin-remove">
              Administrar contenido
            </h1>
            <p className="conexionrock-muted uk-margin-small-top">
              Edita canciones, podcasts y contenido destacado de conexionrock
              Music.
            </p>
          </div>

          <a href="/admin/upload" className="uk-button conexionrock-button">
            Subir nuevo
          </a>
        </div>

        <div
          className="uk-card conexionrock-card uk-card-body"
          style={{ overflowX: "auto" }}
        >
          <table className="uk-table uk-table-divider uk-table-middle">
            <thead>
              <tr>
                <th>Portada</th>
                <th>Título</th>
                <th>Artista</th>
                <th>Tipo</th>
                <th>CDO</th>
                <th>Descripción</th>
                <th>Destacado</th>
                <th>Orden</th>
                <th>Link destacado</th>
                <th>Audio</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>
                    {item.cover_url ? (
                      <img
                        src={item.cover_url}
                        alt={item.title}
                        style={{
                          width: "72px",
                          height: "72px",
                          objectFit: "cover",
                          borderRadius: "16px",
                        }}
                      />
                    ) : (
                      <span className="conexionrock-muted">Sin portada</span>
                    )}
                  </td>

                  <td>
                    <input
                      className="uk-input conexionrock-input"
                      value={item.title || ""}
                      onChange={(e) =>
                        updateItem(item.id, "title", e.target.value)
                      }
                    />
                  </td>

                  <td>
                    <input
                      className="uk-input conexionrock-input"
                      value={item.artist || ""}
                      onChange={(e) =>
                        updateItem(item.id, "artist", e.target.value)
                      }
                    />
                  </td>

                  <td>
                    <select
                      className="uk-select conexionrock-select"
                      value={item.type}
                      onChange={(e) =>
                        updateItem(
                          item.id,
                          "type",
                          e.target.value as "song" | "podcast",
                        )
                      }
                    >
                      <option value="song">Canción</option>
                      <option value="podcast">Podcast</option>
                    </select>
                  </td>

                  <td>
                    <select
                      className="uk-select conexionrock-select"
                      value={item.cdo || ""}
                      onChange={(e) =>
                        updateItem(item.id, "cdo", e.target.value)
                      }
                    >
                      <option value="">General</option>
                      {CDO_OPTIONS.map((cdo) => (
                        <option key={cdo} value={cdo}>
                          {cdo}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td>
                    <textarea
                      className="uk-textarea conexionrock-input"
                      value={item.description || ""}
                      rows={3}
                      onChange={(e) =>
                        updateItem(item.id, "description", e.target.value)
                      }
                      style={{ minWidth: "220px", height: "auto" }}
                    />
                  </td>

                  <td>
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        color: "#fff",
                        fontWeight: 800,
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={!!item.is_featured_content}
                        onChange={(e) =>
                          updateItem(
                            item.id,
                            "is_featured_content",
                            e.target.checked,
                          )
                        }
                      />
                      Sí
                    </label>
                  </td>

                  <td>
                    <input
                      type="number"
                      className="uk-input conexionrock-input"
                      value={item.featured_order || 0}
                      onChange={(e) =>
                        updateItem(
                          item.id,
                          "featured_order",
                          Number(e.target.value),
                        )
                      }
                      style={{ minWidth: "90px" }}
                    />
                  </td>

                  <td>
                    <input
                      className="uk-input conexionrock-input"
                      placeholder="https://..."
                      value={item.featured_link || ""}
                      onChange={(e) =>
                        updateItem(item.id, "featured_link", e.target.value)
                      }
                      style={{ minWidth: "220px" }}
                    />
                  </td>

                  <td>
                    <audio controls src={item.audio_url} />
                  </td>

                  <td>
                    <div className="uk-flex uk-flex-column" style={{ gap: 8 }}>
                      <button
                        type="button"
                        className="uk-button conexionrock-button"
                        onClick={() => saveItem(item)}
                        disabled={savingId === item.id}
                      >
                        {savingId === item.id ? "Guardando..." : "Guardar"}
                      </button>

                      <button
                        type="button"
                        className="uk-button conexionrock-button-secondary"
                        onClick={() => deleteItem(item.id)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {items.length === 0 && (
            <p className="conexionrock-muted uk-text-center">
              Todavía no hay contenido cargado.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
