const DIA_HOY = () => {
  const dias = ["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"];
  return dias[new Date().getDay()];
};
const FECHA_HOY = () => new Date().toISOString().slice(0, 10);
const HORA_ACTUAL = () => {
  const d = new Date();
  return `${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`;
};
const formatoCuenta = (ms) => {
  if (ms < 0) ms = 0;
  const t = Math.floor(ms/1000);
  const h = Math.floor(t/3600);
  const m = Math.floor((t%3600)/60);
  const s = t%60;
  return `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;
};
const calcularIMC = (p, e) => (!p || !e) ? null : (p/(e*e)).toFixed(1);
const clasificarIMC = (i) => {
  if (i < 18.5) return "Bajo peso";
  if (i < 25) return "Normal";
  if (i < 30) return "Sobrepeso";
  if (i < 35) return "Obesidad grado I";
  if (i < 40) return "Obesidad grado II";
  return "Obesidad grado III";
};
const formatearFecha = (iso) => {
  const d = new Date(iso);
  return d.toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" });
}; 