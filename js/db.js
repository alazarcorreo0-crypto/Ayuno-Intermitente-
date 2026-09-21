let dbPromise = null;

function abrirDB() {
  if (dbPromise) return dbPromise;
  dbPromise = idb.openDB("ayuno-db", 2, {
    upgrade(db, oldVersion) {
      if (!db.objectStoreNames.contains("perfil")) db.createObjectStore("perfil");
      if (!db.objectStoreNames.contains("pesos")) db.createObjectStore("pesos", { keyPath: "id", autoIncrement: true });
      if (!db.objectStoreNames.contains("comidas")) db.createObjectStore("comidas", { keyPath: "id", autoIncrement: true });
      if (!db.objectStoreNames.contains("menus")) db.createObjectStore("menus", { keyPath: "id", autoIncrement: true });
      if (!db.objectStoreNames.contains("super")) db.createObjectStore("super", { keyPath: "id", autoIncrement: true });
      if (!db.objectStoreNames.contains("eventos")) db.createObjectStore("eventos", { keyPath: "id", autoIncrement: true });
      if (!db.objectStoreNames.contains("archivo")) db.createObjectStore("archivo", { keyPath: "id", autoIncrement: true });
    }
  });
  return dbPromise;
}

const DB = {
  async guardarPerfil(d) { const db = await abrirDB(); await db.put("perfil", d, "datos"); },
  async leerPerfil() { const db = await abrirDB(); return (await db.get("perfil", "datos")) || {}; },

  async guardarPeso(peso) { const db = await abrirDB(); await db.add("pesos", { fecha: new Date().toISOString(), peso: Number(peso) }); },
  async leerPesos() { const db = await abrirDB(); return (await db.getAll("pesos")).sort((a,b) => a.fecha.localeCompare(b.fecha)); },

  async guardarComida(r) { const db = await abrirDB(); await db.add("comidas", r); },
  async leerComidas() { const db = await abrirDB(); return await db.getAll("comidas"); },

  async guardarMenu(m) { const db = await abrirDB(); await db.add("menus", m); },
  async leerMenus() { const db = await abrirDB(); return await db.getAll("menus"); },
  async borrarMenus() { const db = await abrirDB(); await db.clear("menus"); },
  async actualizarMenu(m) { const db = await abrirDB(); await db.put("menus", m); },

  async guardarItemSuper(i) { const db = await abrirDB(); await db.add("super", i); },
  async leerSuper() { const db = await abrirDB(); return await db.getAll("super"); },
  async actualizarItemSuper(i) { const db = await abrirDB(); await db.put("super", i); },
  async borrarSuperSemanal() {
    const db = await abrirDB();
    const todos = await db.getAll("super");
    for (const it of todos) {
      if (it.semanal) await db.delete("super", it.id);
    }
  },

  async guardarEvento(e) { const db = await abrirDB(); await db.add("eventos", e); },
  async leerEventos() { const db = await abrirDB(); return (await db.getAll("eventos")).sort((a,b) => a.fecha.localeCompare(b.fecha)); },
  async borrarEventos() { const db = await abrirDB(); await db.clear("eventos"); },

  async guardarArchivo(a) { const db = await abrirDB(); await db.add("archivo", a); },
  async leerArchivo() { const db = await abrirDB(); return (await db.getAll("archivo")).sort((a,b) => b.fecha.localeCompare(a.fecha)); }
};