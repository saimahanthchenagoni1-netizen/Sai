const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const intro = document.getElementById("introSlice");
const cursor = document.getElementById("cursor");
const spotlight = document.getElementById("spotlight");
const terminalText = document.getElementById("terminalText");

const terminalLines = [
  "> sai.profile.boot()",
  "> student / athlete / ai explorer",
  "> focus: badminton, basketball, chess",
  "> tools: math + ai + creative systems",
  "> future mode: building",
];

function setupIntro() {
  if (!intro) return;

  window.setTimeout(
    () => {
      intro.remove();
    },
    1700
  );
}

function setupReveals() {
  const elements = document.querySelectorAll(".reveal");

  elements.forEach((element) => element.classList.add("is-visible"));

  if (!("IntersectionObserver" in window)) {
    elements.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
  );

  elements.forEach((element) => {
    if (!element.closest(".hero")) observer.observe(element);
  });
}

function setupCursor() {
  if (!cursor || !spotlight || window.matchMedia("(pointer: coarse)").matches) return;

  let nextX = window.innerWidth / 2;
  let nextY = window.innerHeight / 2;
  let rafId = 0;

  const paint = () => {
    cursor.style.left = `${nextX}px`;
    cursor.style.top = `${nextY}px`;
    spotlight.style.setProperty("--mx", `${nextX}px`);
    spotlight.style.setProperty("--my", `${nextY}px`);
    rafId = 0;
  };

  window.addEventListener(
    "pointermove",
    (event) => {
      nextX = event.clientX;
      nextY = event.clientY;
      if (!rafId) rafId = window.requestAnimationFrame(paint);
    },
    { passive: true }
  );

  document.querySelectorAll("a, button, .card").forEach((element) => {
    element.addEventListener("pointerenter", () => cursor.classList.add("is-hot"));
    element.addEventListener("pointerleave", () => cursor.classList.remove("is-hot"));
  });
}

function setupParallax() {
  const items = document.querySelectorAll("[data-depth]");
  if (!items.length || prefersReducedMotion) return;

  let rafId = 0;

  const update = () => {
    const viewportMiddle = window.innerHeight / 2;

    items.forEach((item) => {
      const depth = Number(item.getAttribute("data-depth") || 0);
      const rect = item.getBoundingClientRect();
      const offset = (rect.top - viewportMiddle) * depth;
      item.style.transform = `translate3d(0, ${offset}px, 0)`;
    });

    rafId = 0;
  };

  window.addEventListener(
    "scroll",
    () => {
      if (!rafId) rafId = window.requestAnimationFrame(update);
    },
    { passive: true }
  );

  update();
}

function setupSceneProgress() {
  const scenes = document.querySelectorAll(".scene");
  if (!scenes.length || prefersReducedMotion) return;

  let rafId = 0;

  const update = () => {
    const viewportHeight = window.innerHeight || 1;

    scenes.forEach((scene) => {
      const rect = scene.getBoundingClientRect();
      const raw = (viewportHeight - rect.top) / (viewportHeight + rect.height);
      const progress = Math.min(1, Math.max(0, raw));
      scene.style.setProperty("--scroll-progress", progress.toFixed(3));
      scene.style.setProperty("--scroll-shift", `${Math.round(progress * 80)}px`);
    });

    rafId = 0;
  };

  window.addEventListener(
    "scroll",
    () => {
      if (!rafId) rafId = window.requestAnimationFrame(update);
    },
    { passive: true }
  );

  window.addEventListener("resize", update, { passive: true });
  update();
}

function setupTerminal() {
  if (!terminalText) return;

  if (prefersReducedMotion) {
    terminalText.textContent = terminalLines.join("\n");
    return;
  }

  let lineIndex = 0;
  let charIndex = 0;
  let output = "";

  const typeNext = () => {
    if (lineIndex >= terminalLines.length) {
      terminalText.textContent = output;
      return;
    }

    const line = terminalLines[lineIndex];
    output += line.charAt(charIndex);
    terminalText.textContent = `${output}_`;
    charIndex += 1;

    if (charIndex > line.length) {
      output += "\n";
      lineIndex += 1;
      charIndex = 0;
      window.setTimeout(typeNext, 260);
      return;
    }

    window.setTimeout(typeNext, 24);
  };

  typeNext();
}

setupIntro();
setupReveals();
setupCursor();
setupParallax();
setupSceneProgress();
setupTerminal();
