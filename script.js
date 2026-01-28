const stopSelect = document.getElementById("stop");
const payBtn = document.getElementById("payBtn");
const distanceEl = document.getElementById("distance");
const priceEl = document.getElementById("price");
const sms = document.getElementById("sms");
const mapCard = document.getElementById("mapCard");
const paySound = document.getElementById("paySound");

let map, busMarker, route, routeIndex = 0;

/* координаты (примерно, для анимации) */
const stops = {
  School: { name: "Школа", d: 0, coords: [48.245, 27.195] },
  Bridge: { name: "Турецкий мост", d: 1.8, coords: [48.247, 27.205] },
  Oak: { name: "Дуб", d: 1.2, coords: [48.249, 27.215] },
  Hospital: { name: "Больница", d: 0.9, coords: [48.252, 27.225] },
  Church: { name: "Церковь", d: 1.5, coords: [48.255, 27.235] },
  Final: { name: "Конечная", d: 2.3, coords: [48.258, 27.245] }
};

stopSelect.addEventListener("change", () => {
  const stop = stops[stopSelect.value];
  if (!stop) return;

  const price = Math.max(2, Math.round(stop.d * 2));
  distanceEl.innerText = `Расстояние: ${stop.d} км`;
  priceEl.innerText = `Цена: ${price} леев`;
});

payBtn.addEventListener("click", () => {
  if (!stopSelect.value) return;

  // звук оплаты (iPhone дзинь)
  paySound.currentTime = 0;
  paySound.play();

  // вибрация
  if (navigator.vibrate) navigator.vibrate(120);

  // Push-уведомление
  sendPush();

  sms.innerHTML = `
    ✅ Оплата успешна<br>
    🚌 Маршрут построен
  `;
  sms.classList.remove("hidden");

  showMap();
});

/* PUSH */
function sendPush() {
  if (!("Notification" in window)) return;

  Notification.requestPermission().then(p => {
    if (p === "granted") {
      new Notification("Остановка №5", {
        body: "Оплата прошла успешно. Автобус выехал 🚍",
        icon: "https://cdn-icons-png.flaticon.com/512/61/61231.png"
      });
    }
  });
}

/* КАРТА + АНИМАЦИЯ */
function showMap() {
  mapCard.classList.remove("hidden");

  if (!map) {
    map = L.map("map").setView(stops.School.coords, 14);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap"
    }).addTo(map);
  }

  route = Object.values(stops).map(s => s.coords);
  routeIndex = 0;

  if (busMarker) map.removeLayer(busMarker);

  busMarker = L.marker(route[0], {
    icon: L.icon({
      iconUrl: "https://cdn-icons-png.flaticon.com/512/61/61231.png",
      iconSize: [40, 40]
    })
  }).addTo(map);

  animateBus();
}

/* движение автобуса */
function animateBus() {
  const interval = setInterval(() => {
    routeIndex++;
    if (routeIndex >= route.length) {
      clearInterval(interval);
      return;
    }
    busMarker.setLatLng(route[routeIndex]);
    map.panTo(route[routeIndex], { animate: true, duration: 1 });
  }, 1500);
}
