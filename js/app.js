// ============================================================
// App de Ayuno 14:10 — v2
// ============================================================

const AYUNO_HORAS = 14;

const MENU_DEFECTO = {
  Lunes: [
    { comida: "Comida 1", desc: "3 huevos duros + 1/2 aguacate + jitomate con aceite de oliva", kcal: 380 },
    { comida: "Comida 2", desc: "Pechuga a la plancha con orégano + pepino + verduras congeladas", kcal: 420 }
  ],
  Martes: [
    { comida: "Comida 1", desc: "Atún escurrido + 1/2 aguacate + jitomate + tostadas horneadas", kcal: 400 },
    { comida: "Comida 2", desc: "Carne molida magra con cebolla + verduras congeladas mixtas", kcal: 480 }
  ],
  Miércoles: [
    { comida: "Comida 1", desc: "Sardina o atún en aceite de oliva + pepino + almendras", kcal: 420 },
    { comida: "Comida 2", desc: "Filete de tilapia o salmón al sartén + brócoli al vapor", kcal: 400 }
  ],
  Jueves: [
    { comida: "Comida 1", desc: "3 huevos duros + 50 g queso panela + jitomate", kcal: 360 },
    { comida: "Comida 2", desc: "Pechuga de pollo al limón + zanahoria rallada con aceite de oliva", kcal: 430 }
  ],
  Viernes: [
    { comida: "Comida 1", desc: "Atún + 1/2 taza garbanzos + 1/2 aguacate", kcal: 440 },
    { comida: "Comida 2", desc: "Bistec magro a la plancha + pimientos + ensalada pepino/jitomate", kcal: 470 }
  ],
  Sábado: [
    { comida: "Comida 1", desc: "Omelette de 3 huevos con espinacas y queso", kcal: 390 },
    { comida: "Comida 2", desc: "Filete de pescado a la plancha + verduras al microondas + aceite de oliva", kcal: 410 }
  ],
  Domingo: [
    { comida: "Comida 1", desc: "3 huevos revueltos + 1/2 taza frijoles + salsa", kcal: 380 },
    { comida: "Comida 2", desc: "Pollo asado comprado + ensalada pepino/jitomate", kcal: 450 }
  ]
};

const SUPER_BASE = [
  { cat: "Proteínas", nombre: "Huevos (2-3 docenas)" },
  { cat: "Proteínas", nombre: "Atún en agua/aceite (latas)" },
  { cat: "Proteínas", nombre: "Sardinas o garbanzos en lata" },
  { cat: "Proteínas", nombre: "Pechuga de pollo / carne magra" },
  { cat: "Proteínas", nombre: "Queso panela o fresco" },
  { cat: "Vegetales", nombre: "Pepinos y jitomates frescos" },
  { cat: "Vegetales", nombre: "Bolsas de verduras congeladas" },
  { cat: "Vegetales", nombre: "Zanahorias enteras" },
  { cat: "Vegetales", nombre: "Espinaca en caja rígida" },
  { cat: "Vegetales", nombre: "Limones frescos" },
  { cat: "Grasas e hidratación", nombre: "Aceite de oliva extra virgen" },
  { cat: "Grasas e hidratación", nombre: "Aguacates (comprar firmes)" },
  { cat: "Grasas e hidratación", nombre: "Almendras / nueces" },
  { cat: "Grasas e hidratación", nombre: "Tostadas horneadas de maíz" },
  { cat: "Grasas e hidratación", nombre: "Café de buena calidad / té" }
];

// ============================================================
// NAVEGACIÓN
// ============================================================
function initNavegacion() {
  const tabs = document.querySelectorAll(".tab");
  const titulo = document.getElementById("titulo-pantalla");
  const nombres = { hoy: "Hoy", progreso: "Progreso", menus: "Menús", archivo: "Archivo", super: "Súper" };

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("activa"));
      tab.classList.add("activa");
      document.querySelectorAll(".pantalla").forEach((p) => p.classList.remove("activa"));
      document.getElementById(`pantalla-${tab.dataset.pantalla}`).classList.add("activa");
      titulo.textContent = nombres[tab.dataset.pantalla];
      if (tab.dataset.pantalla === "progreso") renderProgreso();
      if (tab.dataset.pantalla === "menus") renderMenus();
      if (tab.dataset.pantalla === "archivo") renderArchivo();
      if (tab.dataset.pantalla === "super") renderSuper();
    });
  });
}

// ============================================================
// RELOJ DE AYUNO BASADO EN EVENTOS
// ============================================================
let intervaloAyuno = null;

