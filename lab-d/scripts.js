const API_KEY = "d8035fead4e0774a6d3921f8a03620a4";
let cityInput = document.getElementById("cityInput");
let weatherForm = document.getElementById("weatherForm");
let currentResult = document.getElementById("currentResult");
let forecastResult = document.getElementById("forecastResult");
weatherForm.addEventListener("submit", function(event){
  event.preventDefault();
  let city = cityInput.value.trim();
  if(city===""){
    alert("Nazwa miasta nie może byc pusta");
    return;
  }
  currentResult.innerHTML="";
  forecastResult.innerHTML="";
  getCurrentWeather(city);
  getForecastWeather(city);
});

function getCurrentWeather(city){
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&lang=pl&units=metric`;
  let req = new XMLHttpRequest();
  req.open("GET", url, true);
  req.onload = function() {
    if (req.status === 200) {
      const data = JSON.parse(req.responseText);
      console.log("Aktualna pogoda", data);
      displayCurrentWeather(data);
    } else {
      console.log("Błąd: " + req.status);
      alert("Błąd nie udało się pobrac pogody");
    }
  };
  req.onerror = function() {
    alert("Błąd");
  };
  req.send();
}
function displayCurrentWeather(data) {
  let cityName = document.createElement("h3");
  cityName.textContent = data.name;
  let temperature = document.createElement("h2");
  temperature.textContent = `${Math.round(data.main.temp)}°C`;
  let weatherIcon = document.createElement("img");
  weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
  let description = document.createElement("p");
  description.textContent = data.weather[0].description;
  let details = document.createElement("div");
  details.className = "weather-details";
  let feelsLike = document.createElement("p");
  feelsLike.textContent = `Odczuwalna: ${Math.round(data.main.feels_like)}°C`;
  let humidity = document.createElement("p");
  humidity.textContent = `Wilgotność: ${data.main.humidity}%`;
  let pressure = document.createElement("p");
  pressure.textContent = `Ciśnienie: ${data.main.pressure} hPa`;
  let wind = document.createElement("p");
  wind.textContent = `Wiatr: ${data.wind?.speed ?? "Brak danych"} m/s`;
  let clouds = document.createElement("p");
  clouds.textContent = `Zachmurzenie: ${data.clouds?.all ?? "Brak danych"}%`;
  details.appendChild(feelsLike);
  details.appendChild(humidity);
  details.appendChild(pressure);
  details.appendChild(wind);
  details.appendChild(clouds);
  currentResult.replaceChildren(cityName, weatherIcon, temperature, description, details);
}
function getForecastWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&lang=pl&units=metric`;
  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error("Błąd: " + response.status);
      }
      return response.json();
    })
    .then(data => {
      console.log("Prognoza pogody na kolejne dni", data);
      displayForecast(data);
    })
    .catch(error => {
      console.log("Błąd pobierania prognozy:", error);
      alert("Błąd");
    });
}

function displayForecast(data) {
  forecastResult.innerHTML = "";
  data.list.forEach(item => {
    let card = document.createElement("div");
    card.className = "forecast-card";
    let date = document.createElement("h3");
    date.textContent = item.dt_txt;
    let temperature = document.createElement("h2");
    temperature.textContent = `${Math.round(item.main.temp)}°C`;
    let description = document.createElement("p");
    description.textContent = item.weather[0].description;
    let rainChance = document.createElement("p");
    rainChance.textContent = `Szansa opadów: ${Math.round(item.pop*100)}%`;
    card.appendChild(date);
    card.appendChild(temperature);
    card.appendChild(description);
    card.appendChild(rainChance);
    forecastResult.appendChild(card);
  });
}

