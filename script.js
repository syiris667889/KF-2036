let lang = "ru";

/* расстояния ОТ ШКОЛЫ (км) */
const stops = {
  School: {
    distance: 0,
    img: "https://images.unsplash.com/photo-1580582932707-520aed937b7b"
  },
  Bridge: {
    distance: 1.8,
    img: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee"
  },
  Oak: {
    distance: 1.2,
    img: "https://images.unsplash.com/photo-1501785888041-af3ef285b470"
  },
  Hospital: {
    distance: 0.9,
    img: "https://images.unsplash.com/photo-1576765607924-bc1a3e1b5a88"
  },
  Church: {
    distance: 1.5,
    img: "https://upload.wikimedia.org/wikipedia/commons/6/64/Calara%C8%99ovca_church.jpg"
  },
  Final: {
    distance: 2.3,
    img: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d"
  }
};

const text = {
  ru: {
    choose: "Выберите остановку",
    distance: "Расстояние",
    price: "Цена",
    pay: "Оплатить",
    sms: "✅ Оплата успешна",
    arrival: "Прибытие через"
  },
  ro: {
    choose: "Alegeți stația",
    distance: "Distanță",
    price: "Preț",
    pay: "Plătește",
    sms: "✅ Plata reușită",
    arrival: "Sosire în"
  }
};

function setLang(l) {
  lang = l;
  document.getElementById("choose").innerText = text[l].choose;
  document.getElementById("payBtn").innerText = text[l].pay;
}

function updateAll() {
  const stop = document.getElementById("stop").value;
  if (!stop) return;

  const d = stops[stop];
  const price = Math.max(2, Math.round(d.distance * 2)); // дешевле 💸

  document.getElementById("distance").innerText =
    `${text[lang].distance}: ${d.distance} км`;

  document.getElementById("price").innerText =
    `${text[lang].price}: ${price} леев`;

  const img = document.getElementById("stopImage");
  img.src = d.img;
  img.classList.remove("hidden");
}

function pay() {
  const sms = document.getElementById("sms");
  const bus = Math.floor(Math.random() * 20) + 1;

  sms.innerHTML = `
    ${text[lang].sms}<br>
    🚌 Автобус №${bus}<br>
    ⏱ ${text[lang].arrival}: 2:00
  `;

  sms.classList.remove("hidden");
  startTimer(2);
}

function startTimer(min) {
  let sec = min * 60;

  const i = setInterval(() => {
    sec--;
    if (sec <= 0) {
      clearInterval(i);
      document.getElementById("arrivalScreen").classList.remove("hidden");
    }
  }, 1000);
}
