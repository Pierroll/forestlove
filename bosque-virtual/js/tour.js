// ============================================================
// tour.js – Tour interactivo de bienvenida
// Bosque Virtual de los Dos
// ============================================================

const TOUR_KEY = "bosque_tour_visto";

// ── Pasos del tour por página ──────────────────────────────
const PASOS_TOUR = {
    "index.html": [
        {
            titulo: "¡Bienvenida al Bosque! 🌿",
            texto: "Este es tu bosque de recuerdos. Cada árbol representa un momento especial que hemos vivido juntos.",
            icono: "ph-tree-evergreen",
            posicion: "center"
        },
        {
            titulo: "Estadísticas del Bosque",
            texto: "Aquí puedes ver cuántos recuerdos hemos plantado, los días que llevamos juntos y cuántos lugares hemos visitado.",
            icono: "ph-chart-bar",
            selector: ".hero-stats",
            posicion: "top"
        },
        {
            titulo: "Entrar al Bosque",
            texto: "Haz clic aquí para ver el mapa del bosque con todos nuestros recuerdos plantados como árboles.",
            icono: "ph-map-trifold",
            selector: "a[href='bosque.html']",
            posicion: "bottom"
        },
        {
            titulo: "Ver Estadísticas",
            texto: "En el Dashboard puedes ver gráficos de tus recuerdos y gestionar los sueños que queremos cumplir juntos.",
            icono: "ph-shooting-star",
            selector: "a[href='dashboard.html']",
            posicion: "bottom"
        }
    ],
    "bosque.html": [
        {
            titulo: "El Mapa del Bosque 🗺️",
            texto: "Este es el corazón de la app. Cada árbol en el mapa es un recuerdo nuestro. Haz clic en cualquier árbol para leer su historia.",
            icono: "ph-map-trifold",
            selector: "#mapa",
            posicion: "bottom"
        },
        {
            titulo: "Tipos de Árboles",
            texto: "Los árboles tienen diferentes tipos: Brote (nuevo), Joven (especial), Grande (profundo) y Especial (único). ¡Los especiales brillan con luz dorada!",
            icono: "ph-star",
            selector: ".leyenda",
            posicion: "top"
        },
        {
            titulo: "Plantar un Nuevo Recuerdo",
            texto: "Usa este panel para agregar un nuevo recuerdo. Escribe el título, la fecha, el lugar y la historia. Luego elige el tipo de árbol.",
            icono: "ph-plus-circle",
            selector: ".panel-lateral",
            posicion: "left"
        },
        {
            titulo: "Posición del Árbol",
            texto: "Usa los deslizadores para elegir exactamente dónde quedará tu árbol en el bosque.",
            icono: "ph-arrows-out-cardinal",
            selector: "#r-x",
            posicion: "top"
        },
        {
            titulo: "Eliminar Recuerdos",
            texto: "Al hacer clic en un árbol y abrir su historia, encontrarás un botón para eliminarlo. ¡Pero piénsalo bien, los recuerdos son preciosos!",
            icono: "ph-trash",
            posicion: "center"
        }
    ],
    "dashboard.html": [
        {
            titulo: "Dashboard Forestal 📊",
            texto: "Aquí puedes ver todas las estadísticas de nuestro bosque: recuerdos plantados, días juntos, lugares visitados y momentos especiales.",
            icono: "ph-chart-bar",
            selector: ".metricas-grid",
            posicion: "bottom"
        },
        {
            titulo: "Nivel de Amor",
            texto: "Siempre al 100%. Sin condiciones. Sin límites. Esta barra nunca bajará. 💚",
            icono: "ph-heart",
            selector: ".amor-card",
            posicion: "top"
        },
        {
            titulo: "Árboles por Tipo",
            texto: "Este gráfico muestra cuántos recuerdos tienes de cada tipo. Conforme vayas agregando más, el gráfico irá creciendo.",
            icono: "ph-tree",
            selector: "#grafico-tipos",
            posicion: "right"
        },
        {
            titulo: "Sueños Futuros ⭐",
            texto: "Aquí puedes escribir los sueños que quieres cumplir juntos. Cuando los cumplan, márcalos como completados. ¡Y agrega todos los que quieras!",
            icono: "ph-shooting-star",
            selector: ".card-seccion:last-child",
            posicion: "left"
        }
    ]
};

