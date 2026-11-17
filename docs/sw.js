// ameyaka Service Worker: push を受けて通知を出し、履歴に残す。
importScripts("./store.js");

const CACHE = "ameyaka-v4";
const ASSETS = [
  "./", "./index.html", "./styles.css", "./app.js", "./store.js", "./config.js",
  "./manifest.webmanifest", "./icons/icon-192.png",
];

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).catch(() => {}));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  // 天気 API はキャッシュに落とさない
  if (url.origin !== self.location.origin) return;
  event.respondWith(
    fetch(event.request).catch(() =>
      caches.match(event.request).then((r) => r || caches.match("./index.html"))
    )
  );
});

self.addEventListener("push", (event) => {
  let data = { title: "今日は傘が必要です", body: "雨が予想されています。", kind: "morning" };
  if (event.data) {
    try { data = { ...data, ...event.data.json() }; }
    catch { data.body = event.data.text(); }
  }

  event.waitUntil(
    (async () => {
      await self.registration.showNotification(data.title, {
        body: data.body,
        icon: "./icons/icon-192.png",
        badge: "./icons/icon-192.png",
        tag: data.tag || "ameyaka",
        data: { url: data.url || "./#history" },
      });
      try {
        await AmeyakaStore.add({ kind: data.kind || "morning", title: data.title, body: data.body });
      } catch (e) {
        console.warn("履歴の保存に失敗", e);
      }
      const clientList = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
      for (const c of clientList) c.postMessage({ type: "push-received" });
    })()
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || "./";
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((list) => {
      for (const client of list) {
        if ("focus" in client) {
          client.navigate?.(url).catch(() => {});
          return client.focus();
        }
      }
      return self.clients.openWindow(url);
    })
  );
});
