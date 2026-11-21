import type { Metadata, Viewport } from "next";
import Link from "next/link";
import "@/styles/tokens.css";
import "@/styles/globals.css";
import { createClient } from "@/lib/supabase/server";
import BottomNav from "@/components/BottomNav";
import SwRegister from "@/components/SwRegister";
import OfflineBar from "@/components/OfflineBar";

export const metadata: Metadata = {
  title: { default: "Manutenção Fácil", template: "%s | Manutenção Fácil" },
  description: "Peça orçamento de elétrica, hidráulica e ar-condicionado e aprove tudo online.",
  manifest: "/manifest.webmanifest",
  applicationName: "Manutenção Fácil",
  appleWebApp: { capable: true, title: "Manutenção Fácil", statusBarStyle: "default" },
};

export const viewport: Viewport = {
  themeColor: "#0b5fff",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html lang="pt-BR">
      <body>
        <a className="skip-link" href="#conteudo">Ir para o conteúdo</a>
        <OfflineBar />
        <header className="header">
          <div className="header__inner">
            <Link href="/" className="logo">Manutenção Fácil</Link>
            {user ? (
              <form action="/auth/sair" method="post">
                <button className="btn btn--secondary" type="submit">Sair</button>
              </form>
            ) : (
              <Link href="/entrar" className="btn btn--secondary">Entrar</Link>
            )}
          </div>
        </header>
        <main id="conteudo" className="container">{children}</main>
        <BottomNav loggedIn={Boolean(user)} />
        <SwRegister />
      </body>
    </html>
  );
}
