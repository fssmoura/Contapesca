import { prefersReducedMotion } from "../utils/motion.js";

export const initReveal = () => {
  const items = document.querySelectorAll(".reveal");
  if (!items.length || prefersReducedMotion() || !("IntersectionObserver" in window)) return;

  document.documentElement.classList.add("js");
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      });
    },
    { threshold: 0.12 }
  );
  items.forEach((el) => io.observe(el));
};
