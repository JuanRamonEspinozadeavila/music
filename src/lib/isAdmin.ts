import { supabase } from "@/lib/supabase";

export async function isAdmin() {
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    return false;
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userData.user.id)
    .single();

  if (error) {
    console.error("Error checking admin role:", error.message);
    return false;
  }

  return profile?.role === "admin";
}