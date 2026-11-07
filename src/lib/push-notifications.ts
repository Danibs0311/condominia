"use client";

// Gerenciador de Push Notifications Nativas (Android, iOS PWA & Desktop)

export interface PushNotificationPayload {
  title: string;
  body: string;
  url?: string;
  icon?: string;
}

const NOTIFICATION_PERMISSION_KEY = "condominia_push_permission_requested_v1";

/**
 * Verifica se o dispositivo suporta Service Worker e Notificações Push
 */
export function isPushSupported(): boolean {
  if (typeof window === "undefined") return false;
  return "serviceWorker" in navigator && "Notification" in window;
}

/**
 * Retorna o status atual de permissão do navegador
 */
export function getNotificationPermission(): NotificationPermission | "unsupported" {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return "unsupported";
  }
  return Notification.permission;
}

/**
 * Registra o Service Worker do CondominIA (/sw.js)
 */
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return null;
  }
  try {
    const registration = await navigator.serviceWorker.register("/sw.js", {
      scope: "/",
    });
    return registration;
  } catch (error) {
    console.error("Falha ao registrar Service Worker do CondominIA:", error);
    return null;
  }
}

/**
 * Solicita a permissão do usuário no Android / iOS / Desktop
 */
export async function requestPushPermission(): Promise<NotificationPermission> {
  if (!isPushSupported()) {
    return "denied";
  }

  try {
    // Registra o Service Worker antes de solicitar a permissão
    await registerServiceWorker();

    const permission = await Notification.requestPermission();
    if (typeof window !== "undefined") {
      localStorage.setItem(NOTIFICATION_PERMISSION_KEY, permission);
    }
    return permission;
  } catch (error) {
    console.error("Erro ao solicitar permissão de notificações:", error);
    return "denied";
  }
}

/**
 * Envia uma notificação Push nativa para a tela do dispositivo
 */
export async function sendPushNotification(payload: PushNotificationPayload): Promise<boolean> {
  if (!isPushSupported()) return false;

  // Se a permissão não foi concedida ainda, tenta solicitar
  if (Notification.permission !== "granted") {
    const permission = await requestPushPermission();
    if (permission !== "granted") return false;
  }

  const title = payload.title || "CondominIA";
  const options: NotificationOptions = {
    body: payload.body,
    icon: payload.icon || "/icon",
    badge: payload.icon || "/icon",
    data: {
      url: payload.url || "/morador",
    },
  };

  try {
    // 1. Tenta disparar via Service Worker (Método recomendado para Android e iOS)
    if ("serviceWorker" in navigator) {
      const registration = await navigator.serviceWorker.ready;
      if (registration && "showNotification" in registration) {
        await registration.showNotification(title, options);
        return true;
      }
    }

    // 2. Fallback para API nativa de notificação
    new Notification(title, options);
    return true;
  } catch (err) {
    console.warn("Disparo de push falhou no Service Worker, tentando fallback...", err);
    try {
      new Notification(title, options);
      return true;
    } catch (e) {
      console.error("Não foi possível exibir a notificação nativa:", e);
      return false;
    }
  }
}
