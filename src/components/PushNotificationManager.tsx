"use client";

import { useState, useEffect } from "react";
import {
  isPushSupported,
  getNotificationPermission,
  requestPushPermission,
  sendPushNotification,
} from "@/lib/push-notifications";
import { Bell, BellRing, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";

interface PushNotificationManagerProps {
  condoName: string;
  unitNumber?: string;
  role: "resident" | "syndic";
}

export function PushNotificationManager({
  condoName,
  unitNumber,
  role,
}: PushNotificationManagerProps) {
  const [permission, setPermission] = useState<NotificationPermission | "unsupported">("default");
  const [supported, setSupported] = useState(false);
  const [testSent, setTestSent] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const isSup = isPushSupported();
    setSupported(isSup);
    if (isSup) {
      setPermission(getNotificationPermission());
    }
  }, []);

  const handleRequestPermission = async () => {
    setLoading(true);
    const result = await requestPushPermission();
    setPermission(result);
    setLoading(false);

    if (result === "granted") {
      // Dispara uma notificação de boas-vindas imediatamente
      sendPushNotification({
        title: `CondominIA • ${condoName}`,
        body:
          role === "resident"
            ? `Notificações ativadas para o Apto ${unitNumber || "101"}! Você receberá suas cotas e avisos aqui.`
            : "Notificações ativadas para o Painel do Síndico!",
        url: role === "resident" ? "/morador" : "/sindico",
      });
      setTestSent(true);
      setTimeout(() => setTestSent(false), 5000);
    }
  };

  const handleSendTestPush = async () => {
    setLoading(true);
    const success = await sendPushNotification({
      title: `🔔 CondominIA • ${condoName}`,
      body:
        role === "resident"
          ? `[Teste] Olá, Apto ${unitNumber || "101"}! Seu aparelho está configurado para receber avisos e cobranças.`
          : "[Teste] Alerta de teste do Síndico recebido com sucesso!",
      url: role === "resident" ? "/morador" : "/sindico",
    });
    setLoading(false);
    if (success) {
      setTestSent(true);
      setTimeout(() => setTestSent(false), 4000);
    }
  };

  if (!supported) {
    return null;
  }

  // Se já foi concedida a permissão
  if (permission === "granted") {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs shrink-0">
            <BellRing className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-emerald-950">
                Notificações ativas neste aparelho
              </span>
              <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-200 px-2 py-0.5 text-[9px] font-black uppercase text-emerald-900">
                <CheckCircle2 className="h-2.5 w-2.5" /> Ativo
              </span>
            </div>
            <p className="text-[11px] text-emerald-800">
              Você receberá avisos na tela sempre que houver novo rateio ou comunicado.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSendTestPush}
          disabled={loading}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-emerald-300 bg-white px-3.5 py-1.5 text-xs font-bold text-emerald-800 hover:bg-emerald-100 transition shadow-2xs cursor-pointer shrink-0 disabled:opacity-50"
        >
          <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
          <span>{testSent ? "Alerta Enviado!" : "Testar Notificação"}</span>
        </button>
      </div>
    );
  }

  // Se a permissão foi negada no navegador
  if (permission === "denied") {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-3.5 shadow-xs flex items-center gap-2.5 text-xs text-amber-900">
        <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
        <span>
          As notificações estão bloqueadas nas configurações do seu navegador. Para receber avisos de contas no celular, clique no cadeado ao lado do endereço e habilite as notificações.
        </span>
      </div>
    );
  }

  // Permissão padrão (ainda não solicitada)
  return (
    <div className="rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50/90 via-indigo-50/60 to-purple-50/40 p-4 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20 shrink-0">
          <Bell className="h-5 w-5" />
        </div>
        <div>
          <h4 className="text-xs font-extrabold text-zinc-900">
            Deseja receber avisos de fechamento e cota no seu celular?
          </h4>
          <p className="text-[11px] text-zinc-600 leading-tight mt-0.5">
            Ative as notificações para ser alertado na tela de bloqueio quando a nova cota for calculada.
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={handleRequestPermission}
        disabled={loading}
        className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-blue-500/25 hover:bg-blue-700 active:scale-95 transition cursor-pointer shrink-0 disabled:opacity-50"
      >
        <BellRing className="h-3.5 w-3.5" />
        <span>{loading ? "Ativando..." : "Ativar no Celular"}</span>
      </button>
    </div>
  );
}
