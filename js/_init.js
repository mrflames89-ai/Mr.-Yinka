// ==========================================================
// Oyeniyi Portfolio - Initialization Module
// ==========================================================

(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var html = document.documentElement;
  var lastScroll = 0;

  /* =====================
     NEW: Mobile navigation toggle
     ===================== */
  function setNav(isOpen) {
    var mobileNav = document.getElementById("mobileNav");
    var toggle = document.querySelector(".nav-toggle");
    if (!mobileNav || !toggle) return;

    mobileNav.classList.toggle("active", isOpen);
    mobileNav.setAttribute("aria-hidden", String(!isOpen));
    toggle.classList.toggle("active", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
    document.body.classList.toggle("body-noscroll", isOpen);
  }

  var navToggle = document.querySelector(".nav-toggle");
  var mobileNav = document.getElementById("mobileNav");
  if (navToggle && mobileNav) {
    navToggle.addEventListener("click", function () {
      setNav(navToggle.getAttribute("aria-expanded") !== "true");
    });
    mobileNav.querySelector(".close-btn").addEventListener("click", function () {
      setNav(false);
    });
    mobileNav.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener("click", function () { setNav(false); });
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") setNav(false);
    });
  }

  /* =====================
     1. Reduced motion check
     ===================== */
  if (reduce) {
    html.classList.add("reduced");
  }

  /* =====================
     2. Scroll progress bar
     ===================== */
  function updateProgress() {
    var h = html.scrollHeight - window.innerHeight;
    var progress = h > 0 ? Math.min(window.scrollY / h, 1) : 0;
    document.querySelector(".scroll-progress").style.width = (progress * 100).toFixed(1) + "%";
  }
  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress, { passive: true });
  updateProgress();

  /* =====================
     3. Header scrolled state
     ===================== */
  function checkHeader() {
    var scrollY = window.pageYOffset;
    if (scrollY > lastScroll && scrollY > 100) {
      html.classList.add("scrolled");
    } else {
      html.classList.remove("scrolled");
    }
    lastScroll = scrollY <= 0 ? 0 : scrollY;
  }
  window.addEventListener("scroll", checkHeader, { passive: true });
  checkHeader();

  /* =====================
     4. Active nav link based on scroll section
     ===================== */
  function activateNav() {
    var scrollY = window.pageYOffset + 140;
    var sections = document.querySelectorAll("section[id]");
    var navLinks = document.querySelectorAll(".nav-link");

    navLinks.forEach(function (link) {
      link.classList.remove("active");
    });

    sections.forEach(function (current) {
      var sectionHeight = current.offsetHeight;
      var sectionTop = current.offsetTop;
      var sectionId = current.getAttribute("id");

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(function (link) {
          if (link.getAttribute("href") === "#" + sectionId) {
            link.classList.add("active");
          }
        });
      }
    });
  }

  window.addEventListener("scroll", activateNav);
  window.addEventListener("load", activateNav);

  /* =====================
     5. Counter / figure count-up
     ===================== */
  function initCounters() {
    var counterEls = document.querySelectorAll("[data-count]");
    if (!reduce && "IntersectionObserver" in window) {
      var counterIO = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          counterIO.unobserve(e.target);
          var el = e.target;
          var end = parseInt(el.getAttribute("data-count"), 10);
          var start = 0;
          var duration = 1800;
          var startTime = null;

          function tick(currentTime) {
            if (!startTime) startTime = currentTime;
            var progress = Math.min((currentTime - startTime) / duration, 1);
            var eased = 1 - Math.pow(1 - progress, 3);
            var value = Math.round(start + (end - start) * eased);
            el.textContent = value.toLocaleString();
            if (progress < 1) {
              requestAnimationFrame(tick);
            }
          }
          requestAnimationFrame(tick);
        });
      }, { threshold: 0.6 });
      counterEls.forEach(function (el) { counterIO.observe(el); });
    }
  }

  /* =====================
     6. Staggered hero load on page load
     ===================== */
  function initHeroLoad() {
    if (reduce) return;

    var heroElements = document.querySelectorAll(
      ".hero-badge, .hero-name .name-part, .hero-statement, .hero-role, .hero-actions, .hero-portrait"
    );

    heroElements.forEach(function (el, i) {
      el.classList.add("hero-intro");
      el.style.setProperty("--hero-delay", (i * 85) + "ms");
    });

    html.classList.add("hero-ready");
  }

  /* =====================
     7. Section fade-in on scroll
     ===================== */
  function initSectionReveal() {
    var revealItems = document.querySelectorAll(
      ".section-subheading, .fig-item, .cap-card, .award-card, .principle-card, .career-timeline, .timeline-node, .project-slot, .about-text p, .about-highlight, .contact-card, .contact-details"
    );

    if ("IntersectionObserver" in window && !reduce) {
      html.classList.add("js");
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      }, {
        threshold: 0.12,
        rootMargin: "0px 0px -6% 0px"
      });
      revealItems.forEach(function (el, i) {
        el.classList.add("reveal-on-scroll");
        el.style.setProperty("--reveal-delay", (i % 4 * 75) + "ms");
        io.observe(el);
      });
    } else {
      revealItems.forEach(function (el) {
        el.classList.add("is-visible");
      });
    }
  }

  /* =====================
     9. Initialize all functions
     ===================== */
  function init() {
    initCounters();
    initHeroLoad();
    initSectionReveal();
    updateProgress();
  }

  init();

  var contactForm = document.querySelector(".contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", function (event) {
      event.preventDefault();
      var submitButton = contactForm.querySelector('button[type="submit"]');
      if (submitButton) {
        submitButton.textContent = "[Form submission service to be connected]";
        submitButton.disabled = true;
      }
    });
  }

  var currentYear = document.getElementById("current-year");
  if (currentYear) currentYear.textContent = new Date().getFullYear();

  /* =====================
     10. Smooth scroll for anchor links
     ===================== */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      var targetId = anchor.getAttribute("href");
      if (targetId === "#" || targetId === "") return;
      var targetElement = document.querySelector(targetId);
      if (targetElement) {
        var headerHeight = document.querySelector(".site-header") ?
          document.querySelector(".site-header").offsetHeight : 80;
        var targetPos = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        window.scrollTo({
          top: targetPos,
          behavior: reduce ? "auto" : "smooth"
        });
      }
    });
  });

})();