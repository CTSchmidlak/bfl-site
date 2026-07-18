const carousels = document.querySelectorAll("[data-carousel]");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

carousels.forEach((carouselRoot) => {
  const slides = Array.from(carouselRoot.querySelectorAll(".carousel-slide"));
  const previousButton = carouselRoot.querySelector("[data-carousel-prev]");
  const nextButton = carouselRoot.querySelector("[data-carousel-next]");
  const pauseButton = carouselRoot.querySelector("[data-carousel-pause]");
  const status = carouselRoot.querySelector(".carousel-status");
  const progressFill = carouselRoot.querySelector(".carousel-progress-fill");
  const dotsContainer = carouselRoot.querySelector(".carousel-dots");

  const delay = Number(carouselRoot.dataset.carouselDelay) || 8000;

  let activeIndex = slides.findIndex((slide) =>
    slide.classList.contains("is-active")
  );

  if (activeIndex < 0) {
    activeIndex = 0;
  }

  let userPaused = false;
  let hoverPaused = false;
  let focusPaused = false;
  let startTime = performance.now();
  let elapsed = 0;

  const dots = slides.map((_, index) => {
    const dot = document.createElement("button");

    dot.className = "carousel-dot";
    dot.type = "button";
    dot.setAttribute("aria-label", `Go to featured story ${index + 1}`);

    dot.addEventListener("click", () => {
      showSlide(index);
    });

    dotsContainer?.appendChild(dot);

    return dot;
  });

  function isPaused() {
    return userPaused || hoverPaused || focusPaused || reducedMotion.matches;
  }

  function updatePauseButton() {
    if (!pauseButton) {
      return;
    }

    pauseButton.textContent = userPaused ? "▶" : "⏸";
    pauseButton.setAttribute(
      "aria-label",
      userPaused ? "Play carousel" : "Pause carousel"
    );
    pauseButton.setAttribute("aria-pressed", String(userPaused));
  }

  function updateProgress(progress) {
    if (!progressFill) {
      return;
    }

    const remaining = Math.max(0, 1 - progress);
    progressFill.style.transform = `scaleX(${remaining})`;
  }

  function updateDots() {
    dots.forEach((dot, index) => {
      const isActive = index === activeIndex;

      dot.classList.toggle("is-active", isActive);
      dot.setAttribute("aria-current", isActive ? "true" : "false");
    });
  }

  function showSlide(index) {
    activeIndex = (index + slides.length) % slides.length;

    slides.forEach((slide, slideIndex) => {
      const isActive = slideIndex === activeIndex;

      slide.classList.toggle("is-active", isActive);
      slide.toggleAttribute("hidden", !isActive);
    });

    if (status) {
      status.textContent = `${activeIndex + 1} of ${slides.length}`;
    }

    updateDots();

    startTime = performance.now();
    elapsed = 0;
    updateProgress(0);
  }

  function tick(now) {
    if (isPaused()) {
      startTime = now - elapsed;
      requestAnimationFrame(tick);
      return;
    }

    elapsed = now - startTime;

    const progress = elapsed / delay;
    updateProgress(progress);

    if (progress >= 1) {
      showSlide(activeIndex + 1);
    }

    requestAnimationFrame(tick);
  }

  previousButton?.addEventListener("click", () => {
    showSlide(activeIndex - 1);
  });

  nextButton?.addEventListener("click", () => {
    showSlide(activeIndex + 1);
  });

  pauseButton?.addEventListener("click", () => {
    userPaused = !userPaused;
    updatePauseButton();
  });

  carouselRoot.addEventListener("pointerenter", () => {
    hoverPaused = true;
  });

  carouselRoot.addEventListener("pointerleave", () => {
    hoverPaused = false;
  });

  carouselRoot.addEventListener("focusin", () => {
    focusPaused = true;
  });

  carouselRoot.addEventListener("focusout", (event) => {
    if (!carouselRoot.contains(event.relatedTarget)) {
      focusPaused = false;
    }
  });

  reducedMotion.addEventListener("change", () => {
    updatePauseButton();
  });

  showSlide(activeIndex);
  updatePauseButton();
  requestAnimationFrame(tick);
});