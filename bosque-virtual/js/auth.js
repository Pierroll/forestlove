// ============================================================
// auth.js – Autenticación romántica (frontend only)
// Bosque Virtual de los Dos
// ============================================================

// Credenciales hardcodeadas (no es seguridad real, es magia)
// Dos usuarios: ella y él. Ambos acceden al mismo bosque.
const USUARIOS_VALIDOS = [
    { usuario: "nayeli", password: "0208", nombre: "Nayeli" },
    { usuario: "pierol", password: "0208", nombre: "Pierol" }
];

/**
 * Verifica si el usuario ya está autenticado.
 * Redirige al login si no lo está.
 */
function verificarAuth() {
    const autenticado = sessionStorage.getItem("bosque_auth");
    if (!autenticado) {
        window.location.href = "login.html";
    }
}

/**
 * Intenta iniciar sesión con las credenciales dadas.
 * El usuario es case-insensitive.
 * @param {string} usuario
 * @param {string} password
 * @returns {{ ok: boolean, nombre: string }}
 */
function intentarLogin(usuario, password) {
    const usuarioNorm = usuario.trim().toLowerCase();
    const match = USUARIOS_VALIDOS.find(
        u => u.usuario === usuarioNorm && u.password === password.trim()
    );
    if (match) {
        sessionStorage.setItem("bosque_auth", "true");
        sessionStorage.setItem("bosque_nombre", match.nombre);
        return { ok: true, nombre: match.nombre };
    }
    return { ok: false, nombre: "" };
}

/**
 * Devuelve el nombre del usuario autenticado.
 */
function obtenerNombreUsuario() {
    return sessionStorage.getItem("bosque_nombre") || "amor";
}

/**
 * Cierra la sesión y redirige al login.
 */
function cerrarSesion() {
    sessionStorage.removeItem("bosque_auth");
    sessionStorage.removeItem("bosque_nombre");
    window.location.href = "login.html";
}

// ============================================================
// Lógica del formulario de login (solo en login.html)
// ============================================================
document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("login-form");
    if (!form) return; // Solo ejecutar en login.html

    const mensajeError = document.getElementById("mensaje-error");
    const btnLogin = document.getElementById("btn-login");

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const usuario = document.getElementById("usuario").value;
        const mes = document.getElementById("mes").value;
        const dia = document.getElementById("dia").value;
        const password = mes + dia;

        // Animación de carga en el botón
        btnLogin.disabled = true;
        btnLogin.innerHTML = '<i class="ph ph-circle-notch ph-spin"></i> Buscando nuestra historia...';

        setTimeout(() => {
            const resultado = intentarLogin(usuario, password);

            if (resultado.ok) {
                // Éxito: animación y redirección
                btnLogin.innerHTML = '<i class="ph ph-check"></i> Entrando al bosque...';
                btnLogin.classList.add("btn-success");
                setTimeout(() => {
                    window.location.href = "index.html";
                }, 1000);
            } else {
                // Error: mostrar mensaje romántico
                mensajeError.innerHTML = '<i class="ph ph-heart-break"></i> Esa no es nuestra historia…';
                mensajeError.classList.add("visible");
                form.classList.add("shake");

                btnLogin.disabled = false;
                btnLogin.innerHTML = '<i class="ph ph-arrow-right"></i> Entrar al Bosque';

                setTimeout(() => form.classList.remove("shake"), 600);
                setTimeout(() => mensajeError.classList.remove("visible"), 3500);
            }
        }, 800);
    });
});
