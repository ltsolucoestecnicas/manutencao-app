import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Área do cliente" };

export default async function Cliente() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user!.id)
    .maybeSingle();

  return (
    <div className="stack">
      <h1 style={{ fontSize: "var(--fs-xl)", margin: 0 }}>Olá, {profile?.full_name ?? "cliente"}</h1>
      <div className="card">
        <strong>Nenhum pedido ainda.</strong>
        <p className="hint">O formulário de pedido chega na próxima parte.</p>
      </div>
    </div>
  );
}
