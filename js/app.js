// ============================================================
// App de Ayuno 14:10 — lógica principal
// ============================================================

// Configuración del ayuno (14:10)
const AYUNO = {
  finAyuno: "11:00",   // primera comida
  inicioAyuno: "21:00" // última comida
};

// Menú semanal por defecto (el que armamos)
const MENU_SEMANAL_DEFECTO = {
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

const LISTA_SUPER_DEFECTO = [
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
  const nombres = { hoy: "Hoy", progreso: "Progreso", menus: "Menús", super: "Súper" };

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("activa"));
      tab.classList.add("activa");
      document.querySelectorAll(".pantalla").forEach((p) => p.classList.remove("activa"));
      document.getElementById(`pantalla-${tab.dataset.pantalla}`).classList.add("activa");
      titulo.textContent = nombres[tab.dataset.pantalla];
      if (tab.dataset.pantalla === "progreso") renderProgreso();
      if (tab.dataset.pantalla === "menus") renderMenus();
      if (tab.dataset.pantalla === "super") renderSuper();
    });
  });
}

// ============================================================
// PANTALLA HOY
// ============================================================
let intervaloAyuno = null;

function iniciarCuentaRegresiva() {
  if (intervaloAyuno) clearInterval(intervaloAyuno);
  const actualiza = () => {
    const ahora = new Date();
    const minutosAhora = ahora.getHours() * 60 + ahora.getMinutes();
    const inicio = aMinutos(AYUNO.finAyuno);
    const fin = aMinutos(AYUNO.inicioAyuno);

    let objetivo, mensaje;
    if (minutosAhora < inicio) {
      // Estamos en ayuno, próxima comida a las 11:00
      objetivo = new Date(ahora);
      objetivo.setHours(11, 0, 0, 0);
      mensaje = "En ayuno. Próxima comida a las 11:00.";
    } else if (minutosAhora < fin) {
      // Ventana de alimentación
      objetivo = new Date(ahora);
      objetivo.setHours(21, 0, 0, 0);
      mensaje = "Ventana de alimentación. Última comida antes de las 21:00.";
    } else {
      // Después de las 21:00, ya en ayuno hasta mañana
      objetivo = new Date(ahora);
      objetivo.setDate(objetivo.getDate() + 1);
      objetivo.setHours(11, 0, 0, 0);
      mensaje = "En ayuno. Próxima comida mañana a las 11:00.";
    }

    const diff = objetivo - ahora;
    document.getElementById("cuenta-regresiva").textContent = formatoCuenta(diff);
    document.getElementById("mensaje-ayuno").textContent = mensaje;
    document.getElementById("estado-ayuno").textContent = mensaje;
  };
  actualiza();
  intervaloAyuno = setInterval(actualiza, 1000);
}

function renderHoy() {
  const dia = DIA_HOY();
  document.getElementById("dia-semana").textContent = dia;

  const cont = document.getElementById("menu-hoy");
  cont.innerHTML = "";
  const comidas = MENU_SEMANAL_DEFECTO[dia] || [];
  comidas.forEach((c) => {
    const div = document.createElement("div");
    div.className = "item-menu";
    div.innerHTML = `<h3>${c.comida}</h3><p>${c.desc}</p><p class="kcal">${c.kcal} kcal</p>`;
    cont.appendChild(div);
  });

  renderLogComidas();
  renderCaloriasHoy();
}

async function renderLogComidas() {
  const comidas = await DB.leerComidas();
  const hoy = FECHA_HOY();
  const deHoy = comidas.filter((c) => c.fecha === hoy);
  const el = document.getElementById("log-comidas");
  if (deHoy.length === 0) {
    el.textContent = "Sin comidas registradas hoy.";
    return;
  }
  el.innerHTML = deHoy
    .map((c) => `<span class="badge-ok">${c.tipo}</span> a las ${c.hora}`)
    .join("<br>");
}

async function renderCaloriasHoy() {
  const comidas = await DB.leerComidas();
  const hoy = FECHA_HOY();
  const deHoy = comidas.filter((c) => c.fecha === hoy && c.kcal);
  const total = deHoy.reduce((s, c) => s + Number(c.kcal), 0);
  document.getElementById("calorias-hoy").textContent = `${total} kcal`;
  document.getElementById("detalle-calorias").textContent =
    deHoy.length === 0
      ? "Aún no registras comidas del menú."
      : `${deHoy.length} comida(s) del menú registrada(s).`;
}

