// Base de datos local con IndexedDB usando idb (window.idb)
let dbPromise = null;

function abrirDB() {
  if (dbPromise) return dbPromise;
  dbPromise = idb.openDB("ayuno-db", 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("perfil")) {
        db.createObjectStore("perfil");
      }
      if (!db.objectStoreNames.contains("pesos")) {
        db.createObjectStore("pesos", { keyPath: "fecha" });
      }
      if (!db.objectStoreNames.contains("comidas")) {
        db.createObjectStore("comidas", { keyPath: "id", autoIncrement: true });
      }
      if (!db.objectStoreNames.contains("menus")) {
        db.createObjectStore("menus", { keyPath: "id", autoIncrement: true });
      }
      if (!db.objectStoreNames.contains("super")) {
        db.createObjectStore("super", { keyPath: "id", autoIncrement: true });
      }
    }
  });
  return dbPromise;
}

const DB = {
  // --- Perfil ---
  async guardarPerfil(datos) {
    const db = await abrirDB();
    await db.put("perfil", datos, "datos");
  },
  async leerPerfil() {
    const db = await abrirDB();
    return (await db.get("perfil", "datos")) || {};
  },

  // --- Pesos ---
  async guardarPeso(fecha, peso) {
    const db = await abrirDB();
    await db.put("pesos", { fecha, peso: Number(peso) });
  },
  async leerPesos() {
    const db = await abrirDB();
    return (await db.getAll("pesos")).sort((a, b) => a.fecha.localeCompare(b.fecha));
  },

  // --- Comidas registradas ---
  async guardarComida(registro) {
    const db = await abrirDB();
    await db.add("comidas", registro);
  },
  async leerComidas() {
    const db = await abrirDB();
    return await db.getAll("comidas");
  },

  // --- Menús ---
  async guardarMenu(menu) {
    const db = await abrirDB();
    await db.add("menus", menu);
  },
  async leerMenus() {
    const db = await abrirDB();
    return await db.getAll("menus");
  },
  async borrarMenus() {
    const db = await abrirDB();
    await db.clear("menus");
  },

  // --- Lista de súper ---
  async guardarItemSuper(item) {
    const db = await abrirDB();
    await db.add("super", item);
  },
  async leerSuper() {
    const db = await abrirDB();
    return await db.getAll("super");
  },
  async actualizarItemSuper(item) {
    const db = await abrirDB();
    await db.put("super", item);
  },
  async borrarSuper() {
    const db = await abrirDB();
    await db.clear("super");
  }
};
