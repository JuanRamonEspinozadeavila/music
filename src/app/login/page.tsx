"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

const ALLOWED_DOMAIN = "@grupoconexionrock.com";
const ALLOWED_EMAILS = ["idiwjr@gmail.com", "janeth.salas@brvo.mx"];

function isAllowedEmail(email: string) {
  const cleanEmail = email.toLowerCase().trim();

  return (
    cleanEmail.endsWith(ALLOWED_DOMAIN) || ALLOWED_EMAILS.includes(cleanEmail)
  );
}

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "register">("login");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const validateEmailDomain = (cleanEmail: string) => {
    if (!isAllowedEmail(cleanEmail)) {
      alert(
        "Solo se permiten correos @grupoconexionrock.com o correos autorizados."
      );
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    try {
      setLoading(true);

      const cleanName = name.trim();
      const cleanEmail = email.trim().toLowerCase();

      if (!cleanName) {
        alert("Escribe tu nombre");
        return;
      }

      if (!cleanEmail) {
        alert("Escribe tu correo");
        return;
      }

      if (!validateEmailDomain(cleanEmail)) return;

      if (!password) {
        alert("Escribe tu contraseña");
        return;
      }

      const { error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            display_name: cleanName,
          },
        },
      });

      if (error) {
        alert(error.message);
        return;
      }

      alert(
        "Registro exitoso. Revisa tu correo para confirmar tu cuenta antes de iniciar sesión."
      );

      setMode("login");
    } catch (err) {
      console.error(err);
      alert("Error en registro");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    try {
      setLoading(true);

      const cleanEmail = email.trim().toLowerCase();

      if (!cleanEmail) {
        alert("Escribe tu correo");
        return;
      }

      if (!validateEmailDomain(cleanEmail)) return;

      if (!password) {
        alert("Escribe tu contraseña");
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (error) {
        alert(error.message);
        return;
      }

      window.location.href = "/";
    } catch (err) {
      console.error(err);
      alert("Error en login");
    } finally {
      setLoading(false);
    }
  };

  const handleGuest = () => {
    window.location.href = "/";
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#121212",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "30px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "500px",
          background: "#181818",
          padding: "40px",
          borderRadius: "24px",
          border: "1px solid #252525",
        }}
      >
        <h1
          style={{
            color: "#1DB954",
            fontSize: "46px",
            fontWeight: "bold",
            marginBottom: "12px",
          }}
        >
          conexionrock Music
        </h1>

        <p style={{ color: "#999", marginBottom: "24px" }}>
          Inicia sesión o entra como invitado para escuchar música.
        </p>

        <button
          type="button"
          onClick={handleGuest}
          disabled={loading}
          style={{
            width: "100%",
            height: "50px",
            borderRadius: "999px",
            border: "1px solid #1DB954",
            background: "transparent",
            color: "#1DB954",
            fontWeight: "bold",
            cursor: "pointer",
            marginBottom: "24px",
          }}
        >
          Continuar como invitado
        </button>

        <div style={{ display: "flex", gap: "10px", marginBottom: "25px" }}>
          <button
            type="button"
            onClick={() => setMode("login")}
            disabled={loading}
            style={{
              flex: 1,
              height: "48px",
              borderRadius: "999px",
              border: "none",
              background: mode === "login" ? "#1DB954" : "#252525",
              color: mode === "login" ? "#000" : "#fff",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Iniciar sesión
          </button>

          <button
            type="button"
            onClick={() => setMode("register")}
            disabled={loading}
            style={{
              flex: 1,
              height: "48px",
              borderRadius: "999px",
              border: "none",
              background: mode === "register" ? "#1DB954" : "#252525",
              color: mode === "register" ? "#000" : "#fff",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Registrarse
          </button>
        </div>

        {mode === "register" && (
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nombre"
            style={inputStyle}
          />
        )}

        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Correo"
          type="email"
          style={inputStyle}
        />

        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña"
          type="password"
          style={inputStyle}
        />

        <button
          type="button"
          onClick={mode === "login" ? handleLogin : handleRegister}
          disabled={loading}
          style={{
            width: "100%",
            height: "52px",
            borderRadius: "999px",
            border: "none",
            background: "#1DB954",
            color: "#000",
            fontWeight: "bold",
            cursor: "pointer",
            marginTop: "10px",
          }}
        >
          {loading
            ? "Procesando..."
            : mode === "login"
              ? "Entrar"
              : "Crear cuenta"}
        </button>

        <p
          style={{
            color: "#777",
            fontSize: "13px",
            marginTop: "20px",
            lineHeight: 1.5,
          }}
        >
          Como invitado puedes escuchar música, ver biblioteca y eventos. Para
          guardar favoritos necesitas iniciar sesión.
        </p>
      </div>
    </main>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  height: "50px",
  borderRadius: "14px",
  border: "1px solid #333",
  background: "#101010",
  color: "#fff",
  padding: "0 16px",
  marginBottom: "14px",
  outline: "none",
};