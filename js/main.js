/**
 * ACS Barranquilla - Main JavaScript
 * Features: Navbar scroll effect, counter animation,
 * scroll-reveal, smooth scroll, carousel auto-init
 */

(function () {
  "use strict";

  /* =============================================
     1. NAVBAR — Glassmorphism on scroll
  ============================================= */
  const mainNav = document.getElementById("mainNav");

  function updateNavbar() {
    if (window.scrollY > 60) {
      mainNav.classList.add("scrolled");
    } else {
      mainNav.classList.remove("scrolled");
    }
  }

  window.addEventListener("scroll", updateNavbar, { passive: true });
  updateNavbar(); // run once on load

  /* =============================================
     2. BACK TO TOP BUTTON
  ============================================= */
  const backToTopBtn = document.getElementById("backToTop");

  window.addEventListener(
    "scroll",
    () => {
      if (window.scrollY > 400) {
        backToTopBtn.classList.add("visible");
      } else {
        backToTopBtn.classList.remove("visible");
      }
    },
    { passive: true }
  );

  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* =============================================
     3. SMOOTH SCROLL for anchor links
  ============================================= */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();

      // Close mobile navbar if open
      const navbarCollapse = document.querySelector(".navbar-collapse");
      if (navbarCollapse && navbarCollapse.classList.contains("show")) {
        const toggler = document.querySelector(".navbar-toggler");
        toggler && toggler.click();
      }

      const navbarHeight = mainNav.offsetHeight;
      const targetTop =
        target.getBoundingClientRect().top + window.scrollY - navbarHeight - 16;
      window.scrollTo({ top: targetTop, behavior: "smooth" });
    });
  });

  /* =============================================
     4. COUNTER ANIMATION
  ============================================= */
  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const duration = 2000; // ms
    const stepTime = 30;
    const steps = Math.floor(duration / stepTime);
    let current = 0;
    const increment = target / steps;
    const suffix = el.dataset.suffix || "";

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        clearInterval(timer);
        current = target;
      }
      el.textContent = Math.floor(current).toLocaleString("es-CO") + suffix;
    }, stepTime);
  }

  /* =============================================
     5. INTERSECTION OBSERVER — Scroll Reveal + Counters
  ============================================= */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -48px 0px" }
  );

  document
    .querySelectorAll(".reveal, .reveal-left, .reveal-right")
    .forEach((el) => revealObserver.observe(el));

  // Counter observer — only fire once
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  document
    .querySelectorAll(".stat-number[data-target]")
    .forEach((el) => counterObserver.observe(el));

  /* =============================================
     6. ACTIVE NAV LINK on scroll
  ============================================= */
  const navLinks = document.querySelectorAll(".navbar-nav .nav-link[href^='#']");
  const sections = [];

  navLinks.forEach((link) => {
    const targetId = link.getAttribute("href");
    const section = document.querySelector(targetId);
    if (section) sections.push({ link, section });
  });

  function updateActiveNav() {
    const scrollPos = window.scrollY + mainNav.offsetHeight + 80;

    sections.forEach(({ link, section }) => {
      const top = section.offsetTop;
      const bottom = top + section.offsetHeight;
      if (scrollPos >= top && scrollPos < bottom) {
        navLinks.forEach((l) => l.classList.remove("active"));
        link.classList.add("active");
      }
    });
  }

  window.addEventListener("scroll", updateActiveNav, { passive: true });

  /* =============================================
     7. CONTACT FORM — simple feedback
  ============================================= */
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const btn = this.querySelector('[type="submit"]');
      const origText = btn.innerHTML;

      btn.innerHTML =
        '<span class="spinner-border spinner-border-sm me-2" role="status"></span>Enviando...';
      btn.disabled = true;

      setTimeout(() => {
        btn.innerHTML =
          '<i class="bi bi-check-circle-fill me-2"></i>¡Mensaje enviado!';
        btn.style.background =
          "linear-gradient(135deg, #38a169, #48bb78)";

        setTimeout(() => {
          btn.innerHTML = origText;
          btn.style.background = "";
          btn.disabled = false;
          contactForm.reset();
        }, 3500);
      }, 1600);
    });
  }

  /* =============================================
     8. HERO CAROUSEL — ensure it autoplays
  ============================================= */
  const heroCarouselEl = document.getElementById("heroCarousel");
  if (heroCarouselEl && typeof bootstrap !== "undefined") {
    new bootstrap.Carousel(heroCarouselEl, {
      interval: 5500,
      ride: "carousel",
      pause: "hover",
    });
  }

  /* =============================================
     9. Tooltip init (Bootstrap)
  ============================================= */
  if (typeof bootstrap !== "undefined") {
    document
      .querySelectorAll('[data-bs-toggle="tooltip"]')
      .forEach((el) => new bootstrap.Tooltip(el));
  }
})();
