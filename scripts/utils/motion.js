const query = window.matchMedia("(prefers-reduced-motion: reduce)");

export const prefersReducedMotion = () => query.matches;

export const onMotionChange = (callback) => {
  query.addEventListener("change", () => callback(query.matches));
};

