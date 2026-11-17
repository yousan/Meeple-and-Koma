// 通知履歴の保存。ページと Service Worker の両方から使うので IndexedDB。
// （localStorage は Service Worker から触れない）
(function (global) {
  const DB = "ameyaka";
  const STORE = "history";

  function open() {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(DB, 1);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(STORE)) {
          db.createObjectStore(STORE, { keyPath: "id", autoIncrement: true });
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  async function tx(mode, fn) {
    const db = await open();
    return new Promise((resolve, reject) => {
      const t = db.transaction(STORE, mode);
      const req = fn(t.objectStore(STORE));
      t.oncomplete = () => resolve(req && req.result);
      t.onerror = () => reject(t.error);
    });
  }

  global.AmeyakaStore = {
    add: (entry) => tx("readwrite", (s) => s.add({ at: Date.now(), ...entry })),
    all: async () => {
      const list = (await tx("readonly", (s) => s.getAll())) || [];
      return list.sort((a, b) => b.at - a.at);
    },
    clear: () => tx("readwrite", (s) => s.clear()),
  };
})(self);
