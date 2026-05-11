// Hamburger nav toggle – shared across all pages
const toggle = document.querySelector('.nav-toggle');
const nav    = document.getElementById('main-nav');
if (toggle && nav) {
    toggle.addEventListener('click', () => {
        const open = nav.classList.toggle('open');
        toggle.setAttribute('aria-expanded', open);
    });
}
