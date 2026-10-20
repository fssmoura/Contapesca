const POSITION = [41.141568, -8.649931];

export const initMap = () => {
  const el = document.getElementById("map");
  if (!el || !window.L) return;
  const L = window.L;

  const map = L.map(el, { scrollWheelZoom: false, center: POSITION, zoom: 17 });
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  const icon = L.divIcon({
    className: "map-pin",
    html: '<img src="assets/favicon.png" alt="" width="22" height="22" />',
    iconSize: [44, 44],
    iconAnchor: [22, 22],
  });
  L.marker(POSITION, { icon, title: "ContaPesca", alt: "ContaPesca" }).addTo(map).bindPopup("ContaPesca");
};
