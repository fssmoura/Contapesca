const POSITION = [41.141640, -8.649732];

export const initMap = () => {
  const el = document.getElementById("map");
  if (!el || !window.L) return;
  const L = window.L;

  const map = L.map(el, { scrollWheelZoom: false, center: POSITION, zoom: 17 });
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  if ("ResizeObserver" in window) {
    let moved = false;
    let resetting = false;
    map.on("movestart", () => {
      if (!resetting) moved = true;
    });
    new ResizeObserver(() => {
      map.invalidateSize({ pan: false });
      if (moved) return;
      resetting = true;
      map.setView(POSITION, 17, { animate: false });
      resetting = false;
    }).observe(el);
  }

  const icon = L.divIcon({
    className: "map-pin",
    html: '<img src="assets/favicon.png" alt="" width="22" height="22" />',
    iconSize: [44, 44],
    iconAnchor: [22, 22],
  });
  L.marker(POSITION, { icon, title: "ContaPesca", alt: "ContaPesca" }).addTo(map).bindPopup("ContaPesca");
};
