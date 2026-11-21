import { createClient } from "@/lib/supabase/server";

export type Flags = Record<string, boolean>;

// Lê os recursos liga/desliga. Se falhar, devolve tudo desligado, menos os críticos.
export async function getFlags(): Promise<Flags> {
  const fallback: Flags = { login: true, formulario: true, orcamento: true };
  try {
    const supabase = createClient();
    const { data, error } = await supabase.from("feature_flags").select("key, enabled");
    if (error || !data) return fallback;
    return Object.fromEntries(data.map((f) => [f.key, f.enabled]));
  } catch {
    return fallback;
  }
}
