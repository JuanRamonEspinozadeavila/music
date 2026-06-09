"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MUSIC_STYLE_OPTIONS } from "@/types/musicStyle";
import { LiveRadioPlayer } from "./LiveRadioPlayer";
import { SponsorEventCard } from "./SponsorEventCard";
import { isAdmin } from "@/lib/isAdmin";
import { supabase } from "@/lib/supabase";

const publicMenuItems = [
  { label: "Inicio", href: "/", icon: "⌂" },
  { label: "Explorar", href: "/search", icon: "⌕" },
  { label: "Eventos", href: "/events", icon: "◉" },
];

const adminMenuItems = [
  { label: "Subir", href: "/admin/upload", icon: "＋" },
  { label: "Contenido", href: "/admin/media", icon: "✎" },
  { label: "Eventos", href: "/admin/events", icon: "✦" },
];

export function Sidebar() {
  const router = useRouter();
  const [allowedAdmin, setAllowedAdmin] = useState(false);

  useEffect(() => {
    const checkAccess = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        setAllowedAdmin(false);
        return;
      }

      const allowed = await isAdmin(user.id);
      setAllowedAdmin(allowed);
    };

    checkAccess();
  }, []);

  const menuItems = allowedAdmin
    ? [...publicMenuItems, ...adminMenuItems]
    : publicMenuItems;

  const handleCategoryChange = (value: string) => {
    if (!value) return;

    router.push(`/playlist/${encodeURIComponent(value)}`);
  };

  return (
    <aside className="conexionrock-sidebar uk-visible@m">
      <div className="conexionrock-sidebar-inner">
        <Link href="/" className="conexionrock-brand-card">
          <img
            src="/LogoCR.webp"
            alt="Logo Conexion Rock"
            className="conexionrock-brand-logo"
          />

          <div>
            <p className="conexionrock-brand-kicker">Streaming</p>

            <h1 className="conexionrock-brand-title">
              conexionrock <span>Music</span>
            </h1>
          </div>
        </Link>

        <nav className="conexionrock-sidebar-nav">
          <ul className="uk-nav uk-nav-default">
            {menuItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="conexionrock-sidebar-link"
                >
                  <span className="conexionrock-sidebar-icon">
                    {item.icon}
                  </span>

                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <LiveRadioPlayer />

        <SponsorEventCard />

        <div className="conexionrock-cdo-card">
          <p className="conexionrock-cdo-title">
            Categorías
          </p>

          <select
            className="uk-select conexionrock-select"
            aria-label="Categorías"
            defaultValue=""
            onChange={(e) =>
              handleCategoryChange(e.target.value)
            }
          >
            <option value="" disabled>
              Explorar categoría
            </option>

            {MUSIC_STYLE_OPTIONS.map((style) => (
              <option key={style} value={style}>
                {style}
              </option>
            ))}
          </select>
        </div>
      </div>
    </aside>
  );
}