/* Pinnacle Shield Insurance – Main JS */

/* ----- Smooth Scroll ----- */
var SCROLL_DURATION = 900; // ms — tweak this value to taste

function easingFn(t) {
    // easeInOutQuad: starts slow, speeds up, then slows to a stop
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

function smoothScrollTo(targetY) {
    var startY = window.pageYOffset;
    var distance = targetY - startY;
    var startTime = null;

    function step(timestamp) {
        if (!startTime) startTime = timestamp;
        var elapsed = timestamp - startTime;
        var progress = Math.min(elapsed / SCROLL_DURATION, 1); // clamp 0–1
        var ease = easingFn(progress);

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

        var target = document.querySelector(this.getAttribute('href'));
        if (target) {
            var navbar = document.querySelector('.navbar');
            var navbarHeight = navbar ? navbar.offsetHeight : 0;
            var targetTop = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
            smoothScrollTo(targetTop);
        }
    });
});

/* ----- Active Nav Highlighting ----- */
(function () {
    // Get just the filename part of the current URL (e.g. "index.html" or "about.html").
    // If the path ends in "/" we default to "index.html".
    var currentPage = window.location.pathname.split('/').pop() || 'index.html';

    document.querySelectorAll('.navbar-nav .nav-link').forEach(function (link) {
        // Get the filename from the link's href attribute
        var linkPage = link.getAttribute('href').split('/').pop();

        if (linkPage === currentPage) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        } else {
            link.classList.remove('active');
            link.removeAttribute('aria-current');
        }
    });
})();

