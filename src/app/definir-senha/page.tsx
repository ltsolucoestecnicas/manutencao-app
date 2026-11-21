"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

// Serve para: convite de profissional e "esqueci minha senha".
export default function DefinirSenha() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [expired, setExpired] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) setReady(true);
    });
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });
    // Se em alguns segundos não houver sessão, o link provavelmente venceu
    const t = setTimeout(() => setExpired(true), 6000);
    return () => {
      sub.subscription.unsubscribe();
      clearTimeout(t);
    };
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const form = new FormData(e.currentTarget);
    const p1 = String(form.get("p1") ?? "");
    const p2 = String(form.get("p2") ?? "");
    if (p1.length < 8) return setError("A senha precisa ter pelo menos 8 caracteres.");
    if (p1 !== p2) return setError("As senhas não são iguais.");
    setLoading(true);
    try {
      const supabase = createClient();
      const { error: err } = await supabase.auth.updateUser({ password: p1 });
      if (err) {
        setError("Não foi possível salvar a senha. Peça um novo link.");
        return;
      }
      router.refresh();
      router.push("/ir");
    } catch {
      setError("Sem conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  if (!ready) {
    return (
      <div style={{ maxWidth: "26rem", margin: "0 auto" }} className="card stack">
        <h1 style={{ fontSize: "var(--fs-xl)", margin: 0 }}>Definir senha</h1>
        {expired ? (
          <div role="alert" className="alert alert--error">
            Este link venceu ou já foi usado. Peça um novo ao administrador ou use "Esqueci minha senha".
          </div>
        ) : (
          <p role="status" className="hint">Validando seu link...</p>
        )}
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "26rem", margin: "0 auto" }} className="card stack">
      <h1 style={{ fontSize: "var(--fs-xl)", margin: 0 }}>Crie sua senha</h1>
      <form onSubmit={onSubmit} className="stack" noValidate>
        <div className="field">
          <label htmlFor="p1">Nova senha</label>
          <input id="p1" name="p1" type="password" className="input" autoComplete="new-password" required minLength={8} />
          <span className="hint">Mínimo de 8 caracteres.</span>
        </div>
        <div className="field">
          <label htmlFor="p2">Repita a senha</label>
          <input id="p2" name="p2" type="password" className="input" autoComplete="new-password" required />
        </div>
        {error && <div role="alert" className="alert alert--error">{error}</div>}
        <button className="btn btn--primary btn--block" type="submit" disabled={loading}>
          {loading ? "Salvando..." : "Salvar senha"}
        </button>
      </form>
    </div>
  );
}
