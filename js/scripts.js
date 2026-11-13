// ==========================================================
// Oyeniyi Portfolio - Enhanced scripts.js
// Professional animations and interactions with improved typography
// ==========================================================

(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var html = document.documentElement;
  var lastScroll = 0;

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
          var duration = 1800;
          var startTime = null;

          function tick(currentTime) {
            if (!startTime) startTime = currentTime;
            var progress = Math.min((currentTime - startTime) / duration, 1);
            var eased = 1 - Math.pow(1 - progress, 3);
            var value = Math.round(start + (end - start) * eased);
            // Format with + suffix and comma for thousands
            if (el.closest(".fig-item")) {
              el.textContent = value.toLocaleString() + "+";
            } else {
              el.textContent = value + "+";
            }
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

    var startTime = performance.now();

    var heroElements = document.querySelectorAll(
      ".hero-badge, .hero-name .name-part, .hero-statement, .hero-role, .hero-actions, .hero-portrait"
    );

    // Set initial state with staggered delays
    heroElements.forEach(function (el, i) {
      el.style.opacity = "0";
      el.style.transform = "translateY(28px)";
      el.style.transition = "opacity .7s cubic-bezier(.22, 1, .36, 1), transform .7s cubic-bezier(.22, 1, .36, 1)";
      el.style.transitionDelay = (i * 110) + "ms";
      el.setAttribute("data-d", i);
    });

    // Trigger the cascade using requestAnimationFrame
    (function runHeroLoad(time) {
      var elapsed = time - startTime;
      heroElements.forEach(function (el) {
        var delay = parseInt(el.getAttribute("data-d"), 10) * 110;
        if (elapsed > delay) {
          el.style.opacity = "1";
          el.style.transform = "none";
        }
      });
      var stillHidden = Array.from(heroElements).some(function (el) {
        return el.style.opacity === "0";
      });
      if (stillHidden) {
        requestAnimationFrame(runHeroLoad);
      }
    })();
  }

  /* =====================
     7. Section fade-in on scroll
     ===================== */
  function initSectionReveal() {
    var revealItems = document.querySelectorAll(
      ".fig-item, .cap-card, .award-card, .principle-card, .project-slot, .timeline-node, .about-text p, .quote-block"
    );

    if ("IntersectionObserver" in window && !reduce) {
      html.classList.add("js");
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.style.opacity = "1";
            e.target.style.transform = "none";
            io.unobserve(e.target);
          }
        });
      }, {
        threshold: 0.12,
        rootMargin: "0px 0px -6% 0px"
      });
      revealItems.forEach(function (el) {
        el.style.opacity = "0";
        el.style.transform = "translateY(24px)";
        el.style.transition = "opacity .6s cubic-bezier(.22, 1, .36, 1), transform .6s cubic-bezier(.22, 1, .36, 1)";
        io.observe(el);
      });
      // Ensure all appear after 5 seconds
      setTimeout(function () {
        revealItems.forEach(function (el) {
          el.style.opacity = "1";
          el.style.transform = "none";
        });
      }, 5000);
    } else {
      revealItems.forEach(function (el) {
        el.style.opacity = "1";
        el.style.transform = "none";
      });
    }
  }

  /* =====================
     8. Enhanced career timeline
     ===================== */
  function initTimeline() {
    var timeline = document.getElementById("career");
    if (!timeline) return;

    var runEl = timeline.querySelector(".career-timeline");
    if (!runEl) return;

    // Size the timeline pulse line
    function sizeRun() {
      if (runEl) {
        runEl.style.setProperty("--run-h", Math.max(runEl.offsetHeight - 50, 80) + "px");
      }
    }
    sizeRun();
    window.addEventListener("resize", sizeRun);

    // Add travelling pulse only if not reduced motion
    if (!reduce) {
      if (!runEl.querySelector(".timeline-pulse")) {
        var pulse = document.createElement("div");
        pulse.className = "timeline-pulse";
        pulse.style.cssText = [
          "position: absolute;",
          "left: 10px;",
          "top: 0;",
          "width: 6px;",
          "height: 100%;",
          "border-radius: 0 4px 4px 0;",
          "background: var(--accent);",
          "animation: travel 5.5s linear infinite;",
          "box-shadow: 0 0 12px var(--glow);",
          "pointer-events: none;",
          "z-index: 10;",
          "opacity: 0;",
          "transition: opacity .3s;",
          ";"
        ].join("");
        runEl.parentNode.insertBefore(pulse, runEl);
      }
    }
  }

  /* =====================
     9. Initialize all functions
     ===================== */
  function init() {
    initCounters();
    initHeroLoad();
    initSectionReveal();
    initTimeline();
    updateProgress();
  }

  // Start initialization
  var startTime = performance.now();
  init();

  // Continuous progress bar update
  setInterval(updateProgress, 50);

  /* =====================
     9. Smooth scroll for anchor links
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
          behavior: "smooth"
        });
      }
    });
  });

  /* =====================
     10. Orb decorative element (optional, disabled for perf)
     ===================== */
  // Minimal decorative - just a subtle preference
  // if (!reduce) { /* orb code could go here */ }

})();