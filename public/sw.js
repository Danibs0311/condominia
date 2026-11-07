// Service Worker para Push Notifications Nativas - CondominIA
const CACHE_NAME = "condominia-sw-v1";

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

// Listener de eventos de Push do Servidor
self.addEventListener("push", (event) => {
  let data = {
    title: "CondominIA • Atualização",
    body: "Você tem uma nova atualização do condomínio.",
    url: "/morador",
    icon: "/logo_condominia.png",
    badge: "/logo_condominia.png",
  };

  if (event.data) {
    try {
      data = { ...data, ...event.data.json() };
    } catch (e) {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: data.icon || "/logo_condominia.png",
    badge: data.badge || "/logo_condominia.png",
    vibrate: [100, 50, 100],
    data: {
      url: data.url || "/morador",
      dateOfArrival: Date.now(),
    },
    actions: [
      { action: "open", title: "Abrir no App" },
      { action: "close", title: "Fechar" },
    ],
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

// Clique na Notificação: foca ou abre a janela do aplicativo
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "close") {
    return;
  }

  const targetUrl = event.notification.data?.url || "/morador";

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      // Se já houver uma janela aberta com o aplicativo, foca nela
      for (const client of clientList) {
        if (client.url.includes(targetUrl) && "focus" in client) {
          return client.focus();
        }
      }
      // Se não houver janela aberta, abre uma nova
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});
