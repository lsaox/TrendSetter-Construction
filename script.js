// ==========================
// HEADER SHRINK ON SCROLL
// ==========================
const header = document.getElementById("siteHeader");
window.addEventListener("scroll", () => {
  if (!header) return;
  header.classList.toggle("scrolled", window.scrollY > 40);
});

// ==========================
// MOBILE MENU TOGGLE
// ==========================
const mobileToggle = document.getElementById("mobileToggle");
const mobileMenu = document.getElementById("mobileMenu");

if (mobileToggle && mobileMenu) {
  mobileToggle.addEventListener("click", () => {
    const isOpen = !mobileMenu.classList.contains("hidden");
    mobileMenu.classList.toggle("hidden", isOpen);
    mobileToggle.innerHTML = isOpen
      ? '<i class="fa-solid fa-bars"></i>'
      : '<i class="fa-solid fa-xmark"></i>';
  });

  mobileMenu.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      mobileMenu.classList.add("hidden");
      mobileToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
    });
  });
}

// ==========================
// COUNT-UP STATS
// ==========================
const stats = document.getElementById("stats");
const nums = document.querySelectorAll(".ts-stat-num");
let played = false;

function animateStat(el) {
  const target = parseFloat(el.dataset.target || "0");
  const decimals = parseInt(el.dataset.decimals || "0", 10);
  const suffix = el.dataset.suffix || "";
  const duration = 1400;
  const start = performance.now();

  function tick(now) {
    const t = Math.min((now - start) / duration, 1);
    const val = target * t;
    el.textContent = (decimals ? val.toFixed(decimals) : Math.floor(val)) + suffix;
    if (t < 1) requestAnimationFrame(tick);
    else el.textContent = target.toFixed(decimals) + suffix;
  }

  requestAnimationFrame(tick);
}

if (stats) {
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting && !played) {
          played = true;
          nums.forEach(animateStat);
          obs.disconnect();
        }
      });
    },
    { threshold: 0.45 }
  );
  obs.observe(stats);
}

