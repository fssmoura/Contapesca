export const initLightbox = () => {
  const carousel = document.querySelector(".carousel");
  const dialog = document.querySelector(".lightbox");
  if (!carousel || !dialog || typeof dialog.showModal !== "function") return;
  const slides = Array.from(carousel.querySelectorAll(".slide"));
  const zoom = carousel.querySelector("[data-zoom]");
  const img = dialog.querySelector(".lightbox-img");
  const currentEl = dialog.querySelector("[data-lb-current]");
  const totalEl = dialog.querySelector("[data-lb-total]");
  if (!slides.length || !zoom || !img) return;

  let current = 0;
  if (totalEl) totalEl.textContent = String(slides.length);

  const show = (index) => {
    current = (index + slides.length) % slides.length;
    img.src = slides[current].currentSrc || slides[current].src;
    img.alt = slides[current].alt;
    if (currentEl) currentEl.textContent = String(current + 1);
  };

  zoom.addEventListener("click", () => {
    if (carousel.dataset.swiped) {
      carousel.dataset.swiped = "";
      return;
    }
    const active = slides.findIndex((s) => s.classList.contains("is-active"));
    show(Math.max(active, 0));
    dialog.showModal();
  });

  dialog.querySelector("[data-close]")?.addEventListener("click", () => dialog.close());
  dialog.querySelector("[data-prev]")?.addEventListener("click", () => show(current - 1));
  dialog.querySelector("[data-next]")?.addEventListener("click", () => show(current + 1));

  dialog.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") show(current - 1);
    else if (e.key === "ArrowRight") show(current + 1);
  });

  let startX = null;
  let dx = 0;
  dialog.addEventListener("pointerdown", (e) => {
    if (e.target.closest("button")) return;
    startX = e.clientX;
    dx = 0;
    img.classList.add("is-dragging");
  });
  dialog.addEventListener("pointermove", (e) => {
    if (startX === null) return;
    dx = e.clientX - startX;
    img.style.transform = `translateX(${dx}px)`;
  });
  const endDrag = (e) => {
    if (startX === null) return;
    startX = null;
    img.classList.remove("is-dragging");
    img.style.transform = "";
    if (Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1));
    else if (e.type === "pointerup" && e.target === dialog && Math.abs(dx) < 5) dialog.close();
  };
  dialog.addEventListener("pointerup", endDrag);
  dialog.addEventListener("pointercancel", endDrag);
};
