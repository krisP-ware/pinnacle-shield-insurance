/* =========================================
   Pinnacle Shield Insurance – Main JS
   ========================================= */

/* ----- Smooth Scroll ----- */
const SCROLL_DURATION = 900;

function easingFn(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

function smoothScrollTo(targetY) {
    const startY = window.pageYOffset;
    const distance = targetY - startY;
    let startTime = null;

    function step(timestamp) {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / SCROLL_DURATION, 1);
        const ease = easingFn(progress);

        window.scrollTo(0, startY + distance * ease);

        if (elapsed < SCROLL_DURATION) {
            requestAnimationFrame(step);
        }
    }

    requestAnimationFrame(step);
}

document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const navbar = document.querySelector('.navbar');
            const navbarHeight = navbar ? navbar.offsetHeight : 0;
            const targetTop = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
            smoothScrollTo(targetTop);
        }
    });
});
// end smooth scroll functions

/* ----- Active Nav Highlighting ----- */
(function () {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    document.querySelectorAll('.navbar-nav .nav-link').forEach(function (link) {
        const linkPage = link.getAttribute('href').split('/').pop();

        if (linkPage === currentPage) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        } else {
            link.classList.remove('active');
            link.removeAttribute('aria-current');
        }
    });
})();