// ==========================
// 3D PROJECTS CAROUSEL
// (one single implementation)
// ==========================
document.addEventListener("DOMContentLoaded", () => {
  const track = document.getElementById("tsCarouselTrack");
  if (!track) return;

  const slides = Array.from(track.querySelectorAll(".ts-carousel-item"));
  const prevBtn = document.querySelector(".ts-carousel-prev");
  const nextBtn = document.querySelector(".ts-carousel-next");
  const dotsContainer = document.getElementById("tsCarouselDots");
  const dots = dotsContainer
    ? Array.from(dotsContainer.querySelectorAll(".ts-dot"))
    : [];

  let currentIndex = 0;
  let autoTimer = null;

  // --------------------------
  //   POSITIONING / CLASSES
  // --------------------------
  function updateCarousel() {
    const total = slides.length;

    // clear all slide states
    slides.forEach((slide) => {
      slide.classList.remove("is-active", "is-left", "is-right", "is-far");
    });

    const leftIndex = (currentIndex - 1 + total) % total;
    const rightIndex = (currentIndex + 1) % total;

    slides[currentIndex].classList.add("is-active");
    slides[leftIndex].classList.add("is-left");
    slides[rightIndex].classList.add("is-right");

    // everything else = hidden in the back
    slides.forEach((slide, i) => {
      if (i !== currentIndex && i !== leftIndex && i !== rightIndex) {
        slide.classList.add("is-far");
      }
    });

    // dots
    dots.forEach((dot, i) => {
      dot.classList.toggle("is-active", i === currentIndex);
    });
  }

  function goTo(index) {
    const total = slides.length;
    currentIndex = (index + total) % total;
    updateCarousel();
  }

  function next() {
    goTo(currentIndex + 1);
  }

  function prev() {
    goTo(currentIndex - 1);
  }

  // --------------------------
  //   BUTTONS & DOTS
  // --------------------------
  if (nextBtn) nextBtn.addEventListener("click", () => { next(); restartAuto(); });
  if (prevBtn) prevBtn.addEventListener("click", () => { prev(); restartAuto(); });

  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      const idx = Number(dot.dataset.index || 0);
      goTo(idx);
      restartAuto();
    });
  });

  // --------------------------
  //   AUTO-ROTATE
  // --------------------------
  function startAuto() {
    stopAuto();
    autoTimer = setInterval(next, 6500);
  }

  function stopAuto() {
    if (autoTimer) {
      clearInterval(autoTimer);
      autoTimer = null;
    }
  }

  function restartAuto() {
    stopAuto();
    startAuto();
  }

  track.addEventListener("mouseenter", stopAuto);
  track.addEventListener("mouseleave", startAuto);

  // --------------------------
  //   DRAG / SWIPE
  // --------------------------
  let isPointerDown = false;
  let startX = 0;
  let currentX = 0;
  const SWIPE_THRESHOLD = 60; // px

  function pointerDown(clientX) {
    isPointerDown = true;
    startX = clientX;
    currentX = clientX;
    track.classList.add("is-dragging");
    stopAuto();
  }

  function pointerMove(clientX) {
    if (!isPointerDown) return;
    currentX = clientX;
    // optional: slight visual nudge
    const delta = currentX - startX;
    track.style.transform = `translateX(${delta * 0.12}px)`;
  }

  function pointerUp() {
    if (!isPointerDown) return;
    const deltaX = currentX - startX;

    // reset transform
    track.style.transition = "transform 0.25s ease";
    track.style.transform = "translateX(0)";
    setTimeout(() => {
      track.style.transition = "";
    }, 260);

    if (deltaX > SWIPE_THRESHOLD) {
      prev();
    } else if (deltaX < -SWIPE_THRESHOLD) {
      next();
    }

    isPointerDown = false;
    track.classList.remove("is-dragging");
    setTimeout(startAuto, 400);
  }

  // mouse
  track.addEventListener("mousedown", (e) => {
    if (e.button !== 0) return;
    pointerDown(e.clientX);
  });
  window.addEventListener("mousemove", (e) => pointerMove(e.clientX));
  window.addEventListener("mouseup", pointerUp);

  // touch
  track.addEventListener("touchstart", (e) => {
    if (!e.touches[0]) return;
    pointerDown(e.touches[0].clientX);
  });
  track.addEventListener("touchmove", (e) => {
    if (!e.touches[0]) return;
    pointerMove(e.touches[0].clientX);
  });
  track.addEventListener("touchend", pointerUp);
  track.addEventListener("touchcancel", pointerUp);

  // init
  updateCarousel();
  startAuto();
});
// ===============================
// PORTFOLIO GALLERY WIRING
// ===============================
document.addEventListener("DOMContentLoaded", function () {
  const galleries = document.querySelectorAll("[data-gallery]");
  if (!galleries.length) return;

  galleries.forEach((gallery) => {
    const mainImage = gallery.querySelector("[data-main-image]");
    const thumbsContainer = gallery.querySelector("[data-thumbs]");
    const thumbs = thumbsContainer ? Array.from(thumbsContainer.querySelectorAll("img")) : [];
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
      mainImage.src = fullSrc;
      mainImage.alt = thumbs[currentIndex].alt || "Project image";
    }

    // Thumbnail click
    thumbs.forEach((thumb, index) => {
      thumb.addEventListener("click", () => setActive(index));
    });

    // Arrows
    if (prevBtn) {
      prevBtn.addEventListener("click", () => setActive(currentIndex - 1));
    }
    if (nextBtn) {
      nextBtn.addEventListener("click", () => setActive(currentIndex + 1));
    }

    // Init
    setActive(0);
  });
});

  document.addEventListener("DOMContentLoaded", () => {
    const video = document.querySelector(".ts-hero-video");
    if (!video) return;

    const pauseBeforeEnd = 1; // seconds before end

    const stopNearEnd = () => {
      if (video.duration && video.currentTime >= video.duration - pauseBeforeEnd) {
        video.pause();
        video.removeEventListener("timeupdate", stopNearEnd);
      }
    };

    video.addEventListener("timeupdate", stopNearEnd);
  });

// ============================
// Mobile Nav Toggle
// ============================
(function () {
  const toggle = document.getElementById("mobileToggle");
  const menu = document.getElementById("mobileMenu");

  if (!toggle || !menu) return;

  toggle.addEventListener("click", () => {
    menu.classList.toggle("hidden");
  });

  // Close menu when a link is clicked
  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menu.classList.add("hidden");
    });
  });
})();

// ============================
// Header Scroll State
// ============================
(function () {
  const header = document.getElementById("siteHeader");
  if (!header) return;

  const onScroll = () => {
    if (window.scrollY > 30) {
      header.classList.add("ts-header--scrolled");
    } else {
      header.classList.remove("ts-header--scrolled");
    }
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();

// ============================
// Stat Counters (IntersectionObserver)
// ============================
(function () {
  const statEls = Array.from(document.querySelectorAll(".ts-stat-num"));
  if (!statEls.length) return;

  let hasRun = false;

  const animateStats = () => {
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

      const step = (now) => {
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
      };

      requestAnimationFrame(step);
    });
  };

  // Use IntersectionObserver to trigger when stats are visible
  const statsSection = document.getElementById("stats") || document.querySelector(".ts-stats");
  if (!statsSection) {
    // Fallback: if we can't find a section, just run
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
      {
        threshold: 0.25,
      }
    );

    observer.observe(statsSection);
  } else {
    // Old browsers: just animate on load
    animateStats();
  }
})();

