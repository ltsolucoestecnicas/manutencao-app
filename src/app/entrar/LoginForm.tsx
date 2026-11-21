"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { safeNext } from "@/lib/safe-next";

type Mode = "entrar" | "criar" | "recuperar";

export default function LoginForm({ googleEnabled, next }: { googleEnabled: boolean; next: string }) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("entrar");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setInfo("");
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");
    const name = String(form.get("name") ?? "").trim();
    const supabase = createClient();
    const target = safeNext(next);
    setLoading(true);
    try {
      if (mode === "entrar") {
        const { error: err } = await supabase.auth.signInWithPassword({ email, password });
        if (err) {
          setError("E-mail ou senha incorretos. Confira e tente de novo.");
          return;
        }
        router.refresh();
        router.push(target);
      } else if (mode === "criar") {
        if (name.length < 3) return setError("Informe seu nome completo.");
        if (password.length < 8) return setError("A senha precisa ter pelo menos 8 caracteres.");
        const { data, error: err } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: name },
            emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(target)}`,
          },
        });
        if (err) {
          setError("Não foi possível criar a conta. Verifique os dados ou tente entrar.");
          return;
        }
        if (data.session) {
          router.refresh();
          router.push(target);
        } else {
          setInfo("Enviamos um e-mail para confirmar sua conta. Abra o link e volte aqui.");
        }
      } else {
        const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/definir-senha`,
        });
        if (err) {
          setError("Não foi possível enviar o e-mail agora. Tente novamente.");
          return;
        }
        // Mesma mensagem exista ou não a conta (não revela quem é cliente)
        setInfo("Se este e-mail tiver conta, enviamos um link para criar uma nova senha.");
      }
    } catch {
      setError("Sem conexão. Verifique sua internet e tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  async function google() {
    setError("");
    const supabase = createClient();
    const { error: err } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(safeNext(next))}` },
    });
    if (err) setError("Não foi possível entrar com o Google agora.");
  }

  return (
    <div className="card stack">
      <div className="tabs" role="tablist" aria-label="Escolha uma opção">
        <button type="button" role="tab" aria-selected={mode === "entrar"} className="btn btn--secondary" onClick={() => setMode("entrar")}>Entrar</button>
        <button type="button" role="tab" aria-selected={mode === "criar"} className="btn btn--secondary" onClick={() => setMode("criar")}>Criar conta</button>
      </div>

      <form onSubmit={onSubmit} className="stack" noValidate>
        {mode === "criar" && (
          <div className="field">
            <label htmlFor="name">Nome completo</label>
            <input id="name" name="name" className="input" autoComplete="name" required />
          </div>
        )}
        <div className="field">
          <label htmlFor="email">E-mail</label>
          <input id="email" name="email" type="email" inputMode="email" className="input" autoComplete="email" required />
        </div>
        {mode !== "recuperar" && (
          <div className="field">
            <label htmlFor="password">Senha</label>
            <input id="password" name="password" type="password" className="input" required
              autoComplete={mode === "criar" ? "new-password" : "current-password"} minLength={mode === "criar" ? 8 : undefined} />
            {mode === "criar" && <span className="hint">Mínimo de 8 caracteres.</span>}
          </div>
        )}

        {error && <div role="alert" className="alert alert--error">{error}</div>}
        {info && <div role="status" className="alert alert--ok">{info}</div>}

        <button className="btn btn--primary btn--block" type="submit" disabled={loading}>
          {loading ? "Aguarde..." : mode === "entrar" ? "Entrar" : mode === "criar" ? "Criar conta" : "Enviar link"}
        </button>
      </form>

      {mode === "criar" && (
        <p className="hint">
          Ao criar a conta, você concorda com os Termos e a Política de Privacidade (textos finais em breve).
        </p>
      )}

      {googleEnabled && mode !== "recuperar" && (
        <button type="button" className="btn btn--secondary btn--block" onClick={google}>
          Entrar com Google
        </button>
      )}

      {mode === "entrar" && (
        <button type="button" className="btn btn--ghost" onClick={() => setMode("recuperar")}>
          Esqueci minha senha
        </button>
      )}
      {mode === "recuperar" && (
        <button type="button" className="btn btn--ghost" onClick={() => setMode("entrar")}>
          Voltar para entrar
        </button>
      )}
    </div>
  );
}
