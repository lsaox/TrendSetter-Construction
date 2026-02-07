// ==========================
// HEADER SHRINK ON SCROLL
// ==========================
(function () {
  const header = document.getElementById("siteHeader");
  if (!header) return;

  const onScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add("ts-header--scrolled");
    } else {
      header.classList.remove("ts-header--scrolled");
    }
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();

// ==========================
// MOBILE MENU TOGGLE
// ==========================
(function () {
  const mobileToggle = document.getElementById("mobileToggle");
  const mobileMenu = document.getElementById("mobileMenu");

  if (!mobileToggle || !mobileMenu) return;

  function setIcon(isOpen) {
    mobileToggle.innerHTML = isOpen
      ? '<i class="fa-solid fa-xmark"></i>'
      : '<i class="fa-solid fa-bars"></i>';
  }

  mobileToggle.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.toggle("hidden") === false;
    setIcon(isOpen);
  });

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.add("hidden");
      setIcon(false);
    });
  });
})();

// ==========================
// STAT COUNTERS (one clean version)
// ==========================
(function () {
  const statEls = Array.from(document.querySelectorAll(".ts-stat-num"));
  if (!statEls.length) return;

  let hasRun = false;

  function animateStats() {
    if (hasRun) return;
    hasRun = true;

    statEls.forEach((el) => {
      const targetAttr = el.getAttribute("data-target");
      if (!targetAttr) return;

      const target = parseFloat(targetAttr);
      if (isNaN(target)) return;

      const suffix = el.getAttribute("data-suffix") || "";
      const decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
      const duration = 1200;
      const start = performance.now();

      const from = 0;

      function step(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic

        const value = from + (target - from) * eased;
        el.textContent = value.toFixed(decimals) + suffix;

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.classList.add("ts-stat-done");
        }
      }

      requestAnimationFrame(step);
    });
  }

  const statsSection =
    document.getElementById("stats") || document.querySelector(".ts-stats");
  if (!statsSection) {
    animateStats();
    return;
  }

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateStats();
            observer.disconnect();
          }
        });
      },
      { threshold: 0.25 }
    );

    observer.observe(statsSection);
  } else {
    animateStats();
  }
})();

// ============================
// PORTFOLIO GALLERY WIRING (for Gallery.html etc.)
// ============================
(function () {
  const galleries = document.querySelectorAll("[data-gallery]");
  if (!galleries.length) return;

  galleries.forEach((gallery) => {
    const mainImage = gallery.querySelector("[data-main-image]");
    const thumbsContainer = gallery.querySelector("[data-thumbs]");
    const thumbs = thumbsContainer
      ? Array.from(thumbsContainer.querySelectorAll("img"))
      : [];
    const prevBtn = gallery.querySelector("[data-prev]");
    const nextBtn = gallery.querySelector("[data-next]");

    if (!mainImage || !thumbs.length) return;

    let currentIndex = 0;

    function setActive(index) {
      if (index < 0) index = thumbs.length - 1;
      if (index >= thumbs.length) index = 0;
      currentIndex = index;

      thumbs.forEach((thumb, i) => {
        thumb.classList.toggle("active", i === currentIndex);
      });

      const fullSrc = thumbs[currentIndex].dataset.full || thumbs[currentIndex].src;
      mainImage.style.opacity = "0";
      setTimeout(() => {
        mainImage.src = fullSrc;
        mainImage.alt = thumbs[currentIndex].alt || "Project image";
        mainImage.style.opacity = "1";
      }, 120);
    }

    thumbs.forEach((thumb, index) => {
      thumb.addEventListener("click", () => setActive(index));
    });

    if (prevBtn) {
      prevBtn.addEventListener("click", () => setActive(currentIndex - 1));
    }
    if (nextBtn) {
      nextBtn.addEventListener("click", () => setActive(currentIndex + 1));
    }

    setActive(0);
  });
})();

// ============================
// HERO VIDEO – stop near the end
// ============================
(function () {
  document.addEventListener("DOMContentLoaded", () => {
    const video = document.querySelector(".ts-hero-video");
    if (!video) return;

    const pauseBeforeEnd = 1; // seconds before end

    function stopNearEnd() {
      if (video.duration && video.currentTime >= video.duration - pauseBeforeEnd) {
        video.pause();
        video.removeEventListener("timeupdate", stopNearEnd);
      }
    }

    video.addEventListener("timeupdate", stopNearEnd);
  });
})();

// ============================
// SIMPLE FADE-UP HELPER
// (for elements with .ts-fade-up)
// ============================
(function () {
  const els = Array.from(document.querySelectorAll(".ts-fade-up"));
  if (!els.length || !("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("ts-in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 }
  );

  els.forEach((el) => observer.observe(el));
})();

// ============================
// YEAR IN FOOTER
// ============================
(function () {
  const yearEl = document.getElementById("year");
  if (!yearEl) return;
  yearEl.textContent = new Date().getFullYear();
})();

// ============================
// SWIPER – FEATURED PROJECTS
// ============================
(function () {
  function initSwiperWhenReady() {
    if (typeof Swiper === "undefined") {
      setTimeout(initSwiperWhenReady, 60);
      return;
    }

    const isMobile = window.matchMedia("(max-width: 767px)").matches;

    const baseConfig = {
      loop: true,
      speed: 650,
      grabCursor: true,
      navigation: {
        nextEl: "[data-swiper-next]",
        prevEl: "[data-swiper-prev]",
      },
      pagination: {
        el: ".ts-swiper-pagination",
        clickable: true,
        bulletClass: "ts-swiper-bullet",
        bulletActiveClass: "ts-swiper-bullet-active",
      },
    };

    const mobileConfig = Object.assign({}, baseConfig, {
      effect: "slide",
      centeredSlides: false,
      slidesPerView: 1,
      spaceBetween: 14,
    });

    const desktopConfig = Object.assign({}, baseConfig, {
      effect: "coverflow",
      centeredSlides: true,
      slidesPerView: "auto",
      spaceBetween: 26,
      coverflowEffect: {
        rotate: 10,
        stretch: 0,
        depth: 140,
        modifier: 1,
        slideShadows: false,
      },
      breakpoints: {
        1024: {
          spaceBetween: 28,
          coverflowEffect: {
            rotate: 12,
            stretch: 0,
            depth: 160,
            modifier: 1,
            slideShadows: false,
          },
        },
        1280: {
          spaceBetween: 32,
          coverflowEffect: {
            rotate: 14,
            stretch: 0,
            depth: 180,
            modifier: 1,
            slideShadows: false,
          },
        },
      },
    });

    new Swiper(".ts-project-swiper", isMobile ? mobileConfig : desktopConfig);
  }

  // Use load so layout + Swiper script are fully ready
  window.addEventListener("load", initSwiperWhenReady);
})();
