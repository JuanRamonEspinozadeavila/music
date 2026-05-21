"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function TestSupabasePage() {
  const [status, setStatus] = useState("Testing...");
  const [urlLoaded, setUrlLoaded] = useState(false);
  const [keyLoaded, setKeyLoaded] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const testConnection = async () => {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      setUrlLoaded(Boolean(url));
      setKeyLoaded(Boolean(key));

      if (!url || !key) {
        setStatus("Missing Supabase environment variables");
        return;
      }

      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        setStatus(`Supabase connected, auth check returned: ${error.message}`);
        return;
      }

      setUserEmail(user?.email ?? null);
      setStatus("Supabase connected successfully");
    };

    testConnection();
  }, []);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#121212",
        color: "white",
        padding: "40px",
      }}
    >
      <h1>Supabase Connection Test</h1>

      <div
        style={{
          background: "#181818",
          padding: "24px",
          borderRadius: "16px",
          maxWidth: "700px",
        }}
      >
        <p>
          <strong>Status:</strong> {status}
        </p>

        <p>
          <strong>URL loaded:</strong> {urlLoaded ? "Yes" : "No"}
        </p>

        <p>
          <strong>Anon key loaded:</strong> {keyLoaded ? "Yes" : "No"}
        </p>

        <p>
          <strong>Current user:</strong> {userEmail ?? "No active session"}
        </p>
      </div>
    </main>
  );
}