import { supabase } from "@/lib/supabase";

export async function isAdmin(userId: string) {
  if (!userId) return false;

  const { data, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    console.error("Error checking admin role:", error.message);
    return false;
  }

  return data?.role === "admin";
}