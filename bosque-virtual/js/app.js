// ============================================================
// app.js – Lógica del bosque: árboles, modal, formulario
// Bosque Virtual de los Dos
// ============================================================

// Guard de autenticación
if (!sessionStorage.getItem('bosque_auth')) {
    window.location.href = 'login.html';
}

// ── Configuración de íconos Phosphor por tipo ──
const ICONOS_TIPO = {
    brote: 'ph-plant',
    joven: 'ph-leaf',
    grande: 'ph-tree',
    especial: 'ph-star'
};

const MODAL_ICONOS = {
    brote: 'ph-plant',
    joven: 'ph-leaf',
    grande: 'ph-tree',
    especial: 'ph-star'
};

// ── Estado global ──
let memorias = [];
let memoriaActualId = null; // ID del recuerdo abierto en el modal

// ── Inicialización ──
document.addEventListener('DOMContentLoaded', function () {
    memorias = cargarMemorias();
    renderizarTodosLosArboles();
    inicializarModal();
    inicializarFormulario();
    actualizarContador();
});

// ============================================================
// Renderizado de árboles
// ============================================================

/**
 * Renderiza todos los árboles en el mapa.
 */
function renderizarTodosLosArboles() {
    const contenedor = document.getElementById('mapa-arboles');
    contenedor.innerHTML = '';
    memorias.forEach(m => renderizarArbol(m, false));
}

/**
 * Renderiza un árbol individual en el mapa.
 * @param {Object} memoria
 * @param {boolean} animado - Si true, aplica animación de entrada
 */
function renderizarArbol(memoria, animado = false) {
    const contenedor = document.getElementById('mapa-arboles');

    const arbol = document.createElement('div');
    arbol.classList.add('arbol', `tipo-${memoria.tipo}`);
    if (animado) arbol.classList.add('nuevo');
    arbol.style.left = memoria.x + '%';
    arbol.style.top = memoria.y + '%';
    arbol.setAttribute('data-id', memoria.id);
    arbol.setAttribute('role', 'button');
    arbol.setAttribute('tabindex', '0');
    arbol.setAttribute('aria-label', `Recuerdo: ${memoria.titulo}`);

    // Ícono del árbol (Phosphor Icons en contenedor circular)
    const icono = document.createElement('div');
    icono.classList.add('arbol-icono');
    const iconEl = document.createElement('i');
    iconEl.className = 'ph ' + (ICONOS_TIPO[memoria.tipo] || 'ph-tree');
    icono.appendChild(iconEl);

    // Etiqueta de título
    const label = document.createElement('span');
    label.classList.add('arbol-label');
    label.textContent = memoria.titulo;

    arbol.appendChild(icono);
    arbol.appendChild(label);

    // Evento: abrir modal al hacer click
    arbol.addEventListener('click', () => abrirModal(memoria));
    arbol.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') abrirModal(memoria);
    });

    contenedor.appendChild(arbol);

    // Quitar clase 'nuevo' después de la animación
    if (animado) {
        setTimeout(() => arbol.classList.remove('nuevo'), 700);
    }
}

/**
 * Actualiza el contador de árboles en la UI.
 */
function actualizarContador() {
    const el = document.getElementById('contador-arboles');
    if (el) el.textContent = memorias.length;
}

// ============================================================
// Modal de recuerdo
// ============================================================

function inicializarModal() {
    const overlay = document.getElementById('modal-overlay');
    const btnCerrar = document.getElementById('modal-close');

    // Cerrar al hacer click en el overlay
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) cerrarModal();
    });

    // Cerrar con el botón X
    btnCerrar.addEventListener('click', cerrarModal);

    // Cerrar con Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') cerrarModal();
    });
}

/**
 * Abre el modal con los datos de una memoria.
 * @param {Object} memoria
 */