// ── Estado ─────────────────────────────────────────────────
let pasoActual = 0;
let pasosDelaTour = [];

// ── Detectar página actual ─────────────────────────────────
function getPaginaActual() {
    const path = window.location.pathname;
    if (path.includes("bosque")) return "bosque.html";
    if (path.includes("dashboard")) return "dashboard.html";
    return "index.html";
}

// ── Inicializar tour ───────────────────────────────────────
function inicializarTour() {
    const pagina = getPaginaActual();
    pasosDelaTour = PASOS_TOUR[pagina] || [];
    inyectarEstilos();
    crearBotonAyuda();
    const yaVisto = localStorage.getItem(TOUR_KEY + "_" + pagina);
    if (!yaVisto) setTimeout(() => mostrarBienvenida(), 900);
}

// ── Estilos del tour ───────────────────────────────────────
function inyectarEstilos() {
    if (document.getElementById("tour-styles")) return;
    const style = document.createElement("style");
    style.id = "tour-styles";
    style.textContent = `
    #tour-highlight {
      position: fixed; z-index: 9001; border-radius: 12px;
      box-shadow: 0 0 0 9999px rgba(10,25,16,0.72);
      transition: all 0.4s cubic-bezier(0.4,0,0.2,1);
      pointer-events: none; display: none;
    }
    #tour-tooltip {
      position: fixed; z-index: 9100; background: white;
      border-radius: 18px; padding: 26px 26px 20px;
      max-width: 340px; min-width: 260px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3), 0 0 0 1px rgba(116,198,157,0.15);
      font-family: 'Inter', sans-serif;
    }
    .tour-tip-icon {
      width: 42px; height: 42px; background: #f0faf4; border-radius: 11px;
      display: flex; align-items: center; justify-content: center;
      margin-bottom: 12px; border: 1.5px solid rgba(116,198,157,0.25);
    }
    .tour-tip-icon i { font-size: 1.3rem; color: #2D6A4F; }
    .tour-tip-titulo {
      font-family: 'Cormorant Garamond', serif; font-size: 1.3rem;
      font-weight: 500; color: #1B4332; margin-bottom: 8px; line-height: 1.25;
    }
    .tour-tip-texto { font-size: 0.85rem; color: #3d5a47; line-height: 1.7; margin-bottom: 18px; }
    .tour-tip-footer { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
    .tour-progreso { display: flex; gap: 4px; align-items: center; }
    .tour-dot { width: 6px; height: 6px; border-radius: 50%; background: #d0ead8; transition: all 0.25s; }
    .tour-dot.activo { background: #2D6A4F; width: 16px; border-radius: 3px; }
    .tour-botones { display: flex; gap: 7px; }
    .tour-btn-t {
      padding: 7px 15px; border-radius: 8px; border: none;
      font-family: 'Inter', sans-serif; font-size: 0.78rem; font-weight: 500;
      cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 4px;
    }
    .tour-btn-skip { background: transparent; color: #6b8f78; border: 1.5px solid #e0ede5; }
    .tour-btn-skip:hover { background: #f5faf7; color: #1B4332; }
    .tour-btn-next { background: #1B4332; color: white; }
    .tour-btn-next:hover { background: #2D6A4F; }
    .tour-btn-finish { background: linear-gradient(135deg, #2D6A4F, #74C69D); color: white; }
    .tour-btn-finish:hover { transform: scale(1.03); }
    #btn-tour-ayuda {
      position: fixed; bottom: 28px; right: 28px; z-index: 8000;
      width: 50px; height: 50px; border-radius: 50%;
      background: #1B4332; color: white; border: none; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 4px 20px rgba(27,67,50,0.4); transition: all 0.25s; font-size: 1.3rem;
    }
    #btn-tour-ayuda:hover { background: #2D6A4F; transform: scale(1.1) rotate(15deg); }
    .ayuda-tip {
      position: absolute; right: 58px; bottom: 50%; transform: translateY(50%);
      background: #1B4332; color: white; font-size: 0.72rem; font-weight: 500;
      padding: 4px 10px; border-radius: 6px; white-space: nowrap;
      opacity: 0; pointer-events: none; transition: opacity 0.2s;
      font-family: 'Inter', sans-serif;
    }
    #btn-tour-ayuda:hover .ayuda-tip { opacity: 1; }
    #tour-bienvenida {
      position: fixed; inset: 0; z-index: 9200;
      background: rgba(10,25,16,0.88); backdrop-filter: blur(8px);
      display: flex; align-items: center; justify-content: center;
      padding: 20px; opacity: 0; transition: opacity 0.5s;
    }
    #tour-bienvenida.visible { opacity: 1; }
    .bv-card {
      background: white; border-radius: 24px; padding: 44px 36px 32px;
      max-width: 440px; width: 100%; text-align: center;
      box-shadow: 0 32px 80px rgba(0,0,0,0.4);
      animation: bvIn 0.5s cubic-bezier(0.34,1.2,0.64,1) 0.15s both;
    }
    @keyframes bvIn { from { transform: scale(0.85); opacity: 0; } to { transform: scale(1); opacity: 1; } }
    .bv-icon {
      width: 68px; height: 68px;
      background: linear-gradient(135deg, #e8f8ee, #d0f0df);
      border-radius: 50%; display: flex; align-items: center; justify-content: center;
      margin: 0 auto 22px; border: 2px solid rgba(116,198,157,0.3);
    }
    .bv-icon i { font-size: 1.9rem; color: #1B4332; }
    .bv-titulo {
      font-family: 'Cormorant Garamond', serif; font-size: 1.9rem;
      font-weight: 500; color: #1B4332; margin-bottom: 10px; line-height: 1.2;
    }
    .bv-subtitulo { font-size: 0.875rem; color: #6b8f78; line-height: 1.75; margin-bottom: 28px; font-style: italic; }
    .bv-botones { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }
  `;
    document.head.appendChild(style);
}

