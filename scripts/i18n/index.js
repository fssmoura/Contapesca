const KEY = "cp-lang";
const SUPPORTED = ["pt", "en"];
const EMAIL = "contapesca.unipessoal@gmail.com";

let dictionaries = {};

const readStored = () => {
  try {
    return localStorage.getItem(KEY);
  } catch (e) {
    return null;
  }
};

const writeStored = (lang) => {
  try {
    localStorage.setItem(KEY, lang);
  } catch (e) {
    /* storage unavailable */
  }
};

export const setLang = (lang, persist = true) => {
  const dict = dictionaries[lang];
  if (!dict) return;

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const value = dict[el.dataset.i18n];
    if (value !== undefined) el.textContent = value;
  });
  document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
    const value = dict[el.dataset.i18nAria];
    if (value !== undefined) el.setAttribute("aria-label", value);
  });
  document.querySelectorAll("[data-i18n-alt]").forEach((el) => {
    const value = dict[el.dataset.i18nAlt];
    if (value !== undefined) el.setAttribute("alt", value);
  });

  document.documentElement.lang = lang;
  const root = document.documentElement.dataset;
  const titleKey = root.titleKey || "meta.title";
  const descKey = root.descKey || "meta.desc";
  document.title = dict[titleKey];
  const desc = document.querySelector('meta[name="description"]');
  if (desc) desc.setAttribute("content", dict[descKey]);
  document.querySelectorAll('meta[property="og:title"]').forEach((m) => m.setAttribute("content", dict[titleKey]));
  document.querySelectorAll('meta[property="og:description"]').forEach((m) => m.setAttribute("content", dict[descKey]));

  const href = `mailto:${EMAIL}?subject=${encodeURIComponent(dict["contact.subject"])}`;
  document.querySelectorAll("[data-mailto]").forEach((a) => a.setAttribute("href", href));

  document.querySelectorAll(".lang button").forEach((btn) => {
    btn.setAttribute("aria-pressed", String(btn.dataset.lang === lang));
  });

  if (persist) writeStored(lang);
  document.dispatchEvent(new CustomEvent("lang-change", { detail: { lang } }));
};

export const initI18n = async () => {
  const legal = Boolean(document.querySelector("[data-legal]"));
  const [pt, en, legalPt, legalEn] = await Promise.all([
    import("./pt.js"),
    import("./en.js"),
    legal ? import("./legal-pt.js") : null,
    legal ? import("./legal-en.js") : null,
  ]);
  dictionaries = {
    pt: { ...pt.default, ...legalPt?.default },
    en: { ...en.default, ...legalEn?.default },
  };

  const fromUrl = new URLSearchParams(window.location.search).get("lang");
  const lang = [fromUrl, readStored()].find((l) => SUPPORTED.includes(l)) || "pt";
  if (lang !== "pt") setLang(lang, false);
  if (SUPPORTED.includes(fromUrl)) writeStored(fromUrl);

  document.querySelectorAll(".lang button").forEach((btn) => {
    btn.addEventListener("click", () => setLang(btn.dataset.lang));
  });
};
