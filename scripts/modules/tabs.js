import { prefersReducedMotion, onMotionChange } from "../utils/motion.js";

export const initTabs = () => {
  const tabs = Array.from(document.querySelectorAll(".svc-tab"));
  const panels = Array.from(document.querySelectorAll(".svc-panel"));
  const list = document.querySelector(".svc-list");
  const wrap = document.querySelector(".services");
  if (!tabs.length || !list || !wrap) return;

  const mobile = window.matchMedia("(max-width: 767px)");
  let current = 0;
  list.dataset.label = list.getAttribute("aria-label");

  const restart = () => {
    list.classList.remove("is-auto");
    if (prefersReducedMotion() || mobile.matches) return;
    void list.offsetWidth;
    list.classList.add("is-auto");
  };

  const render = () => {
    const accordion = mobile.matches;
    if (accordion) {
      list.removeAttribute("role");
      list.removeAttribute("aria-label");
    } else {
      list.setAttribute("role", "tablist");
      list.setAttribute("aria-label", list.dataset.label);
    }
    tabs.forEach((tab, i) => {
      const on = i === current;
      if (accordion) {
        tab.removeAttribute("role");
        tab.removeAttribute("aria-selected");
        tab.setAttribute("aria-expanded", String(on));
        tab.tabIndex = 0;
        panels[i].setAttribute("role", "region");
      } else {
        tab.setAttribute("role", "tab");
        tab.removeAttribute("aria-expanded");
        tab.setAttribute("aria-selected", String(on));
        tab.tabIndex = on ? 0 : -1;
        panels[i].setAttribute("role", "tabpanel");
      }
      panels[i].hidden = !on;
    });
  };

  const select = (index, focus) => {
    current = mobile.matches && index === current ? -1 : index;
    render();
    if (focus) tabs[index].focus();
    restart();
  };

  tabs.forEach((tab, i) => {
    tab.addEventListener("click", () => select(i));
    tab.addEventListener("keydown", (e) => {
      if (mobile.matches) return;
      const step = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
      if (e.key === "Home") {
        e.preventDefault();
        select(0, true);
      } else if (e.key === "End") {
        e.preventDefault();
        select(tabs.length - 1, true);
      } else if (step) {
        e.preventDefault();
        select((i + step + tabs.length) % tabs.length, true);
      }
    });
    tab.addEventListener("animationend", (e) => {
      if (e.animationName === "svc-fill" && i === current && !mobile.matches) select((current + 1) % tabs.length);
    });
  });

  const setPaused = (paused) => wrap.classList.toggle("is-paused", paused);
  wrap.addEventListener("mouseenter", () => setPaused(true));
  wrap.addEventListener("mouseleave", () => setPaused(false));
  wrap.addEventListener("focusin", () => setPaused(true));
  wrap.addEventListener("focusout", () => setPaused(false));
  mobile.addEventListener("change", () => {
    if (current < 0) current = 0;
    render();
    restart();
  });
  onMotionChange(restart);
  render();
};
