"use client";

import { useEffect, useState } from "react";

type InstallEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };

export default function InstallButton() {
  const [evt, setEvt] = useState<InstallEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [showIos, setShowIos] = useState(false);
  const [isIos, setIsIos] = useState(false);

  useEffect(() => {
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as unknown as { standalone?: boolean }).standalone === true;
    setInstalled(standalone);
    setIsIos(/iphone|ipad|ipod/i.test(navigator.userAgent));

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setEvt(e as InstallEvent);
    };
    const onInstalled = () => setInstalled(true);
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (installed) return null;
  if (!evt && !isIos) return null; // navegador sem suporte: não mostra botão

  async function install() {
    if (evt) {
      await evt.prompt();
      await evt.userChoice;
      setEvt(null);
    } else {
      setShowIos((v) => !v);
    }
  }

  return (
    <>
      <button type="button" onClick={install} aria-expanded={isIos ? showIos : undefined}>
        <span aria-hidden="true">⬇️</span>
        Instalar app
      </button>
      {showIos && (
        <div
          role="dialog"
          aria-label="Como instalar no iPhone"
          className="card"
          style={{ position: "fixed", left: 16, right: 16, bottom: "calc(var(--nav-h) + var(--safe-b) + 12px)", zIndex: 40 }}
        >
          <p style={{ margin: 0 }}>
            Toque em <strong>Compartilhar</strong> e depois em <strong>"Adicionar à Tela de Início"</strong>.
          </p>
          <button type="button" className="btn btn--secondary btn--block" style={{ marginTop: 12 }} onClick={() => setShowIos(false)}>
            Entendi
          </button>
        </div>
      )}
    </>
  );
}
