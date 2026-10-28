import { initI18n } from "./i18n/index.js";
import { initMenu } from "./modules/menu.js";
import { initCarousel } from "./modules/carousel.js";
import { initQuotes } from "./modules/quotes.js";
import { initTabs } from "./modules/tabs.js";
import { initReveal } from "./modules/reveal.js";
import { initMap } from "./modules/map.js";
import { initHeroLines } from "./modules/hero-lines.js";
import { initYear } from "./modules/year.js";

initMenu();
initHeroLines();
initCarousel();
initQuotes();
initTabs();
initReveal();
initMap();
initYear();
initI18n();
