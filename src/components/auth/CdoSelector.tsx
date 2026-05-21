"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Cdo } from "@/types/cdo";

interface Props {
  selectedCdo: string;
  onChange: (name: string) => void;
}

export function CdoSelector({ selectedCdo, onChange }: Props) {
  const [cdos, setCdos] = useState<Cdo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCdos = async () => {
      const { data, error } = await supabase
        .from("cdos")
        .select("id, name, active")
        .eq("active", true)
        .order("name", { ascending: true });

      if (error) {
        console.error(error);
        setLoading(false);
        return;
      }

      setCdos(data || []);
      setLoading(false);
    };

    fetchCdos();
  }, []);

  if (loading) {
    return (
      <div className="uk-margin">
        <p
          style={{
            color: "#999",
            margin: 0,
          }}
        >
          Loading CDO...
        </p>
      </div>
    );
  }

  return (
    <div className="uk-margin">
      <label
        className="uk-form-label"
        style={{
          color: "#fff",
          fontWeight: 700,
          marginBottom: "8px",
          display: "block",
        }}
      >
        Select CDO
      </label>

      <select
        className="uk-select"
        aria-label="Select CDO"
        value={selectedCdo}
        onChange={(e) => onChange(e.target.value)}
        style={{
          background: "#111",
          border: "1px solid #333",
          color: "white",
          borderRadius: "10px",
          height: "48px",
        }}
      >
        <option value="">Select one CDO</option>

        {cdos.map((cdo) => (
          <option key={cdo.id} value={cdo.name}>
            {cdo.name}
          </option>
        ))}
      </select>
    </div>
  );
}