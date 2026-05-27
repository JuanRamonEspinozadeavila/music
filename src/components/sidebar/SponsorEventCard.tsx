"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface SponsorEvent {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  link_url: string | null;
  label: string | null;
}

export function SponsorEventCard() {
  const [items, setItems] = useState<SponsorEvent[]>([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const loadSponsors = async () => {
      const { data, error } = await supabase
        .from("sponsors_events")
        .select("id, title, description, image_url, link_url, label")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });

      if (error) {
        console.error("Error loading sponsors/events:", error.message);
        return;
      }

      setItems(data || []);
    };

    loadSponsors();
  }, []);

  useEffect(() => {
    if (items.length <= 1) return;

    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % items.length);
    }, 6000);

    return () => window.clearInterval(timer);
  }, [items.length]);

  if (items.length === 0) return null;

  const item = items[index];

  return (
    <div className="conexionrock-sponsor-card">
      <p className="conexionrock-sponsor-kicker">
        {item.label || "Patrocinador / Evento"}
      </p>

      {item.image_url ? (
        <img
          src={item.image_url}
          alt={item.title}
          className="conexionrock-sponsor-image"
        />
      ) : (
        <div className="conexionrock-sponsor-box">
          <span>{item.title}</span>
        </div>
      )}

      <p className="conexionrock-sponsor-copy">
        {item.description ||
          "Conoce más detalles de este evento o patrocinador."}
      </p>

      {items.length > 1 && (
        <div className="conexionrock-sponsor-dots">
          {items.map((dot, dotIndex) => (
            <button
              key={dot.id}
              type="button"
              onClick={() => setIndex(dotIndex)}
              className={dotIndex === index ? "is-active" : ""}
              aria-label={`Ver evento ${dotIndex + 1}`}
            />
          ))}
        </div>
      )}

      {item.link_url && (
        <a href={item.link_url} className="conexionrock-sponsor-link">
          Ver más
        </a>
      )}
    </div>
  );
}
