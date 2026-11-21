import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// Encaminha cada pessoa para a sua área, conforme o perfil.
export default async function Ir() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/entrar?next=/ir");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.role === "admin") redirect("/admin");
  if (profile?.role === "professional") redirect("/profissional");
  redirect("/cliente");
}
