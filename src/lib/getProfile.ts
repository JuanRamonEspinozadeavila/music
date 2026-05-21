import { supabase } from "@/lib/supabase";

export interface CurrentProfile {
  id: string;
  email: string | null;
  display_name: string | null;
  cdo: string | null;
  role: string | null;
}

export async function getCurrentProfile(): Promise<CurrentProfile | null> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return null;
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, email, display_name, cdo, role")
    .eq("id", user.id)
    .single();

  if (profileError) {
    console.error(profileError);
    return null;
  }

  return profile;
}