function abrirModal(memoria) {
    const overlay = document.getElementById('modal-overlay');

    // Llenar datos
    document.getElementById('modal-titulo').textContent = memoria.titulo;
    document.getElementById('modal-fecha').textContent = formatearFecha(memoria.fecha);
    document.getElementById('modal-lugar').textContent = memoria.lugar;
    document.getElementById('modal-historia').textContent = memoria.historia;

    // Ícono del árbol en el modal
    const iconWrap = document.getElementById('modal-arbol-icon');
    const iconInner = document.getElementById('modal-icon-inner');
    if (iconWrap && iconInner) {
        iconWrap.className = `modal-arbol-icon ${memoria.tipo}`;
        iconInner.className = 'ph ' + (MODAL_ICONOS[memoria.tipo] || 'ph-tree');
    }

    // Badge de tipo
    const badge = document.getElementById('modal-badge');
    badge.textContent = memoria.tipo.charAt(0).toUpperCase() + memoria.tipo.slice(1);
    badge.className = `modal-tipo-badge badge-${memoria.tipo}`;

    // Guardar ID del recuerdo abierto
    memoriaActualId = memoria.id;

    // Mostrar modal
    overlay.classList.add('visible');
    document.body.style.overflow = 'hidden';
}

/**
 * Cierra el modal.
 */
function cerrarModal() {
    const overlay = document.getElementById('modal-overlay');
    overlay.classList.remove('visible');
    document.body.style.overflow = '';
    memoriaActualId = null;
}

/**
 * Elimina el recuerdo actualmente abierto en el modal.
 */
function eliminarRecuerdoActual() {
    if (!memoriaActualId) return;
    if (!confirm('\u00bfSeguro que quieres eliminar este recuerdo del bosque?')) return;
    memorias = eliminarMemoria(memoriaActualId);
    renderizarTodosLosArboles();
    actualizarContador();
    cerrarModal();
    mostrarToast('El recuerdo fue liberado al viento.');
}

// ============================================================
// Formulario: agregar nuevo recuerdo
// ============================================================

function inicializarFormulario() {
    const form = document.getElementById('form-recuerdo');
    if (!form) return;

    // Fecha por defecto: hoy
    const hoy = new Date().toISOString().split('T')[0];
    document.getElementById('r-fecha').value = hoy;

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        agregarRecuerdo();
    });

    // Previsualización inicial
    previsualizarPosicion();
}

/**
 * Agrega un nuevo recuerdo al bosque.
 */
function agregarRecuerdo() {
    const titulo = document.getElementById('r-titulo').value.trim();
    const fecha = document.getElementById('r-fecha').value;
    const lugar = document.getElementById('r-lugar').value.trim();
    const historia = document.getElementById('r-historia').value.trim();
    const tipo = document.querySelector('input[name="r-tipo"]:checked').value;
    const x = parseInt(document.getElementById('r-x').value);
    const y = parseInt(document.getElementById('r-y').value);

    // Validación básica
    if (!titulo || !fecha || !lugar || !historia) return;

    // Crear nueva memoria
    const nuevaMemoria = {
        id: generarId(memorias),
        titulo,
        fecha,
        lugar,
        historia,
        tipo,
        x,
        y
    };

    // Agregar al array y guardar
    memorias.push(nuevaMemoria);
    guardarMemorias(memorias);

    // Renderizar árbol con animación
    renderizarArbol(nuevaMemoria, true);
    actualizarContador();

    // Mostrar toast
    mostrarToast('🌱 Un nuevo recuerdo ha echado raíces.');

    // Limpiar formulario
    document.getElementById('form-recuerdo').reset();
    document.getElementById('r-fecha').value = new Date().toISOString().split('T')[0];
    document.getElementById('val-x').textContent = '50%';
    document.getElementById('val-y').textContent = '50%';
    document.getElementById('r-x').value = 50;
    document.getElementById('r-y').value = 50;
    previsualizarPosicion();
}

/**
 * Actualiza la previsualización de posición del árbol.
 */
function previsualizarPosicion() {
    const x = parseInt(document.getElementById('r-x').value);
    const y = parseInt(document.getElementById('r-y').value);

    let posH = x < 33 ? 'izquierda' : x < 66 ? 'centro' : 'derecha';
    let posV = y < 33 ? 'arriba' : y < 66 ? 'centro' : 'abajo';

    const preview = document.getElementById('pos-preview');
    if (preview) {
        preview.innerHTML = `El árbol se plantará en: <strong>${posH} – ${posV}</strong>`;
    }
}

// ============================================================
// Toast
// ============================================================

/**
 * Muestra un mensaje toast temporal.
 * @param {string} mensaje
 */
function mostrarToast(mensaje) {
    const toast = document.getElementById('toast');
    toast.innerHTML = `<i class="ph ph-check-circle"></i> ${mensaje}`;
    toast.classList.add('visible');
    setTimeout(() => toast.classList.remove('visible'), 3500);
}
