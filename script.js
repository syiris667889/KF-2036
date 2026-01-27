let lang = "ru";

const cities = {
  Chisinau: {
    distance: 160,
    img: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957"
  },
  Balti: {
    distance: 90,
    img: "https://images.unsplash.com/photo-1503376780353-7e6692767b70"
  },
  Soroca: {
    distance: 70,
    img: "https://images.unsplash.com/photo-1494526585095-c41746248156"
  },
  Edinet: {
    distance: 50,
    img: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d"
  }
};

const text = {
  ru: {
    chooseCity: "Выберите город",
    price: "Цена",
    distance: "Расстояние",
    pay: "Оплатить",
    success: "✅ Оплата прошла успешно",
    arrival: "Прибытие через"
  },
  ro: {
    chooseCity: "Alegeți orașul",
    price: "Preț",
    distance: "Distanță",
    pay: "Plătește",
    success: "✅ Plata a fost efectuată",
    arrival: "Sosire în"
  }
};

function setLang(l) {
  lang = l;
  document.getElementById("chooseCity").innerText = text[l].chooseCity;
  document.getElementById("payBtn").innerText = text[l].pay;
  document.getElementById("success").innerText = text[l].success;
}

function updateAll() {
  const city = document.getElementById("city").value;
  if (!city) return;

  const data = cities[city];
  const price = Math.round(data.distance * 0.3);

  document.getElementById("distance").innerText =
    ${text[lang].distance}: ${data.distance} км;

  document.getElementById("price").innerText =
    ${text[lang].price}: ${price} леев;

  const img = document.getElementById("stopImage");
  img.src = data.img;
  img.classList.remove("hidden");
}

function pay() {
  document.getElementById("result").classList.remove("hidden");

  const bus = Math.floor(Math.random() * 50) + 1;
  document.getElementById("busNumber").innerText =
    "Автобус №" + bus;

  startTimer(5);
}

function startTimer(min) {
  let sec = min * 60;
  const t = document.getElementById("timer");

  const i = setInterval(() => {
    t.innerText = ${text[lang].arrival}: ${Math.floor(sec/60)}:${sec%60};
    if (sec-- <= 0) {
      clearInterval(i);
      t.innerText = "🟢 Автобус прибыл";
    }
  }, 1000);
}
