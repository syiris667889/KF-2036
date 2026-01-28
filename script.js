const stopSelect = document.getElementById("stop");
const payBtn = document.getElementById("payBtn");
const img = document.getElementById("stopImage");
const distanceEl = document.getElementById("distance");
const priceEl = document.getElementById("price");
const sms = document.getElementById("sms");
const arrival = document.getElementById("arrivalScreen");
const mapCard = document.getElementById("mapCard");
const sound = document.getElementById("arrivalSound");

const stops = {
  School: {
    name: "Школа",
    distance: 0,
    img: "https://images.unsplash.com/photo-1580582932707-520aed937b7b"
  },
  Bridge: {
    name: "Турецкий мост",
    distance: 1.8,
    img: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee"
  },
  Oak: {
    name: "Дуб",
    distance: 1.2,
    img: "https://images.unsplash.com/photo-1501785888041-af3ef285b470"
  },
  Hospital: {
    name: "Больница",
    distance: 0.9,
    img: "https://images.unsplash.com/photo-1576765607924-bc1a3e1b5a88"
  },
  Church: {
    name: "Церковь",
    distance: 1.5,
    img: "https://upload.wikimedia.org/wikipedia/commons/6/64/Calara%C8%99ovca_church.jpg"
  },
  Final: {
    name: "Конечная",
    distance: 2.3,
    img: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d"
  }
};

stopSelect.addEventListener("change", () => {
  const stop = stops[stopSelect.value];
  if (!stop) return;

  const price = Math.max(2, Math.round(stop.distance * 2));

  distanceEl.innerText = `Расстояние: ${stop.distance} км`;
  priceEl.innerText = `Цена: ${price} леев`;

  img.src = stop.img;
  img.classList.remove("hidden");
});

payBtn.addEventListener("click", () => {
  if (!stopSelect.value) return;

  arrival.classList.add("hidden");
  mapCard.classList.remove("hidden");

  const bus = Math.floor(Math.random() * 20) + 1;

  sms.innerHTML = `
    ✅ Оплата прошла успешно<br>
    🚌 Автобус №${bus}<br>
    ⏱ Прибытие через 1:30
  `;
  sms.classList.remove("hidden");

  if (navigator.vibrate) navigator.vibrate([200,100,200]);

  startTimer(90);
});

function startTimer(seconds) {
  let sec = seconds;

  const timer = setInterval(() => {
    sec--;

    if (sec <= 0) {
      clearInterval(timer);

      sound.currentTime = 0;
      sound.play();

      if (navigator.vibrate) navigator.vibrate([300,150,300,150,500]);

      arrival.classList.remove("hidden");
    }
  }, 1000);
}
