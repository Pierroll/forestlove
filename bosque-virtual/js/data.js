// ============================================================
// data.js – Datos iniciales y helpers de localStorage
// Bosque Virtual de los Dos
// ============================================================

// Versión de datos – limpia localStorage si cambia
const DATA_VERSION = "v2";
if (localStorage.getItem("bosque_data_version") !== DATA_VERSION) {
  localStorage.removeItem("bosque_memorias");
  localStorage.removeItem("bosque_metas");
  localStorage.removeItem("bosque_tour_visto_index.html");
  localStorage.removeItem("bosque_tour_visto_bosque.html");
  localStorage.removeItem("bosque_tour_visto_dashboard.html");
  localStorage.setItem("bosque_data_version", DATA_VERSION);
}

// Fecha de inicio de la relación (para calcular días juntos)
const FECHA_INICIO = "2022-02-08";

// Un solo recuerdo de ejemplo
const MEMORIAS_INICIALES = [
  {
    id: 1,
    titulo: "El día que todo comenzó",
    fecha: "2022-02-08",
    lugar: "Nuestro lugar especial",
    historia: "Ese día, sin saberlo, empezamos a construir este bosque. Cada momento desde entonces ha sido un árbol nuevo que crece con nosotros.",
    tipo: "especial",
    x: 50,
    y: 45
  }
];

// Metas futuras de ejemplo
const METAS_INICIALES = [
  { id: 1, texto: "Viajar juntos a un lugar nuevo", completado: false },
  { id: 2, texto: "Ver el amanecer desde las montañas", completado: false },
  { id: 3, texto: "Aprender a cocinar un plato especial juntos", completado: false }
];

// ============================================================
// Helpers de localStorage – Memorias
// ============================================================

function cargarMemorias() {
  const guardadas = localStorage.getItem("bosque_memorias");
  if (guardadas) {
    try { return JSON.parse(guardadas); }
    catch (e) { return [...MEMORIAS_INICIALES]; }
  }
  guardarMemorias(MEMORIAS_INICIALES);
  return [...MEMORIAS_INICIALES];
}

function guardarMemorias(memorias) {
  localStorage.setItem("bosque_memorias", JSON.stringify(memorias));
}

function eliminarMemoria(id) {
  const memorias = cargarMemorias();
  const nuevas = memorias.filter(m => m.id !== id);
  guardarMemorias(nuevas);
  return nuevas;
}

function generarId(memorias) {
  if (memorias.length === 0) return 1;
  return Math.max(...memorias.map(m => m.id)) + 1;
}

// ============================================================
// Helpers de localStorage – Metas Futuras
// ============================================================

function cargarMetas() {
  const guardadas = localStorage.getItem("bosque_metas");
  if (guardadas) {
    try { return JSON.parse(guardadas); }
    catch (e) { return [...METAS_INICIALES]; }
  }
  guardarMetas(METAS_INICIALES);
  return [...METAS_INICIALES];
}

function guardarMetas(metas) {
  localStorage.setItem("bosque_metas", JSON.stringify(metas));
}

// ============================================================
// Helpers de fecha
// ============================================================

function calcularDiasJuntos() {
  const inicio = new Date(FECHA_INICIO);
  const hoy = new Date();
  return Math.floor((hoy - inicio) / (1000 * 60 * 60 * 24));
}

function formatearFecha(fechaISO) {
  const opciones = { year: "numeric", month: "long", day: "numeric" };
  return new Date(fechaISO + "T00:00:00").toLocaleDateString("es-ES", opciones);
}

