// ============ COPIAR COMANDOS ============
document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
        const text = btn.getAttribute('data-copy');
        if (!text) return;
        try {
            await navigator.clipboard.writeText(text);
            btn.textContent = '✓ Copiado';
            btn.classList.add('copied');
            setTimeout(() => {
                btn.textContent = 'Copiar';
                btn.classList.remove('copied');
            }, 1500);
        } catch (err) {
            // Fallback para navegadores sin clipboard API
            const ta = document.createElement('textarea');
            ta.value = text;
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
            btn.textContent = '✓ Copiado';
            btn.classList.add('copied');
            setTimeout(() => {
                btn.textContent = 'Copiar';
                btn.classList.remove('copied');
            }, 1500);
        }
    });
});

// ============ NAVEGACIÓN ACTIVA ============
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.exercise, .block');

function setActive() {
    let current = '';
    const scrollY = window.scrollY;

    sections.forEach(sec => {
        const top = sec.offsetTop - 120;
        if (scrollY >= top) current = sec.id;
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', setActive);
window.addEventListener('load', setActive);

// ============ SCROLL SUAVE ============
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const target = document.getElementById(targetId);
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 90,
                behavior: 'smooth'
            });
        }
    });
});