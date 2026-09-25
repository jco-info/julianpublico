/* ============================================================
   PRÁCTICA REDES DOCKER — JulianCO
   Funcionalidad: copiar comandos + navegación activa + scroll suave
   ============================================================ */

/* ============ COPIAR COMANDOS ============ */
document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
        const text = btn.getAttribute('data-copy');
        if (!text) return;

        try {
            await navigator.clipboard.writeText(text);
            mostrarCopiado(btn);
        } catch (err) {
            // Fallback para navegadores sin Clipboard API (o sin HTTPS)
            const ta = document.createElement('textarea');
            ta.value = text;
            ta.style.position = 'fixed';
            ta.style.opacity = '0';
            document.body.appendChild(ta);
            ta.select();
            try {
                document.execCommand('copy');
                mostrarCopiado(btn);
            } catch (e) {
                console.error('No se pudo copiar:', e);
            }
            document.body.removeChild(ta);
        }
    });
});

function mostrarCopiado(btn) {
    const original = btn.textContent;
    btn.textContent = '✓ Copiado';
    btn.classList.add('copied');
    setTimeout(() => {
        btn.textContent = original === '✓ Copiado' ? 'Copiar' : original;
        btn.classList.remove('copied');
    }, 1500);
}

/* ============ NAVEGACIÓN ACTIVA ============ */
const navLinks = document.querySelectorAll('.nav-link');
const secciones = document.querySelectorAll(
    '.exercise, .block > section, .block[id], section[id]'
);

function setActive() {
    let currentId = '';
    const scrollY = window.scrollY;
    const offset = 130;

    document.querySelectorAll('[id]').forEach(sec => {
        const top = sec.offsetTop - offset;
        if (scrollY >= top) {
            currentId = sec.id;
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + currentId) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', setActive);
window.addEventListener('load', setActive);

/* ============ SCROLL SUAVE ============ */
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (!href || !href.startsWith('#')) return;

        e.preventDefault();
        const targetId = href.substring(1);
        const target = document.getElementById(targetId);

        if (target) {
            const y = target.offsetTop - 90;
            window.scrollTo({
                top: y,
                behavior: 'smooth'
            });

            // Actualizar URL sin saltar
            history.pushState(null, '', '#' + targetId);
        }
    });
});

/* ============ EXTRA: RESALTAR SECCIÓN AL CARGAR CON HASH ============ */
window.addEventListener('load', () => {
    if (window.location.hash) {
        const target = document.querySelector(window.location.hash);
        if (target) {
            setTimeout(() => {
                const y = target.offsetTop - 90;
                window.scrollTo({ top: y, behavior: 'smooth' });
            }, 100);
        }
    }
});

/* ============ EXTRA: COPIAR CON DOBLE CLIC EN BLOQUES DE CÓDIGO ============ */
document.querySelectorAll('.terminal pre').forEach(pre => {
    pre.style.cursor = 'pointer';
    pre.title = 'Doble clic para copiar';

    pre.addEventListener('dblclick', async () => {
        const texto = pre.textContent.replace(/^\$\s/, '').trim();
        try {
            await navigator.clipboard.writeText(texto);
            const btn = pre.parentElement.querySelector('.copy-btn');
            if (btn) mostrarCopiado(btn);
        } catch (e) {
            console.error('Error al copiar con doble clic:', e);
        }
    });
});