"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

import { Sidebar } from "@/components/sidebar/Sidebar";
import { SongGrid } from "@/components/playlist/SongGrid";
import { Song } from "@/types/song";

interface MediaItem {
    id: string;
    title: string | null;
    artist: string | null;
    description: string | null;
    type: "song" | "podcast";
    cdo: string | null;
    audio_url: string | null;
    cover_url: string | null;
}

export default function LibraryPage() {
    const [songs, setSongs] = useState<Song[]>([]);
    const [podcasts, setPodcasts] = useState<Song[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadLibrary = async () => {
            const { data, error } = await supabase
                .from("media_items")
                .select("id,title,artist,description,type,cdo,audio_url,cover_url")
                .order("id", { ascending: false });

            if (error) {
                console.error("Library error:", error.message);
                setSongs([]);
                setPodcasts([]);
                setLoading(false);
                return;
            }

            const mappedItems: Song[] = ((data || []) as MediaItem[]).map((item) => ({
                id: item.id,
                title: item.title || "Sin título",
                artist: item.artist || "conexionrock Music",
                description: item.description || "",
                type: item.type,
                cdo: item.cdo || "",
                audio: item.audio_url || "",
                cover:
                    item.cover_url ||
                    "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=800&auto=format&fit=crop",
            }));

            setSongs(mappedItems.filter((item) => item.type === "song"));
            setPodcasts(mappedItems.filter((item) => item.type === "podcast"));
            setLoading(false);
        };

        loadLibrary();
    }, []);

    if (loading) {
        return (
            <main className="conexionrock-shell uk-flex uk-flex-center uk-flex-middle">
                <div className="uk-card conexionrock-card uk-card-body">
                    <p className="conexionrock-muted uk-margin-remove">
                        Cargando biblioteca...
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
                    paddingBottom: "140px",
                    minWidth: 0,
                }}
            >
                <div className="uk-container uk-container-expand uk-padding-large">
                    <Link href="/" className="conexionrock-muted">
                        ← Volver al inicio
                    </Link>

                    <div className="uk-card conexionrock-card uk-card-body uk-margin-medium-top uk-margin-large-bottom">
                        <p className="uk-text-uppercase conexionrock-muted uk-margin-small-bottom">
                            conexionrock Music
                        </p>

                        <h1 className="conexionrock-title uk-margin-remove">
                            Tu biblioteca
                        </h1>

                        <p className="conexionrock-muted uk-margin-small-top">
                            Explora canciones y podcasts disponibles.
                        </p>
                    </div>

                    <section className="uk-margin-large-bottom">
                        <h2 className="conexionrock-section-title">Canciones</h2>

                        {songs.length === 0 ? (
                            <div className="uk-card conexionrock-card uk-card-body">
                                <p className="conexionrock-muted uk-margin-remove">
                                    Todavía no hay canciones cargadas.
                                </p>
                            </div>
                        ) : (
                            <SongGrid songs={songs} />
                        )}
                    </section>

                    <section>
                        <h2 className="conexionrock-section-title">Podcasts</h2>

                        {podcasts.length === 0 ? (
                            <div className="uk-card conexionrock-card uk-card-body">
                                <p className="conexionrock-muted uk-margin-remove">
                                    Todavía no hay podcasts cargados.
                                </p>
                            </div>
                        ) : (
                            <SongGrid songs={podcasts} />
                        )}
                    </section>
                </div>
            </section>
        </main>
    );
}