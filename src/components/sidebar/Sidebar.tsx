"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { CDO_OPTIONS } from "@/types/cdo";
import { LiveRadioPlayer } from "./LiveRadioPlayer";

const menuItems = [
  { label: "Inicio", href: "/", icon: "⌂" },
  { label: "Buscar", href: "/search", icon: "⌕" },
  { label: "Tu biblioteca", href: "/library", icon: "▣" },
  { label: "Favoritos", href: "/favorites", icon: "♡" },
  { label: "Subir contenido", href: "/admin/upload", icon: "＋" },
  { label: "Administrar", href: "/admin/media", icon: "✎" },
];

export function Sidebar() {
  const router = useRouter();

  const handleCdoChange = (value: string) => {
    if (!value) return;
    router.push(`/playlist/${encodeURIComponent(value)}`);
  };

  return (
    <aside className="brame-sidebar uk-visible@m">
      <div className="brame-sidebar-inner">
        <Link href="/" className="brame-brand-card">
          <img
            src="/logo_radio.png"
            alt="Logo RadioBRAME"
            className="brame-brand-logo"
          />

          <div>
            <p className="brame-brand-kicker">Streaming</p>

            <h1 className="brame-brand-title">
              BRAME <span>Music</span>
            </h1>
          </div>
        </Link>

        <nav className="brame-sidebar-nav">
          <ul className="uk-nav uk-nav-default">
            {menuItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="brame-sidebar-link">
                  <span className="brame-sidebar-icon">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <LiveRadioPlayer />

        <div className="brame-cdo-card">
          <p className="brame-cdo-title">Playlists CDO</p>

          <select
            className="uk-select brame-select"
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