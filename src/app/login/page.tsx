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
        "Solo se permiten correos @grupoconexionrock.com o correos autorizados.",
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

      if (!validateEmailDomain(cleanEmail)) {
        return;
      }

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
        "Registro exitoso. Revisa tu correo para confirmar tu cuenta antes de iniciar sesión.",
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

      if (!validateEmailDomain(cleanEmail)) {
        return;
      }

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
            fontSize: "48px",
            fontWeight: "bold",
            marginBottom: "12px",
          }}
        >
          conexionrock Music
        </h1>

        <p
          style={{
            color: "#999",
            marginBottom: "30px",
          }}
        >
          Acceso exclusivo para correos @grupoconexionrock.com
        </p>

        <div
          style={{
            display: "flex",
            gap: "10px",
            marginBottom: "25px",
          }}
        >
          <button
            type="button"
            onClick={() => setMode("login")}
            disabled={loading}
            style={{
              flex: 1,
              height: "48px",
              borderRadius: "999px",
              border: "none",
              background: mode === "login" ? "#1DB954" : "#111",
              color: mode === "login" ? "#000" : "#fff",
              fontWeight: "bold",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            LOGIN
          </button>

          <button
            type="button"
            onClick={() => setMode("register")}
            disabled={loading}
            style={{
              flex: 1,
              height: "48px",
              borderRadius: "999px",
              border: "1px solid #333",
              background: mode === "register" ? "#1DB954" : "#111",
              color: mode === "register" ? "#000" : "#fff",
              fontWeight: "bold",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            REGISTER
          </button>
        </div>

        {mode === "register" && (
          <input
            type="text"
            placeholder="Name"
            value={name}
            disabled={loading}
            onChange={(e) => setName(e.target.value)}
            style={{
              width: "100%",
              height: "52px",
              marginBottom: "15px",
              borderRadius: "12px",
              border: "1px solid #333",
              background: "#111",
              color: "#fff",
              padding: "0 15px",
              fontSize: "16px",
              boxSizing: "border-box",
            }}
          />
        )}

        <input
          type="email"
          placeholder="Email @grupoconexionrock.com"
          value={email}
          disabled={loading}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: "100%",
            height: "52px",
            marginBottom: "15px",
            borderRadius: "12px",
            border: "1px solid #333",
            background: "#111",
            color: "#fff",
            padding: "0 15px",
            fontSize: "16px",
            boxSizing: "border-box",
          }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          disabled={loading}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            height: "52px",
            marginBottom: "25px",
            borderRadius: "12px",
            border: "1px solid #333",
            background: "#111",
            color: "#fff",
            padding: "0 15px",
            fontSize: "16px",
            boxSizing: "border-box",
          }}
        />

        <button
          type="button"
          onClick={mode === "login" ? handleLogin : handleRegister}
          disabled={loading}
          style={{
            width: "100%",
            height: "56px",
            borderRadius: "999px",
            border: "none",
            background: "#1DB954",
            color: "#000",
            fontWeight: "bold",
            fontSize: "16px",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "LOADING..." : mode === "login" ? "LOGIN" : "REGISTER"}
        </button>
      </div>
    </main>
  );
}
