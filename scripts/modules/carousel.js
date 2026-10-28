import { prefersReducedMotion, onMotionChange } from "../utils/motion.js";

export const initCarousel = () => {
  const root = document.querySelector(".carousel");
  if (!root) return;
  const slides = Array.from(root.querySelectorAll(".slide"));
  const segs = Array.from(root.querySelectorAll(".seg"));
  const caps = Array.from(root.querySelectorAll(".cap"));
  const prev = root.querySelector("[data-prev]");
  const next = root.querySelector("[data-next]");
  if (slides.length < 2) return;

  let current = 0;

  const restartFill = () => {
    root.classList.remove("is-auto");
    if (prefersReducedMotion()) return;
    void root.offsetWidth;
    root.classList.add("is-auto");
  };

  const show = (index) => {
    current = (index + slides.length) % slides.length;
    slides.forEach((s, i) => s.classList.toggle("is-active", i === current));
    segs.forEach((s, i) => {
      s.classList.toggle("is-active", i === current);
      if (i === current) s.setAttribute("aria-current", "true");
      else s.removeAttribute("aria-current");
    });
    caps.forEach((c, i) => {
      c.hidden = i !== current;
    });
    restartFill();
  };

  segs.forEach((seg, i) => {
    seg.addEventListener("click", () => show(i));
    seg.addEventListener("animationend", (e) => {
      if (e.animationName === "seg-fill" && i === current) show(current + 1);
    });
  });
  if (prev) prev.addEventListener("click", () => show(current - 1));
  if (next) next.addEventListener("click", () => show(current + 1));

  const setPaused = (paused) => root.classList.toggle("is-paused", paused);
  root.addEventListener("mouseenter", () => setPaused(true));
  root.addEventListener("mouseleave", () => setPaused(false));
  root.addEventListener("focusin", () => setPaused(true));
  root.addEventListener("focusout", () => setPaused(false));

  root.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") show(current - 1);
    else if (e.key === "ArrowRight") show(current + 1);
  });

  let startX = null;
  root.addEventListener("pointerdown", (e) => {
    startX = e.clientX;
  });
  root.addEventListener("pointerup", (e) => {
    if (startX === null) return;
    const dx = e.clientX - startX;
    startX = null;
    root.dataset.swiped = Math.abs(dx) > 40 ? "1" : "";
    if (Math.abs(dx) > 40) show(current + (dx < 0 ? 1 : -1));
  });
  root.addEventListener("pointercancel", () => {
    startX = null;
  });

  onMotionChange(restartFill);
  show(0);
};
