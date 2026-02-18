// ============================================================
// dashboard.js – Estadísticas, Chart.js y metas futuras
// Bosque Virtual de los Dos
// ============================================================

// Guard de autenticación
if (!sessionStorage.getItem('bosque_auth')) {
    window.location.href = 'login.html';
}

// ── Estado global ──
let metas = [];

// ── Inicialización ──
document.addEventListener('DOMContentLoaded', function () {
    cargarYMostrarMetricas();
    inicializarGrafico();
    metas = cargarMetas();
    renderizarMetas();
    inicializarInputMeta();
});

// ============================================================
// Métricas
// ============================================================

function cargarYMostrarMetricas() {
    const memorias = cargarMemorias();

    // Total árboles
    document.getElementById('m-arboles').textContent = memorias.length;

    // Días juntos
    document.getElementById('m-dias').textContent = calcularDiasJuntos().toLocaleString('es-ES');

    // Lugares únicos
    const lugares = new Set(memorias.map(m => m.lugar.trim().toLowerCase()));
    document.getElementById('m-lugares').textContent = lugares.size;

    // Momentos especiales
    const especiales = memorias.filter(m => m.tipo === 'especial').length;
    document.getElementById('m-especiales').textContent = especiales;
}

// ============================================================
// Gráfico de tipos (Chart.js)
// ============================================================

function inicializarGrafico() {
    const memorias = cargarMemorias();

    // Contar por tipo
    const conteo = { brote: 0, joven: 0, grande: 0, especial: 0 };
    memorias.forEach(m => {
        if (conteo.hasOwnProperty(m.tipo)) conteo[m.tipo]++;
    });

    const ctx = document.getElementById('grafico-tipos');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['🌱 Brote', '🌿 Joven', '🌳 Grande', '✨ Especial'],
            datasets: [{
                data: [conteo.brote, conteo.joven, conteo.grande, conteo.especial],
                backgroundColor: [
                    '#D8F3DC',
                    '#95D5B2',
                    '#2D6A4F',
                    '#D4AF37'
                ],
                borderColor: [
                    '#74C69D',
                    '#52B788',
                    '#1B4332',
                    '#b8960c'
                ],
                borderWidth: 2,
                hoverOffset: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        font: { family: 'Lato', size: 13 },
                        color: '#2D6A4F',
                        padding: 16,
                        usePointStyle: true
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function (ctx) {
                            const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
                            const pct = total > 0 ? Math.round((ctx.raw / total) * 100) : 0;
                            return ` ${ctx.raw} árbol${ctx.raw !== 1 ? 'es' : ''} (${pct}%)`;
                        }
                    }
                }
            },
            cutout: '60%'
        }
    });
}

// ============================================================
// Metas futuras
// ============================================================

/**
 * Renderiza la lista de metas en el DOM.
 */
function renderizarMetas() {
    const lista = document.getElementById('lista-metas');
    if (!lista) return;

    if (metas.length === 0) {
        lista.innerHTML = `
      <div class="empty-state">
        <i class="ph ph-shooting-star"></i>
        <p>Aún no hay sueños escritos.<br />¡Agrega el primero!</p>
      </div>`;
        return;
    }

    lista.innerHTML = '';
    metas.forEach(meta => {
        const item = document.createElement('div');
        item.classList.add('meta-item');
        if (meta.completado) item.classList.add('completada');
        item.setAttribute('data-id', meta.id);

        item.innerHTML = `
      <input
        type="checkbox"
        class="meta-checkbox"
        ${meta.completado ? 'checked' : ''}
        onchange="toggleMeta(${meta.id})"
        aria-label="Marcar como cumplida: ${meta.texto}"
      />
      <span class="meta-texto">${escapeHtml(meta.texto)}</span>
      <button class="meta-eliminar" onclick="eliminarMeta(${meta.id})" aria-label="Eliminar meta">✕</button>
    `;

        lista.appendChild(item);
    });
}

/**
 * Inicializa el input de nueva meta (Enter para agregar).
 */
function inicializarInputMeta() {
    const input = document.getElementById('nueva-meta');
    if (!input) return;

    input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            agregarMeta();
        }
    });
}

/**
 * Agrega una nueva meta a la lista.
 */
function agregarMeta() {
    const input = document.getElementById('nueva-meta');
    const texto = input.value.trim();
    if (!texto) return;

    const nuevaMeta = {
        id: metas.length > 0 ? Math.max(...metas.map(m => m.id)) + 1 : 1,
        texto,
        completado: false
    };

    metas.push(nuevaMeta);
    guardarMetas(metas);
    renderizarMetas();

    input.value = '';
    input.focus();
}

/**
 * Alterna el estado completado de una meta.
 * @param {number} id
 */
function toggleMeta(id) {
    const meta = metas.find(m => m.id === id);
    if (!meta) return;

    meta.completado = !meta.completado;
    guardarMetas(metas);
    renderizarMetas();
}

/**
 * Elimina una meta de la lista.
 * @param {number} id
 */
function eliminarMeta(id) {
    metas = metas.filter(m => m.id !== id);
    guardarMetas(metas);
    renderizarMetas();
}

// ============================================================
// Utilidades
// ============================================================

/**
 * Escapa caracteres HTML para prevenir XSS.
 * @param {string} str
 */
function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}
