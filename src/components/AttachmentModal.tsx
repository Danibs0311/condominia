"use client";

import { useEffect } from "react";
import { X, Download, FileText, ZoomIn, ExternalLink } from "lucide-react";

export interface Attachment {
  name: string;
  type: "image" | "pdf";
  url: string;
}

interface AttachmentModalProps {
  attachment: Attachment | null;
  onClose: () => void;
}

export function AttachmentModal({ attachment, onClose }: AttachmentModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (attachment) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [attachment, onClose]);

  if (!attachment) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-2 sm:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative max-h-[92vh] max-w-4xl w-full flex flex-col rounded-2xl bg-zinc-900 border border-zinc-700/80 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Barra Superior do Modal */}
        <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-950/80 px-4 py-3 text-white">
          <div className="flex items-center gap-2 overflow-hidden">
            {attachment.type === "image" ? (
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600/30 text-blue-400">
                <ZoomIn className="h-4 w-4" />
              </span>
            ) : (
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-600/30 text-red-400">
                <FileText className="h-4 w-4" />
              </span>
            )}
            <span className="truncate text-xs sm:text-sm font-semibold text-zinc-200">
              {attachment.name}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={attachment.url}
              download={attachment.name}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 text-xs font-semibold text-zinc-200 transition"
              title="Baixar arquivo original"
            >
              <Download className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Baixar</span>
            </a>

            <button
              onClick={onClose}
              className="rounded-xl p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white transition"
              aria-label="Fechar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Conteúdo Maximizado */}
        <div className="flex-1 overflow-auto flex items-center justify-center p-2 sm:p-4 bg-zinc-950">
          {attachment.type === "image" ? (
            <div className="relative flex items-center justify-center w-full h-full min-h-[300px] max-h-[78vh]">
              <img
                src={attachment.url}
                alt={attachment.name}
                className="max-h-[78vh] max-w-full rounded-xl object-contain shadow-md"
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 px-6 text-center max-w-md">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/20 text-red-400 mb-4 shadow-lg shadow-red-500/10">
                <FileText className="h-8 w-8" />
              </div>
              <h3 className="text-base font-bold text-white mb-1">{attachment.name}</h3>
              <p className="text-xs text-zinc-400 mb-6">
                Documento oficial do condomínio (Ata, Ordem de Serviço, Nota Fiscal ou Edital).
              </p>
              <div className="flex gap-3">
                <a
                  href={attachment.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 px-4 py-2.5 text-xs font-bold text-white transition shadow-sm"
                >
                  <ExternalLink className="h-4 w-4" /> Abrir no Navegador
                </a>
                <a
                  href={attachment.url}
                  download={attachment.name}
                  className="inline-flex items-center gap-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 px-4 py-2.5 text-xs font-bold text-zinc-200 transition"
                >
                  <Download className="h-4 w-4" /> Baixar PDF
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
