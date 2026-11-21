import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Painel administrativo" };

export default async function Admin() {
  const supabase = createClient();
  const { data: flags } = await supabase
    .from("feature_flags")
    .select("key, label, enabled, critical")
    .order("key");

  return (
    <div className="stack">
      <h1 style={{ fontSize: "var(--fs-xl)", margin: 0 }}>Painel</h1>
      <div className="card stack">
        <strong>Recursos do site (somente leitura por enquanto)</strong>
        <ul>
          {(flags ?? []).map((f) => (
            <li key={f.key}>
              {f.label}: {f.enabled ? "Ligado" : "Desligado"}
              {f.critical ? " (crítico)" : ""}
            </li>
          ))}
        </ul>
        <p className="hint">Os interruptores e os demais módulos chegam na parte do painel admin.</p>
      </div>
    </div>
  );
}
