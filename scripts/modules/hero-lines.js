const SVG_NS = "http://www.w3.org/2000/svg";
const PATH_D =
  "M579.511 1136.88L1171.84 544.229M940.198 408.128L570.118 37.8474C535.554 3.26432 480.827 1.9628 447.842 34.9655L25.1714 457.957C-7.81346 490.96 -6.51265 545.716 28.0517 580.299L584.334 1136.88M1310.47 682.933L1677.86 1050.52C1712.42 1085.1 1767.15 1086.4 1800.14 1053.4L2222.9 630.408C2255.88 597.405 2254.58 542.649 2220.02 508.066L1714 1.77686L1171.94 544.136";
const MARK = { w: 2249, h: 1138 };
const DELAY_COL = 0.35;
const DELAY_ROW = 0.2;

const el = (name, attrs = {}) => {
  const node = document.createElementNS(SVG_NS, name);
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  return node;
};

const build = (svg, width, height) => {
  const tileW = width < 768 ? 90 : 140;
  const tileH = (tileW * MARK.h) / MARK.w;
  const pitchX = tileW * 1.3;
  const pitchY = tileH * 1.7;
  const scale = tileW / MARK.w;

  svg.replaceChildren();
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);

  const defs = el("defs");
  defs.appendChild(el("path", { id: "cp-line", d: PATH_D, "vector-effect": "non-scaling-stroke" }));
  svg.appendChild(defs);

  const frag = document.createDocumentFragment();
  const cols = Math.ceil(width / pitchX) + 1;
  const rows = Math.ceil(height / pitchY) + 1;
  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const x = col * pitchX + (row % 2 ? pitchX / 2 : 0);
      const y = row * pitchY;
      const outer = el("g", { transform: `translate(${x.toFixed(1)} ${y.toFixed(1)})` });
      const tile = el("g", { class: "hl-tile" });
      tile.style.animationDelay = `${(-(col * DELAY_COL + row * DELAY_ROW)).toFixed(2)}s`;
      tile.appendChild(el("use", { href: "#cp-line", transform: `scale(${scale})` }));
      outer.appendChild(tile);
      frag.appendChild(outer);
    }
  }
  svg.appendChild(frag);
};

export const initHeroLines = () => {
  const hero = document.querySelector(".hero");
  const svg = document.querySelector(".hero-lines");
  if (!hero || !svg) return;

  let size = { w: 0, h: 0 };
  const rebuild = () => {
    const w = Math.round(hero.clientWidth);
    const h = Math.round(hero.clientHeight);
    if (!w || !h || (w === size.w && h === size.h)) return;
    size = { w, h };
    build(svg, w, h);
  };
  rebuild();

  let timer;
  window.addEventListener("resize", () => {
    clearTimeout(timer);
    timer = setTimeout(rebuild, 150);
  });

  if ("IntersectionObserver" in window) {
    new IntersectionObserver((entries) => {
      svg.classList.toggle("is-paused", !entries[0].isIntersecting);
    }).observe(hero);
  }
};
