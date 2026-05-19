const stopSelect =
document.getElementById("stop");

const payBtn =
document.getElementById("payBtn");

const distanceEl =
document.getElementById("distance");

const priceEl =
document.getElementById("price");

const sms =
document.getElementById("sms");

const mapCard =
document.getElementById("mapCard");

const paySound =
document.getElementById("paySound");

let map,
busMarker,
routeLine,
moveInterval,
timerInterval;

const baseCoords =
[48.276,27.170];

const stops = {

Otaci:{
name:"Отачь",
distance:18,
price:15,
coords:[48.432,27.799]
},

Ocnita:{
name:"Окница",
distance:39,
price:30,
coords:[48.382,27.438]
},

Edinet:{
name:"Единцы",
distance:57,
price:45,
coords:[48.168,27.305]
},

Briceni:{
name:"Бричаны",
distance:75,
price:55,
coords:[48.357,27.069]
},

Donduseni:{
name:"Дондюшаны",
distance:91,
price:65,
coords:[48.242,27.610]
},

Soroca:{
name:"Сороки",
distance:120,
price:80,
coords:[48.156,28.284]
},

Balti:{
name:"Бельцы",
distance:150,
price:95,
coords:[47.761,27.929]
}

};

stopSelect.addEventListener(
"change",
()=>{

const stop =
stops[stopSelect.value];

if(!stop) return;

distanceEl.innerText =
Расстояние: ${stop.distance} км;

priceEl.innerText =
Цена: ${stop.price} леев;

}
);

payBtn.addEventListener(
"click",
async()=>{

const stop =
stops[stopSelect.value];

if(!stop) return;

paySound.currentTime = 0;

paySound.play();

if(navigator.vibrate){

navigator.vibrate(150);

}

const time =
Math.max(
90,
stop.distance * 4
);

showSMS(stop,time);

showMap(stop.coords,time);

}
);

function showSMS(
stop,
seconds
){

sms.classList.remove("hidden");

sms.innerHTML = `

<h3>
✅ Оплата прошла
</h3>

<p>
Маршрут до:
<b>${stop.name}</b>
</p>

<p>
Стоимость:
<b>${stop.price} леев</b>
</p>

<p>
⏱ Прибытие через
<span id="time"></span>
</p>

`;

startTimer(seconds);

}

function startTimer(sec){

const t =
document.getElementById("time");

clearInterval(timerInterval);

timerInterval =
setInterval(()=>{

const m =
Math.floor(sec / 60);

const s =
sec % 60;

t.innerText =
${m}:${s < 10 ? "0" : ""}${s};

if(--sec < 0){

clearInterval(timerInterval);

t.innerText = "00:00";

sms.innerHTML += `

<div style="
margin-top:15px;
padding:14px;
border-radius:16px;
background:#1aff8c22;
border:1px solid #1aff8c55;
">

🚌 Ваш автобус успешно прибыл

</div>

`;

}

},1000);

}

function showMap(
target,
time
){

mapCard.classList.remove("hidden");

if(!map){

map =
L.map("map")
.setView(baseCoords,8);

L.tileLayer(
"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
{
attribution:"© OpenStreetMap"
}
).addTo(map);

}

if(busMarker)
map.removeLayer(busMarker);

if(routeLine)
map.removeLayer(routeLine);

clearInterval(moveInterval);

const route = [
baseCoords,
target
];

routeLine =
L.polyline(
route,
{
color:"#4c7dff",
weight:5
}
).addTo(map);

busMarker =
L.marker(route[0],{

icon:L.icon({

iconUrl:
"https://cdn-icons-png.flaticon.com/512/3448/3448339.png",

iconSize:[48,48]

})

}).addTo(map);

let step = 0;

const steps = time;

moveInterval =
setInterval(()=>{

step++;

const lat =
route[0][0] +
(route[1][0]-route[0][0]) *
(step / steps);

const lng =
route[0][1] +
(route[1][1]-route[0][1]) *
(step / steps);

busMarker.setLatLng([
lat,
lng
]);

if(step >= steps){

clearInterval(moveInterval);

}

},1000);

map.fitBounds(
routeLine.getBounds(),
{
padding:[50,50]
}
);

}