async function obtenerUltimoEvento(tipo) {
  const eventos = await DB.leerEventos();
  const filtrados = eventos.filter((e) => e.tipo === tipo);
  return filtrados.length ? filtrados[filtrados.length - 1] : null;
}

async function iniciarCuentaRegresiva() {
  if (intervaloAyuno) clearInterval(intervaloAyuno);

  const actualiza = async () => {
    const ultimoFin = await obtenerUltimoEvento("fin_ayuno");
    const ultimoInicio = await obtenerUltimoEvento("inicio_ayuno");

    const ahora = new Date();
    let objetivo, mensaje, titulo;

    if (ultimoFin && (!ultimoInicio || new Date(ultimoFin.fecha) > new Date(ultimoInicio.fecha))) {
      // Estamos en ventana de alimentación
      objetivo = new Date(ultimoFin.fecha);
      objetivo.setHours(objetivo.getHours() + 10);
      mensaje = `Ventana de alimentación. Termina a las ${objetivo.toLocaleTimeString("es-MX",{hour:"2-digit",minute:"2-digit"})}.`;
      titulo = "Ventana de alimentación";
    } else if (ultimoInicio) {
      // Estamos en ayuno
      objetivo = new Date(ultimoInicio.fecha);
      objetivo.setHours(objetivo.getHours() + AYUNO_HORAS);
      const diff = objetivo - ahora;
      if (diff <= 0) {
        mensaje = "¡Ayuno completado! Ya puedes comer.";
        titulo = "Ayuno completado";
        document.getElementById("cuenta-regresiva").textContent = "00:00:00";
        document.getElementById("mensaje-ayuno").textContent = mensaje;
        document.getElementById("estado-ayuno").textContent = mensaje;
        document.getElementById("titulo-reloj").textContent = titulo;
        return;
      }
      mensaje = `En ayuno desde las ${new Date(ultimoInicio.fecha).toLocaleTimeString("es-MX",{hour:"2-digit",minute:"2-digit"})}.`;
      titulo = "En ayuno";
    } else {
      // Primera vez, sin eventos
      document.getElementById("cuenta-regresiva").textContent = "--:--:--";
      document.getElementById("mensaje-ayuno").textContent = "Pulsa 'Empecé a comer' para iniciar el seguimiento.";
      document.getElementById("estado-ayuno").textContent = "Sin registro";
      document.getElementById("titulo-reloj").textContent = "Estado del ayuno";
      return;
    }

    const diff = objetivo - ahora;
    document.getElementById("cuenta-regresiva").textContent = formatoCuenta(diff);
    document.getElementById("mensaje-ayuno").textContent = mensaje;
    document.getElementById("estado-ayuno").textContent = mensaje;
    document.getElementById("titulo-reloj").textContent = titulo;
  };

  await actualiza();
  intervaloAyuno = setInterval(actualiza, 1000);
}

function initBotonesReloj() {
  document.getElementById("btn-empezar-comer").addEventListener("click", async () => {
    await DB.guardarEvento({ tipo: "fin_ayuno", fecha: new Date().toISOString() });
    iniciarCuentaRegresiva();
    notificar("Ventana abierta", "Ya puedes comer. Tienes 10 horas.");
  });

  document.getElementById("btn-terminar-dia").addEventListener("click", async () => {
    await DB.guardarEvento({ tipo: "inicio_ayuno", fecha: new Date().toISOString() });
    iniciarCuentaRegresiva();
    notificar("Ayuno iniciado", "No comas hasta dentro de 14 horas.");
  });

  document.getElementById("btn-corregir-hora").addEventListener("click", async () => {
    const hora = prompt("Hora exacta (HH:MM, formato 24h):", HORA_ACTUAL());
    if (!hora || !/^\d{2}:\d{2}$/.test(hora)) return;
    const tipo = prompt("¿Qué evento quieres corregir? Escribe 'inicio' o 'fin':");
    if (tipo !== "inicio" && tipo !== "fin") return;
    const [h, m] = hora.split(":").map(Number);
    const fecha = new Date();
    fecha.setHours(h, m, 0, 0);
    await DB.guardarEvento({ tipo: tipo === "inicio" ? "inicio_ayuno" : "fin_ayuno", fecha: fecha.toISOString() });
    iniciarCuentaRegresiva();
  });
}

// ============================================================
// NOTIFICACIONES
// ============================================================
async function pedirPermisoNotificaciones() {
  if (!("Notification" in window)) return;
  if (Notification.permission === "default") {
    await Notification.requestPermission();
  }
}