function initBotonesHoy() {
  document.getElementById("btn-iniciar-comida").addEventListener("click", async () => {
    await DB.guardarComida({
      fecha: FECHA_HOY(),
      hora: HORA_ACTUAL(),
      tipo: "Inicio de comida",
      kcal: 0
    });
    renderLogComidas();
  });

  document.getElementById("btn-terminar-comida").addEventListener("click", async () => {
    await DB.guardarComida({
      fecha: FECHA_HOY(),
      hora: HORA_ACTUAL(),
      tipo: "Fin de comida",
      kcal: 0
    });
    renderLogComidas();
  });

  document.getElementById("btn-marcar-comido").addEventListener("click", async () => {
    const dia = DIA_HOY();
    const comidas = MENU_SEMANAL_DEFECTO[dia] || [];
    for (const c of comidas) {
      await DB.guardarComida({
        fecha: FECHA_HOY(),
        hora: HORA_ACTUAL(),
        tipo: c.comida,
        desc: c.desc,
        kcal: c.kcal
      });
    }
    renderLogComidas();
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
    document.getElementById("imc-actual").textContent =
      `IMC: ${imc} — ${clasificarIMC(Number(imc))}`;
  }

  const pesos = await DB.leerPesos();
  const canvas = document.getElementById("grafica-peso");
  const sinDatos = document.getElementById("sin-datos-peso");

  if (pesos.length === 0) {
    sinDatos.style.display = "block";
    if (graficaPeso) { graficaPeso.destroy(); graficaPeso = null; }
    return;
  }
  sinDatos.style.display = "none";

  const labels = pesos.map((p) => p.fecha);
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
        tension: 0.3,
        fill: true
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
    await DB.guardarPeso(FECHA_HOY(), peso);
    renderProgreso();
  });
}

// ============================================================
// PANTALLA MENÚS
// ============================================================
async function renderMenus() {
  const cont = document.getElementById("lista-menus-semana");
  cont.innerHTML = "";

  const menusGuardados = await DB.leerMenus();

  // Si no hay menús guardados, mostramos el de defecto
  const fuente = menusGuardados.length > 0
    ? agruparMenus(menusGuardados)
    : MENU_SEMANAL_DEFECTO;

  Object.keys(fuente).forEach((dia) => {
    const div = document.createElement("div");
    div.className = "item-menu";
    const comidas = fuente[dia];
    div.innerHTML = `<h3>${dia}</h3>` + comidas.map((c) =>
      `<p><strong>${c.comida}:</strong> ${c.desc} <span class="kcal">(${c.kcal} kcal)</span></p>`
    ).join("");
    cont.appendChild(div);
  });
}

function agruparMenus(menus) {
  const porDia = {};
  menus.forEach((m) => {
    if (!porDia[m.dia]) porDia[m.dia] = [];
    porDia[m.dia].push({ comida: m.comida, desc: m.desc, kcal: m.kcal });
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
      const partes = linea.split("|").map((p) => p.trim());
      if (partes.length < 4) {
        msg.textContent = `Línea inválida: "${linea}". Debe tener 4 campos separados por |`;
        return;
      }
      const [dia, comida, desc, kcal] = partes;
      parseadas.push({ dia, comida, desc, kcal: Number(kcal) || 0 });
    }

    await DB.borrarMenus();
    for (const p of parseadas) await DB.guardarMenu(p);
    msg.textContent = `Menú cargado: ${parseadas.length} comidas.`;
    renderMenus();
  });
}

// ============================================================
// PANTALLA SÚPER
// ============================================================
async function renderSuper() {
  const cont = document.getElementById("lista-super");
  cont.innerHTML = "";

  let items = await DB.leerSuper();
  if (items.length === 0) {
    // Inicializar con la lista por defecto
    for (const it of LISTA_SUPER_DEFECTO) {
      await DB.guardarItemSuper({ ...it, hecho: false });
    }
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
      div.innerHTML = `
        <input type="checkbox" ${it.hecho ? "checked" : ""} data-id="${it.id}">
        <label>${it.nombre}</label>
      `;
      cont.appendChild(div);
    });
  });

  cont.querySelectorAll("input[type=checkbox]").forEach((chk) => {
    chk.addEventListener("change", async () => {
      const id = Number(chk.dataset.id);
      const item = items.find((i) => i.id === id);
      item.hecho = chk.checked;
      await DB.actualizarItemSuper(item);
      chk.parentElement.classList.toggle("hecho", chk.checked);
    });
  });
}

// ============================================================
// INICIALIZACIÓN
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
  initNavegacion();
  initBotonesHoy();
  initBotonesProgreso();
  initBotonesMenus();
  iniciarCuentaRegresiva();
  renderHoy();

  // Registrar service worker
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./sw.js").catch((e) => console.warn("SW error:", e));
  }
});