// ── Pantalla de bienvenida ─────────────────────────────────
function mostrarBienvenida() {
    const nombre = sessionStorage.getItem("bosque_nombre") || "amor";
    const pagina = getPaginaActual();
    const mensajes = {
        "index.html": {
            titulo: "Bienvenida, " + nombre + " 🌿",
            subtitulo: "Este es nuestro bosque de recuerdos. Un lugar construido con amor, árbol por árbol. ¿Quieres que te muestre cómo funciona?"
        },
        "bosque.html": {
            titulo: "El Corazón del Bosque 🗺️",
            subtitulo: "Aquí viven todos nuestros recuerdos como árboles. Puedes explorarlos, agregar nuevos y eliminarlos. ¿Te muestro cómo?"
        },
        "dashboard.html": {
            titulo: "Nuestras Estadísticas 📊",
            subtitulo: "Aquí puedes ver el estado de nuestro bosque y gestionar los sueños que queremos cumplir juntos. ¿Te explico cómo funciona?"
        }
    };
    const msg = mensajes[pagina] || mensajes["index.html"];
    const div = document.createElement("div");
    div.id = "tour-bienvenida";
    div.innerHTML = `
    <div class="bv-card">
      <div class="bv-icon"><i class="ph ph-tree-evergreen"></i></div>
      <h2 class="bv-titulo">${msg.titulo}</h2>
      <p class="bv-subtitulo">${msg.subtitulo}</p>
      <div class="bv-botones">
        <button class="tour-btn-t tour-btn-skip" onclick="cerrarBienvenida(false)">
          <i class="ph ph-x"></i> Explorar solo
        </button>
        <button class="tour-btn-t tour-btn-finish" onclick="cerrarBienvenida(true)">
          <i class="ph ph-compass"></i> ¡Sí, muéstrame!
        </button>
      </div>
    </div>`;
    document.body.appendChild(div);
    requestAnimationFrame(() => requestAnimationFrame(() => div.classList.add("visible")));
}

function cerrarBienvenida(iniciar) {
    const div = document.getElementById("tour-bienvenida");
    if (div) { div.style.opacity = "0"; setTimeout(() => div.remove(), 400); }
    if (iniciar) setTimeout(() => iniciarPasos(), 350);
}

// ── Botón flotante de ayuda ────────────────────────────────
function crearBotonAyuda() {
    if (document.getElementById("btn-tour-ayuda")) return;
    const btn = document.createElement("button");
    btn.id = "btn-tour-ayuda";
    btn.setAttribute("aria-label", "Iniciar tour de ayuda");
    btn.innerHTML = `<i class="ph ph-question"></i><span class="ayuda-tip">¿Cómo funciona?</span>`;
    btn.addEventListener("click", () => {
        if (!document.getElementById("tour-bienvenida")) mostrarBienvenida();
    });
    document.body.appendChild(btn);
}

