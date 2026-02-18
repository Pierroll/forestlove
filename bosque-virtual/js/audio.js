// ============================================================
// audio.js – Control de música de fondo (Globally)
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
    initAudioPlayer();
});

function initAudioPlayer() {
    // 1. Crear elemento de audio si no existe
    let audio = document.getElementById('bg-music');
    if (!audio) {
        audio = document.createElement('audio');
        audio.id = 'bg-music';
        audio.src = 'assets/audio/loop.mp3'; // Ruta del archivo
        audio.loop = true;
        audio.volume = 0.4; // Volumen inicial moderado
        document.body.appendChild(audio);
    }

    // 2. Crear botón flotante si no existe en el DOM
    // (Se puede insertar manualmente en el HTML o dinámicamente aquí)
    let btnMusic = document.getElementById('fab-music');
    if (!btnMusic) {
        btnMusic = document.createElement('button');
        btnMusic.id = 'fab-music';
        btnMusic.className = 'fab-music';
        btnMusic.innerHTML = '<i class="ph ph-speaker-high"></i>';
        btnMusic.setAttribute('aria-label', 'Controlar música');
        document.body.appendChild(btnMusic);
    }

    // 3. Iconos
    const iconOn = '<i class="ph ph-speaker-high"></i>';
    const iconOff = '<i class="ph ph-speaker-slash"></i>';

    // 4. Leer estado guardado
    const isMuted = localStorage.getItem('bosque_music_muted') === 'true';

    // 5. Aplicar estado inicial
    audio.muted = isMuted;
    updateButtonIcon(btnMusic, isMuted ? iconOff : iconOn);

    // 6. Intentar reproducir (Autoplay policy handling)
    // Los navegadores bloquean autoplay hasta que haya interacción.
    const tryPlay = () => {
        audio.play().catch(err => {
            console.log("Autoplay bloqueado, esperando interacción...", err);
            // Añadir listener global de un solo uso para iniciar
            const playOnInteraction = () => {
                audio.play().catch(e => console.error("Error al reproducir:", e));
                document.removeEventListener('click', playOnInteraction);
                document.removeEventListener('keydown', playOnInteraction);
            };
            document.addEventListener('click', playOnInteraction);
            document.addEventListener('keydown', playOnInteraction);
        });
    };

    // Solo intentar reproducir si NO está muteado por preferencia del usuario
    if (!isMuted) {
        tryPlay();
    }

    // 7. Evento Click en el botón
    btnMusic.addEventListener('click', () => {
        // Toggle mute
        audio.muted = !audio.muted;

        // Guardar preferencia
        localStorage.setItem('bosque_music_muted', audio.muted);

        // Actualizar UI
        updateButtonIcon(btnMusic, audio.muted ? iconOff : iconOn);

        // Si desmuteamos y no estaba sonando, asegurar que suene
        if (!audio.muted && audio.paused) {
            audio.play().catch(e => console.error(e));
        }
    });
}

function updateButtonIcon(btn, iconHtml) {
    btn.innerHTML = iconHtml;
    // Efecto visual opcional al cambiar
    btn.classList.add('pulse');
    setTimeout(() => btn.classList.remove('pulse'), 300);
}
