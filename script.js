function buyTicket(){

  const city =
  document.getElementById("city");

  const value = city.value;

  const ticket =
  document.getElementById("ticket");

  if(value === ""){
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
