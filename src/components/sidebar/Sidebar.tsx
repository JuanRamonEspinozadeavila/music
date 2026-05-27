"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CDO_OPTIONS } from "@/types/cdo";
import { LiveRadioPlayer } from "./LiveRadioPlayer";
import { SponsorEventCard } from "./SponsorEventCard";
import { isAdmin } from "@/lib/isAdmin";

const publicMenuItems = [
  { label: "Inicio", href: "/", icon: "⌂" },
  { label: "Buscar", href: "/search", icon: "⌕" },
  { label: "Tu biblioteca", href: "/library", icon: "▣" },
  { label: "Favoritos", href: "/favorites", icon: "♡" },
  { label: "Eventos", href: "/events", icon: "◉" },
];

const adminMenuItems = [
  { label: "Subir contenido", href: "/admin/upload", icon: "＋" },
  { label: "Administrar", href: "/admin/media", icon: "✎" },
  { label: "Admin eventos", href: "/admin/events", icon: "✦" },
];

export function Sidebar() {
  const router = useRouter();
  const [allowedAdmin, setAllowedAdmin] = useState(false);

  useEffect(() => {
    const checkAccess = async () => {
      const allowed = await isAdmin();
      setAllowedAdmin(allowed);
    };

    checkAccess();
  }, []);

  const menuItems = allowedAdmin
    ? [...publicMenuItems, ...adminMenuItems]
    : publicMenuItems;

  const handleCdoChange = (value: string) => {
    if (!value) return;
    router.push(`/playlist/${encodeURIComponent(value)}`);
  };

  return (
    <aside className="conexionrock-sidebar uk-visible@m">
      <div className="conexionrock-sidebar-inner">
        <Link href="/" className="conexionrock-brand-card">
          <img
            src="/LogoCR.webp"
            alt="Logo Radioconexionrock"
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
                <Link href={item.href} className="conexionrock-sidebar-link">
                  <span className="conexionrock-sidebar-icon">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <LiveRadioPlayer />
        <SponsorEventCard />

        <div className="conexionrock-cdo-card">
          <p className="conexionrock-cdo-title">Playlists CDO</p>

          <select
            className="uk-select conexionrock-select"
            aria-label="CDO"
            defaultValue=""
            onChange={(e) => handleCdoChange(e.target.value)}
          >
            <option value="" disabled>
              Selecciona un CDO
            </option>

            {CDO_OPTIONS.map((cdo) => (
              <option key={cdo} value={cdo}>
                {cdo}
              </option>
            ))}
          </select>
        </div>
      </div>
    </aside>
  );
}
