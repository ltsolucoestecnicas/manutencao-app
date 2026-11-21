"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import InstallButton from "./InstallButton";

export default function BottomNav({ loggedIn }: { loggedIn: boolean }) {
  const path = usePathname();
  const item = (href: string, label: string, icon: string) => (
    <Link href={href} aria-current={path === href ? "page" : undefined}>
      <span aria-hidden="true">{icon}</span>
      {label}
    </Link>
  );
  return (
    <nav className="bottom-nav" aria-label="Navegação principal">
      {item("/", "Início", "🏠")}
      {item(loggedIn ? "/ir" : "/entrar", loggedIn ? "Minha área" : "Entrar", "👤")}
      <InstallButton />
    </nav>
  );
}
