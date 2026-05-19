const ticket =
document.getElementById("ticket");

function buyTicket(){

const city =
document.getElementById("city");

if(city.value === ""){

alert("Выберите маршрут");

return;

}

ticket.innerHTML = `

<div class="card">

✅ Оплата прошла успешно

<br><br>

🚌 Автобус выехал

<br><br>

⏳ Прибытие через 8 секунд

</div>

`;

setTimeout(()=>{

ticket.innerHTML += `

<div class="card arrive">

🚏 Ваш автобус успешно прибыл

</div>

`;

},8000);

}

// THREE JS

const canvas =
document.getElementById("scene");

const scene =
new THREE.Scene();

scene.background =
new THREE.Color(0x050816);

const camera =
new THREE.PerspectiveCamera(
75,
canvas.clientWidth /
canvas.clientHeight,
0.1,
1000
);

camera.position.set(0,5,12);

const renderer =
new THREE.WebGLRenderer({
canvas,
antialias:true
});

renderer.setSize(
canvas.clientWidth,
canvas.clientHeight
);

const controls =
new THREE.OrbitControls(
camera,
renderer.domElement
);

controls.enableDamping = true;

// LIGHT

const light =
new THREE.PointLight(
0x00c3ff,
4
);

light.position.set(5,10,5);

scene.add(light);

const ambient =
new THREE.AmbientLight(
0xffffff,
1
);

scene.add(ambient);

// ROAD

const road =
new THREE.Mesh(

new THREE.PlaneGeometry(30,4),

new THREE.MeshStandardMaterial({
color:0x111111
})

);

road.rotation.x =
-Math.PI/2;

scene.add(road);

// NEON LINE

const line =
new THREE.Mesh(

new THREE.BoxGeometry(30,.05,.1),

new THREE.MeshBasicMaterial({
color:0x00c3ff
})

);

line.position.y = 0.02;

scene.add(line);

// BUS

let bus;

const loader =
new THREE.GLTFLoader();

loader.load(

'models/bus.glb',

(gltf)=>{

bus = gltf.scene;

bus.scale.set(1.5,1.5,1.5);

bus.position.set(-12,0,-0.3);

scene.add(bus);

},

undefined,

(error)=>{

console.log(error);

}

);

// CITY

for(let i=0;i<40;i++){

const building =
new THREE.Mesh(

new THREE.BoxGeometry(
Math.random()*2+1,
Math.random()*10+2,
Math.random()*2+1
),

new THREE.MeshStandardMaterial({
color:0x222244
})

);

building.position.set(
(Math.random()-0.5)*40,
building.geometry.parameters.height/2,
(Math.random()-0.5)*25
);

if(Math.abs(building.position.z)<4){

building.position.z += 6;

}

scene.add(building);

}

// ANIMATION

function animate(){

requestAnimationFrame(animate);

controls.update();

if(bus){

bus.position.x += 0.03;

if(bus.position.x > 12){

bus.position.x = -12;

}

}

renderer.render(scene,camera);

}

animate();

// RESIZE

window.addEventListener(
'resize',
()=>{

camera.aspect =
canvas.clientWidth /
canvas.clientHeight;

camera.updateProjectionMatrix();

renderer.setSize(
canvas.clientWidth,
canvas.clientHeight
);

}
);
}
