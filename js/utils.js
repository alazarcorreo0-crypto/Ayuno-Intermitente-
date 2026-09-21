// Utilidades generales

const DIA_HOY = () => {
  const dias = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  return dias[new Date().getDay()];
};

const FECHA_HOY = () => new Date().toISOString().slice(0, 10);

const HORA_ACTUAL = () => {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
};

// Convierte "HH:MM" a minutos desde medianoche
const aMinutos = (hhmm) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

// Diferencia en formato HH:MM:SS
const formatoCuenta = (ms) => {
  if (ms < 0) ms = 0;
  const totalSeg = Math.floor(ms / 1000);
  const h = Math.floor(totalSeg / 3600);
  const m = Math.floor((totalSeg % 3600) / 60);
  const s = totalSeg % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
};

// IMC
const calcularIMC = (pesoKg, estaturaM) => {
  if (!pesoKg || !estaturaM) return null;
  return (pesoKg / (estaturaM * estaturaM)).toFixed(1);
};

// Clasificación IMC (OMS)
const clasificarIMC = (imc) => {
  if (imc < 18.5) return "Bajo peso";
  if (imc < 25) return "Normal";
  if (imc < 30) return "Sobrepeso";
  if (imc < 35) return "Obesidad grado I";
  if (imc < 40) return "Obesidad grado II";
  return "Obesidad grado III";
};