// ── Pasos del tour ─────────────────────────────────────────
function iniciarPasos() {
    pasoActual = 0;
    ["tour-highlight", "tour-tooltip"].forEach(id => {
        const e = document.getElementById(id); if (e) e.remove();
    });
    const hl = document.createElement("div"); hl.id = "tour-highlight"; document.body.appendChild(hl);
    const tt = document.createElement("div"); tt.id = "tour-tooltip"; document.body.appendChild(tt);
    mostrarPaso(0);
}

function mostrarPaso(idx) {
    const paso = pasosDelaTour[idx];
    if (!paso) return;
    const hl = document.getElementById("tour-highlight");
    const tt = document.getElementById("tour-tooltip");
    if (!hl || !tt) return;

    if (paso.selector) {
        const el = document.querySelector(paso.selector);
        if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "center" });
            setTimeout(() => {
                const r = el.getBoundingClientRect(), p = 10;
                hl.style.cssText = `display:block;top:${r.top - p}px;left:${r.left - p}px;width:${r.width + p * 2}px;height:${r.height + p * 2}px;`;
                posicionarTooltip(tt, r, paso.posicion);
            }, 380);
        } else { hl.style.display = "none"; centrarTooltip(tt); }
    } else { hl.style.display = "none"; centrarTooltip(tt); }

    const fin = idx === pasosDelaTour.length - 1;
    tt.innerHTML = `
    <div class="tour-tip-icon"><i class="ph ${paso.icono}"></i></div>
    <div class="tour-tip-titulo">${paso.titulo}</div>
    <div class="tour-tip-texto">${paso.texto}</div>
    <div class="tour-tip-footer">
      <div class="tour-progreso">
        ${pasosDelaTour.map((_, i) => `<div class="tour-dot ${i === idx ? "activo" : ""}"></div>`).join("")}
      </div>
      <div class="tour-botones">
        <button class="tour-btn-t tour-btn-skip" onclick="terminarTour()">
          <i class="ph ph-x"></i> Saltar
        </button>
        ${fin
            ? `<button class="tour-btn-t tour-btn-finish" onclick="terminarTour()"><i class="ph ph-check"></i> ¡Entendido!</button>`
            : `<button class="tour-btn-t tour-btn-next" onclick="siguientePaso()">Siguiente <i class="ph ph-arrow-right"></i></button>`
        }
      </div>
    </div>`;
}

function posicionarTooltip(tt, r, pos) {
    const tw = 340, th = 220, mg = 18, vw = window.innerWidth, vh = window.innerHeight;
    let top, left;
    if (pos === "top") { top = r.top - th - mg; left = r.left + r.width / 2 - tw / 2; }
    else if (pos === "bottom") { top = r.bottom + mg; left = r.left + r.width / 2 - tw / 2; }
    else if (pos === "left") { top = r.top + r.height / 2 - th / 2; left = r.left - tw - mg; }
    else if (pos === "right") { top = r.top + r.height / 2 - th / 2; left = r.right + mg; }
    else { centrarTooltip(tt); return; }
    left = Math.max(12, Math.min(left, vw - tw - 12));
    top = Math.max(12, Math.min(top, vh - th - 12));
    tt.style.cssText = `top:${top}px;left:${left}px;transform:none;`;
}

function centrarTooltip(tt) {
    tt.style.cssText = "top:50%;left:50%;transform:translate(-50%,-50%);";
}

function siguientePaso() {
    pasoActual++;
    if (pasoActual < pasosDelaTour.length) mostrarPaso(pasoActual);
    else terminarTour();
}

function terminarTour() {
    ["tour-highlight", "tour-tooltip"].forEach(id => {
        const e = document.getElementById(id);
        if (e) { e.style.opacity = "0"; setTimeout(() => e.remove(), 300); }
    });
    localStorage.setItem(TOUR_KEY + "_" + getPaginaActual(), "true");
}

// ── Auto-inicializar ───────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
    if (sessionStorage.getItem("bosque_auth")) inicializarTour();
});

