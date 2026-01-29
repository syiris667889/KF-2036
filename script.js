const stopSelect = document.getElementById("stop");
const payBtn = document.getElementById("payBtn");
const distanceEl = document.getElementById("distance");
const priceEl = document.getElementById("price");
const sms = document.getElementById("sms");
const mapCard = document.getElementById("mapCard");
const paySound = document.getElementById("paySound");

let map, busMarker, routeLine, moveInterval, timerInterval;
let audioUnlocked = false;

/* === STOPS === */
const stops = {
  School: {
    name: "Школа Каларашовка",
    distance: 0,
    coords: [48.2450, 27.1950]
  },
  Bridge: {
    name: "Турецкий мост",
    distance: 1.8,
    coords: [48.2472, 27.2054]
  },
  Oak: {
    name: "Дуб",
    distance: 1.2,
    coords: [48.2491, 27.2148]
  },
  Hospital: {
    name: "Больница",
    distance: 0.9,
    coords: [48.2520, 27.2251]
  },
  Church: {
    name: "Церковь Каларашовки",
    distance: 1.5,
    coords: [48.2553, 27.2356]
  },
  Final: {
    name: "Конечная",
    distance: 2.3,
    coords: [48.2584, 27.2459]
  }
};

/* === AUDIO UNLOCK === */
document.addEventListener("click", () => {
  if (!audioUnlocked) {
    paySound.play().then(() => {
      paySound.pause();
      paySound.currentTime = 0;
      audioUnlocked = true;
    }).catch(()=>{});
  }
}, { once: true });

/* === SELECT STOP === */
stopSelect.addEventListener("change", () => {
  const stop = stops[stopSelect.value];
  if (!stop) return;

  if (stop.distance === 0) {
    distanceEl.innerText = "Вы уже на месте 🟢";
    priceEl.innerText = "Оплата не требуется";
    return;
  }

  distanceEl.innerText = `Расстояние: ${stop.distance} км`;
  priceEl.innerText = `Цена: ${Math.max(2, Math.round(stop.distance * 2))} леев`;
});

/* === PAY === */
payBtn.addEventListener("click", async () => {
  const stop = stops[stopSelect.value];
  if (!stop || stop.distance === 0) return;

  // 🔔 звук
  paySound.currentTime = 0;
  paySound.play();

  // 📳 вибрация
  if (navigator.vibrate) navigator.vibrate(120);

  // 📲 push
  await notifyUser();

  const time = Math.max(60, Math.round(stop.distance * 90));
  showSMS(time);
  showMap(stop.coords, time);
});

/* === PUSH === */
async function notifyUser() {
  if (!("Notification" in window)) return;

  if (Notification.permission === "default") {
    await Notification.requestPermission();
  }

  if (Notification.permission === "granted") {
    new Notification("🚏 Остановка №5", {
      body: "Оплата прошла успешно. Автобус выехал 🚍",
      icon: "https://cdn-icons-png.flaticon.com/512/61/61231.png"
    });
  }
}

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
    const lat = route[0][0] + (route[1][0] - route[0][0]) * (step / steps);
    const lng = route[0][1] + (route[1][1] - route[0][1]) * (step / steps);

    busMarker.setLatLng([lat, lng]);
    if (step >= steps) clearInterval(moveInterval);
  }, 1000);
}