// ============================
// Portfolio Gallery Slider
// ============================
(function () {
  const gallery = document.querySelector("[data-gallery]");
  if (!gallery) return;

  const mainImg = gallery.querySelector("[data-main-image]");
  const thumbsContainer = gallery.querySelector("[data-thumbs]");
  const prevBtn = gallery.querySelector("[data-prev]");
  const nextBtn = gallery.querySelector("[data-next]");

  if (!mainImg || !thumbsContainer) return;

  const thumbs = Array.from(thumbsContainer.querySelectorAll("img"));
  if (!thumbs.length) return;

  let currentIndex = thumbs.findIndex((img) =>
    img.classList.contains("active")
  );
  if (currentIndex === -1) currentIndex = 0;

  const setImage = (index) => {
    if (index < 0 || index >= thumbs.length) return;

    const newThumb = thumbs[index];
    const fullSrc = newThumb.getAttribute("data-full") || newThumb.src;

    // Swap main image with a tiny fade
    mainImg.style.opacity = "0";
    setTimeout(() => {
      mainImg.src = fullSrc;
      mainImg.style.opacity = "1";
    }, 120);

    thumbs.forEach((t) => t.classList.remove("active"));
    newThumb.classList.add("active");
    currentIndex = index;
  };

  // Thumbs click
  thumbs.forEach((thumb, index) => {
    thumb.addEventListener("click", () => setImage(index));
  });

  // Arrows
  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      const nextIndex =
        (currentIndex - 1 + thumbs.length) % thumbs.length;
      setImage(nextIndex);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      const nextIndex = (currentIndex + 1) % thumbs.length;
      setImage(nextIndex);
    });
  }
})();

// ============================
// Optional: simple fade-up helper
// (Only used if you add .ts-fade-up in HTML)
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

    // Year in footer
    document.getElementById("year").textContent = new Date().getFullYear();

    // Simple 3D carousel logic (pairs with .ts-carousel-* CSS)
    (function () {
      const track = document.querySelector("[data-carousel-track]");
      if (!track) return;

      const slides = Array.from(track.querySelectorAll(".ts-carousel-item"));
      const prevBtn = document.querySelector("[data-carousel-prev]");
      const nextBtn = document.querySelector("[data-carousel-next]");
      const dotsWrap = document.querySelector("[data-carousel-dots]");
      const dots = dotsWrap ? Array.from(dotsWrap.querySelectorAll(".ts-dot")) : [];

      let current = 0;
      const last = slides.length - 1;

      function getLeftIndex(i) {
        return i === 0 ? last : i - 1;
      }

      function getRightIndex(i) {
        return i === last ? 0 : i + 1;
      }

      function updateSlides(index) {
        current = index;

        slides.forEach((slide, i) => {
          slide.classList.remove("is-active", "is-left", "is-right", "is-far");
          if (i === current) {
            slide.classList.add("is-active");
          } else if (i === getLeftIndex(current)) {
            slide.classList.add("is-left");
          } else if (i === getRightIndex(current)) {
            slide.classList.add("is-right");
          } else {
            slide.classList.add("is-far");
          }
        });

        if (dots.length) {
          dots.forEach((dot, i) => {
            dot.classList.toggle("is-active", i === current);
          });
        }
      }

      function goNext() {
        const next = current === last ? 0 : current + 1;
        updateSlides(next);
      }

      function goPrev() {
        const prev = current === 0 ? last : current - 1;
        updateSlides(prev);
      }

      if (nextBtn) nextBtn.addEventListener("click", goNext);
      if (prevBtn) prevBtn.addEventListener("click", goPrev);

      if (dots.length) {
        dots.forEach((dot, i) => {
          dot.addEventListener("click", () => updateSlides(i));
        });
      }

      // Optional: auto-rotate
      let auto = setInterval(goNext, 9000);

      [track, prevBtn, nextBtn, ...(dots || [])].forEach(el => {
        if (!el) return;
        el.addEventListener("mouseenter", () => clearInterval(auto));
        el.addEventListener("mouseleave", () => {
          auto = setInterval(goNext, 9000);
        });
      });

      updateSlides(0);
    })();