function notificar(titulo, cuerpo) {
  if (!("Notification" in window)) return;
  if (Notification.permission === "granted") {
    new Notification(titulo, { body: cuerpo, icon: "./icons/icon-192.png" });
  }
}

// ============================================================
// PANTALLA HOY
// ============================================================
async function renderHoy() {
  const dia = DIA_HOY();
  document.getElementById("dia-semana").textContent = dia;

  const menus = await DB.leerMenus();
  const fuente = menus.length > 0 ? agruparMenus(menus) : MENU_DEFECTO;
  const comidas = fuente[dia] || [];

  const cont = document.getElementById("menu-hoy");
  cont.innerHTML = "";
  comidas.forEach((c) => {
    const div = document.createElement("div");
    div.className = "item-menu";
    div.innerHTML = `<h3>${c.comida}</h3><p>${c.desc}</p><p class="kcal">${c.kcal} kcal</p>`;
    cont.appendChild(div);
  });

  renderCaloriasHoy();
}

async function renderCaloriasHoy() {
  const comidas = await DB.leerComidas();
  const hoy = FECHA_HOY();
  const deHoy = comidas.filter((c) => c.fecha === hoy && c.kcal);
  const total = deHoy.reduce((s, c) => s + Number(c.kcal), 0);
  document.getElementById("calorias-hoy").textContent = `${total} kcal`;
  document.getElementById("detalle-calorias").textContent =
    deHoy.length === 0 ? "Aún no registras comidas del menú." : `${deHoy.length} comida(s) registrada(s).`;
}

function initBotonesHoy() {
  document.getElementById("btn-marcar-comido").addEventListener("click", async () => {
    const dia = DIA_HOY();
    const menus = await DB.leerMenus();
    const fuente = menus.length > 0 ? agruparMenus(menus) : MENU_DEFECTO;
    const comidas = fuente[dia] || [];
    for (const c of comidas) {
      await DB.guardarComida({
        fecha: FECHA_HOY(), hora: HORA_ACTUAL(), tipo: c.comida, desc: c.desc, kcal: c.kcal
      });
    }
    renderCaloriasHoy();
  });
}

// ============================================================
// PANTALLA PROGRESO
// ============================================================
let graficaPeso = null;

