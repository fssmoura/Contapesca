import { prefersReducedMotion, onMotionChange } from "../utils/motion.js";

export const initQuotes = () => {
  const root = document.querySelector(".card-quote");
  if (!root) return;
  const items = Array.from(root.querySelectorAll(".quote-item"));
  const progress = root.querySelector(".quote-progress");
  const counter = root.querySelector("[data-quote-current]");
  const total = root.querySelector("[data-quote-total]");
  const prev = root.querySelector("[data-prev]");
  const next = root.querySelector("[data-next]");
  if (items.length < 2) return;

  let current = 0;
  if (total) total.textContent = String(items.length);

  const restartFill = () => {
    root.classList.remove("is-auto");
    if (prefersReducedMotion()) return;
    void root.offsetWidth;
    root.classList.add("is-auto");
  };

  const show = (index) => {
    current = (index + items.length) % items.length;
    items.forEach((item, i) => item.classList.toggle("is-active", i === current));
    if (counter) counter.textContent = String(current + 1);
    restartFill();
  };

  if (progress) {
    progress.addEventListener("animationend", (e) => {
      if (e.animationName === "quote-fill") show(current + 1);
    });
  }
  if (prev) prev.addEventListener("click", () => show(current - 1));
  if (next) next.addEventListener("click", () => show(current + 1));

  const setPaused = (paused) => root.classList.toggle("is-paused", paused);
  root.addEventListener("mouseenter", () => setPaused(true));
  root.addEventListener("mouseleave", () => setPaused(false));
  root.addEventListener("focusin", () => setPaused(true));
  root.addEventListener("focusout", () => setPaused(false));

  onMotionChange(restartFill);
  restartFill();
};
