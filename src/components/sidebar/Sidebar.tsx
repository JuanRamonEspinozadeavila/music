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
      <div
        className="uk-padding"
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Link href="/" style={{ textDecoration: "none" }}>
          <div
            className="uk-card brame-card"
            style={{
              padding: "24px",
              marginBottom: "34px",
              borderRadius: "32px",
              background:
                "radial-gradient(circle at top left, rgba(255,77,0,.26), transparent 42%), rgba(255,255,255,.045)",
            }}
          >

            <img src="logo_radio.png" alt="Logo RadioBRAME"  style={{ borderRadius: "20%" }}/>
            <p
              className="uk-text-uppercase uk-margin-small-bottom"
              style={{
                color: "rgba(255,255,255,.55)",
                fontSize: "11px",
                letterSpacing: "0.18em",
                fontWeight: 800,
              }}
            >
              Streaming
            </p>

            <h1
              className="brame-title uk-margin-remove"
              style={{
                fontSize: "42px",
                color: "#fff",
              }}
            >
              BRAME
              <br />
              <span style={{ color: "#ec4305" }}>Music</span>
            </h1>
          </div>
        </Link>

        <nav className="uk-margin-medium-bottom">
          <ul className="uk-nav uk-nav-default">
            {menuItems.map((item) => (
              <li key={item.href} className="uk-margin-small-bottom">
         <Link
  href={item.href}
  className="brame-sidebar-link"
>
  <span className="brame-sidebar-icon">
    {item.icon}
  </span>
  <span>{item.label}</span>
</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div
          className="  "
          style={{
            padding: "22px",
            borderRadius: "28px",
            background:
              "linear-gradient(180deg, rgba(255,255,255,.07), rgba(255,255,255,.035))",
          }}
        >
          <p
            className="uk-text-uppercase uk-margin-small-bottom uk-text-center  "
            style={{
              color: "rgba(113, 252, 0, 1)",
              fontSize: "11px",
              letterSpacing: "0.18em",
              fontWeight: 800,
            }}
          >
            Playlists CDO
          </p>

          <div className="uk-margin">
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
        </div>  <LiveRadioPlayer /> 
      </div>
   
    </aside>
  );
}