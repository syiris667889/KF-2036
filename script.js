const stopSelect = document.getElementById("stop");
const payBtn = document.getElementById("payBtn");
const distanceEl = document.getElementById("distance");
const priceEl = document.getElementById("price");
const sms = document.getElementById("sms");
const mapCard = document.getElementById("mapCard");
const paySound = document.getElementById("paySound");
const stopImage = document.getElementById("stopImage");

let map, busMarker, routeLine, moveInterval, timerInterval;

/* === STOPS === */
const stops = {
  School: {
    name: "Школа Каларашовка",
    distance: 0,
    coords: [48.2450, 27.1950],
    img: "https://images.unsplash.com/photo-1580582932707-520aed937b7b"
  },
  Bridge: {
    name: "Турецкий мост",
    distance: 1.8,
    coords: [48.2472, 27.2054],
    img: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee"
  },
  Oak: {
    name: "Дуб",
    distance: 1.2,
    coords: [48.2491, 27.2148],
    img: "https://images.unsplash.com/photo-1501785888041-af3ef285b470"
  },
  Hospital: {
    name: "Больница",
    distance: 0.9,
    coords: [48.2520, 27.2251],
    img: "https://images.unsplash.com/photo-1576765607924-bc1a3e1b5a88"
  },
  Church: {
    name: "Церковь Каларашовки",
    distance: 1.5,
    coords: [48.2553, 27.2356],
    img: "https://upload.wikimedia.org/wikipedia/commons/6/64/Calara%C8%99ovca_church.jpg"
  },
  Final: {
    name: "Конечная",
    distance: 2.3,
    coords: [48.2584, 27.2459],
    img: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d"
  }
};

/* === SELECT === */
stopSelect.addEventListener("change", () => {
  const stop = stops[stopSelect.value];
  if (!stop) return;

  stopImage.src = stop.img;
  stopImage.classList.remove("hidden");

  if (stop.distance === 0) {
    distanceEl.innerText = "Вы уже на месте 🟢";
    priceEl.innerText = "Оплата не требуется";
    return;
  }

  distanceEl.innerText = `Расстояние: ${stop.distance} км`;
  priceEl.innerText = `Цена: ${Math.max(2, Math.round(stop.distance * 2))} леев`;
});

/* === PAY === */
payBtn.addEventListener("click", () => {
  const stop = stops[stopSelect.value];
  if (!stop || stop.distance === 0) return;

  paySound.play();
  if (navigator.vibrate) navigator.vibrate(120);

  const time = Math.max(60, Math.round(stop.distance * 90)); // таймер от расстояния
  showSMS(time);
  showMap(stop.coords, time);
});

/* === SMS === */
function showSMS(seconds) {
  sms.classList.remove("hidden");
  sms.innerHTML = `
    📲 Остановка №5<br>
    Оплата прошла успешно<br>
    ⏱ Прибытие через <b id="time"></b>
  `;
  startTimer(seconds);
}

/* === TIMER === */
function startTimer(sec) {
  const t = document.getElementById("time");
  clearInterval(timerInterval);

  timerInterval = setInterval(() => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    t.innerText = `${m}:${s < 10 ? "0" : ""}${s}`;
    if (--sec < 0) clearInterval(timerInterval);
  }, 1000);
}

/* === MAP === */
function showMap(target, time) {
  mapCard.classList.remove("hidden");

  if (!map) {
    map = L.map("map").setView(stops.School.coords, 15);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);
  }

  if (busMarker) map.removeLayer(busMarker);
  if (routeLine) map.removeLayer(routeLine);
  clearInterval(moveInterval);

  const route = [stops.School.coords, target];

  routeLine = L.polyline(route, { color: "#2a5298" }).addTo(map);

  busMarker = L.marker(route[0], {
    icon: L.icon({
      iconUrl: "https://cdn-icons-png.flaticon.com/512/61/61231.png",
      iconSize: [36, 36]
    })
  }).addTo(map);

  let step = 0;
  const steps = time;

  moveInterval = setInterval(() => {
    step++;
    const lat =
      route[0][0] + (route[1][0] - route[0][0]) * (step / steps);
    const lng =
      route[0][1] + (route[1][1] - route[0][1]) * (step / steps);

    busMarker.setLatLng([lat, lng]);
    if (step >= steps) clearInterval(moveInterval);
  }, 1000);
}