async function renderProgreso() {
  const perfil = await DB.leerPerfil();
  if (perfil.peso) document.getElementById("input-peso").value = perfil.peso;
  if (perfil.estatura) document.getElementById("input-estatura").value = perfil.estatura;
  if (perfil.peso && perfil.estatura) {
    const imc = calcularIMC(perfil.peso, perfil.estatura);
    document.getElementById("imc-actual").textContent = `IMC: ${imc} — ${clasificarIMC(Number(imc))}`;
  }

  const pesos = await DB.leerPesos();
  const canvas = document.getElementById("grafica-peso");
  const sinDatos = document.getElementById("sin-datos-peso");
  const hist = document.getElementById("historial-pesos");

  hist.innerHTML = pesos.slice().reverse().map((p) =>
    `<div class="fila-peso"><span>${formatearFecha(p.fecha)}</span><span>${p.peso} kg</span></div>`
  ).join("") || "<p class='suave'>Sin registros.</p>";

  if (pesos.length === 0) {
    sinDatos.style.display = "block";
    if (graficaPeso) { graficaPeso.destroy(); graficaPeso = null; }
    return;
  }
  sinDatos.style.display = "none";

  const labels = pesos.map((p) => formatearFecha(p.fecha));
  const datos = pesos.map((p) => p.peso);

  if (graficaPeso) graficaPeso.destroy();
  graficaPeso = new Chart(canvas, {
    type: "line",
    data: {
      labels,
      datasets: [{
        label: "Peso (kg)",
        data: datos,
        borderColor: "#14b8a6",
        backgroundColor: "rgba(20,184,166,0.2)",
        tension: 0.3, fill: true
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { labels: { color: "#e2e8f0" } } },
      scales: {
        x: { ticks: { color: "#94a3b8" }, grid: { color: "#334155" } },
        y: { ticks: { color: "#94a3b8" }, grid: { color: "#334155" } }
      }
    }
  });
}

function initBotonesProgreso() {
  document.getElementById("btn-guardar-datos").addEventListener("click", async () => {
    const peso = Number(document.getElementById("input-peso").value);
    const estatura = Number(document.getElementById("input-estatura").value);
    if (!peso || !estatura) return;
    await DB.guardarPerfil({ peso, estatura });
    await DB.guardarPeso(peso);
    renderProgreso();
  });
}

// ============================================================
// PANTALLA MENÚS
// ============================================================
async function renderMenus() {
  const cont = document.getElementById("lista-menus-semana");
  cont.innerHTML = "";
  const menus = await DB.leerMenus();
  const fuente = menus.length > 0 ? agruparMenusConId(menus) : MENU_DEFECTO;

  Object.keys(fuente).forEach((dia) => {
    const div = document.createElement("div");
    div.className = "item-menu";
    div.innerHTML = `<h3>${dia}</h3>` + fuente[dia].map((c) =>
      `<p><strong>${c.comida}:</strong></p>
       <textarea data-id="${c.id || ""}" data-dia="${dia}" data-comida="${c.comida}" rows="2">${c.desc}</textarea>
       <p>Calorías: <input type="number" value="${c.kcal}" data-kcal-id="${c.id || ""}" data-dia="${dia}" data-comida="${c.comida}"></p>`
    ).join("");
    cont.appendChild(div);
  });

  // Guardar ediciones al cambiar
  cont.querySelectorAll("textarea").forEach((ta) => {
    ta.addEventListener("blur", async () => {
      await guardarEdicionMenu(ta.dataset.dia, ta.dataset.comida, ta.value, null);
    });
  });
  cont.querySelectorAll("input[type=number]").forEach((inp) => {
    inp.addEventListener("blur", async () => {
      await guardarEdicionMenu(inp.dataset.dia, inp.dataset.comida, null, Number(inp.value));
    });
  });
}

async function guardarEdicionMenu(dia, comida, nuevaDesc, nuevaKcal) {
  const menus = await DB.leerMenus();
  const item = menus.find((m) => m.dia === dia && m.comida === comida);
  if (item) {
    if (nuevaDesc !== null) item.desc = nuevaDesc;
    if (nuevaKcal !== null) item.kcal = nuevaKcal;
    await DB.actualizarMenu(item);
  } else {
    await DB.guardarMenu({
      dia, comida,
      desc: nuevaDesc || "",
      kcal: nuevaKcal || 0
    });
  }
}

function agruparMenus(menus) {
  const porDia = {};
  menus.forEach((m) => {
    if (!porDia[m.dia]) porDia[m.dia] = [];
    porDia[m.dia].push({ comida: m.comida, desc: m.desc, kcal: m.kcal });
  });
  return porDia;
}

function agruparMenusConId(menus) {
  const porDia = {};
  menus.forEach((m) => {
    if (!porDia[m.dia]) porDia[m.dia] = [];
    porDia[m.dia].push14({ id: m.id, comida h: m.comida. "Corregir hora, desc: m.desc, kcal: m.kcal });
  });
  return porDia;
}

function initBotonesMenus() {
  document.getElementById("btn-cargar-menu").addEventListener("click", async () => {
    const texto = document.getElementById("input-menu-nuevo").value.trim();
    const msg = document.getElementById("msg-carga-menu");
    if (!texto) { msg.textContent = "Pega algo primero."; return; }

    const lineas = texto.split("\n").map((l) => l.trim()).filter(Boolean);
    const parseadas = [];
    for (const linea of lineas) {
      const p = linea.split("|").map((x) => x.trim());
      if (p.length < 4) { msg.textContent = `Línea inválida: "${linea}"`; return; }
      parseadas.push({ dia: p[0], comida: p[1], desc: p[2], kcal: Number(p[3]) || 0 });
    }

    // Archivar menú actual si existe
    const actuales = await DB.leerMenus();
    if (actuales.length > 0) {
      const nombre = prompt("Nombre para archivar la semana actual:", `Semana hasta ${FECHA_HOY()}`);
      if (nombre) {
        await DB.guardarArchivo({ nombre, fecha: new Date().toISOString(), menus: actuales });
      }
    }

    await DB.borrarMenus();
    for (const p of parseadas) await DB.guardarMenu(p);
    msg.textContent = `Menú cargado: ${parseadas.length} comidas.`;
    document.getElementById("input-menu-nuevo").value = "";
    renderMenus();
  });

  document.getElementById("btn-archivar-semana").addEventListener("click", async () => {
    const actuales = await DB.leerMenus();
    if (actuales.length === 0) { alert("No hay menú activo para archivar."); return; }
    const nombre = prompt("Nombre de la semana:", `Semana hasta ${FECHA_HOY()}`);
    if (!nombre) return;
    await DB.guardarArchivo({ nombre, fecha: new Date().toISOString(), menus: actuales });
    await DB.borrarMenus();
    alert("Semana archivada.");
    renderMenus();
  });

  document.getElementById("btn-cargar-super").addEventListener("click", async () => {
    const texto = document.getElementById("input-super-nuevo").value.trim();
    const msg = document.getElementById("msg-carga-super");
    if (!texto) { msg.textContent = "Pega algo primero."; return; }
    const lineas = texto.split("\n").map((l) => l.trim()).filter(Boolean);
    let n = 0;
    for (const linea of lineas) {
      const p = linea.split("|").map((x) => x.trim());
      if (p.length < 2) continue;
      await DB.guardarItemSuper({ cat: p[0], nombre: p[1], hecho: false, semanal: true });
      n++;
    }
    msg.textContent = `Cargados ${n} items.`;
    document.getElementById("input-super-nuevo").value = "";
    renderSuper();
  });
}

// ============================================================
// PANTALLA ARCHIVO
// ============================================================
async function renderArchivo() {
  const cont = document.getElementById("lista-archivo");
  const archivo = await DB.leerArchivo();
  if (archivo.length === 0) {
    cont.innerHTML = "<p class='suave'>No hay semanas archivadas.</p>";
    return;
  }
  cont.innerHTML = archivo.map((a) => `
    <div class="semana-archivada">
      <h3>${a.nombre}</h3>
      <p class="suave">${formatearFecha(a.fecha)}</p>
      <details>
        <summary>Ver menú</summary>
        ${Object.keys(agruparMenus(a.menus)).map((dia) =>
          `<p><strong>${dia}:</strong> ${agruparMenus(a.menus)[dia].map((c) => `${c.comida} (${c.kcal} kcal)`).join(", ")}</p>`
        ).join("")}
      </details>
    </div>
  `).join("");
}

// ============================================================
// PANTALLA SÚPER
// ============================================================
async function renderSuper() {
  const cont = document.getElementById("lista-super");
  cont.innerHTML = "";
  let items = await DB.leerSuper();

  if (items.length === 0) {
    for (const it of SUPER_BASE) await DB.guardarItemSuper({ ...it, hecho: false, semanal: false });
    items = await DB.leerSuper();
  }

  const porCat = {};
  items.forEach((it) => {
    if (!porCat[it.cat]) porCat[it.cat] = [];
    porCat[it.cat].push(it);
  });

  Object.keys(porCat).forEach((cat) => {
    const h = document.createElement("div");
    h.className = "categoria-super";
    h.textContent = cat;
    cont.appendChild(h);

    porCat[cat].forEach((it) => {
      const div = document.createElement("div");
      div.className = "item-super" + (it.hecho ? " hecho" : "");
      div.innerHTML = `<input type="checkbox" ${it.hecho ? "checked" : ""} data-id="${it.id}"><label>${it.nombre}</label>`;
      cont.appendChild(div);
    });
  });

  cont.querySelectorAll("input[type=checkbox]").forEach((chk) => {
    chk.addEventListener("change", async () => {
      const item = items.find((i) => i.id === Number(chk.dataset.id));
      item.hecho = chk.checked;
      await DB.actualizarItemSuper(item);
      chk.parentElement.classList.toggle("hecho", chk.checked);
    });
  });
}

function initBotonesSuper() {
  document.getElementById("btn-limpiar-super").addEventListener("click", async () => {
    if (!confirm("¿Borrar la lista semanal? La lista base se mantiene.")) return;
    await DB.borrarSuperSemanal();
    renderSuper();
  });

  document.getElementById("btn-add-super").addEventListener("click", async () => {
    const cat = document.getElementById("input-super-cat").value.trim();
    const nombre = document.getElementById("input-super-nombre").value.trim();
    if (!cat || !nombre) return;
    await DB.guardarItemSuper({ cat, nombre, hecho: false, semanal: true });
    document.getElementById("input-super-cat").value = "";
    document.getElementById("input-super-nombre").value = "";
    renderSuper();
  });
}

// ============================================================
// INICIALIZACIÓN
// ============================================================
document.addEventListener("DOMContentLoaded", async () => {
  initNavegacion();
  initBotonesHoy();
  initBotonesReloj();
  initBotonesProgreso();
  initBotonesMenus();
  initBotonesSuper();
  await pedirPermisoNotificaciones();
  await iniciarCuentaRegresiva();
  await renderHoy();

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./sw.js").catch((e) => console.warn("SW error:", e));
  }
});