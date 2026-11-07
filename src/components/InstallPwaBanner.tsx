"use client";

import { useState, useEffect } from "react";
import { Download, X, Smartphone, Check } from "lucide-react";

export function InstallPwaBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Verifica se já foi dispensado nesta sessão
    const dismissed = sessionStorage.getItem("pwa_prompt_dismissed");
    if (dismissed) return;

    // Detecta se já está rodando como PWA instalado
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
      return;
    }

    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    // No iOS Safari não há beforeinstallprompt, mas podemos mostrar para dispositivos mobile
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile && !dismissed) {
      setIsVisible(true);
    }

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setIsVisible(false);
      }
      setDeferredPrompt(null);
    } else {
      // Instrução amigável para iOS / Safari
      alert("Para instalar no seu celular:\n1. Toque no botão de Compartilhar (ícone com seta)\n2. Selecione 'Adicionar à Tela de Início'");
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem("pwa_prompt_dismissed", "true");
  };

  if (!isVisible || isInstalled) return null;

  return (
    <div className="fixed bottom-3 left-3 right-3 z-50 mx-auto max-w-lg rounded-2xl bg-zinc-900/95 p-3.5 text-white shadow-2xl backdrop-blur-md border border-zinc-700/60 transition-all animate-in fade-in slide-in-from-bottom-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white font-bold shadow-md shadow-blue-500/30">
            <Smartphone className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">Instalar o App CondominIA</h4>
            <p className="text-[11px] text-zinc-300">
              Adicione à tela inicial para acesso instantâneo sem digitar endereço.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={handleInstall}
            className="flex items-center gap-1 rounded-xl bg-blue-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-500 transition shadow-sm"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Instalar</span>
          </button>
          <button
            onClick={handleDismiss}
            className="rounded-lg p-1 text-zinc-400 hover:text-white transition"
            aria-label="Fechar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
