//switch mode button

function switchToDark() {
  let darkModeTheme = document.querySelector("body");
  darkModeTheme.classList.toggle("dark");
  if (darkModeTheme.classList.contains("dark")) {
    let switchToggle = document.querySelector("#switch-mode-button");
    switchToggle.innerHTML = `<i class="fa-solid fa-toggle-off"></i>`;
  } else {
    let switchToggle = document.querySelector("#switch-mode-button");
    switchToggle.innerHTML = `<i class="fa-solid fa-toggle-on"></i>`;
  }
}
let toggleOnButton = document.querySelector("#switch-mode-button");
toggleOnButton.addEventListener("click", switchToDark);

function nightMode(hourNow) {
  if (hourNow > 17 || hourNow < 7) {
    let nightTimeTheme = document.querySelector("body");
    nightTimeTheme.classList.add("dark");
    if (nightTimeTheme.classList.contains("dark")) {
      let switchToggle = document.querySelector("#switch-mode-button");
      switchToggle.innerHTML = `<i class="fa-solid fa-toggle-off"></i>`;
    } else {
      let switchToggle = document.querySelector("#switch-mode-button");
      switchToggle.innerHTML = `<i class="fa-solid fa-toggle-on"></i>`;
    }
  }
}

let now = new Date();
let currentHour = now.getHours();
nightMode(currentHour);

//time and date

let date = now.toDateString();
/* not using this time, using last-updated-time
let time = now.toLocaleTimeString();
*/
let todaysDate = document.querySelector("#date");
todaysDate.innerHTML = `${date}`;
//forecast dates//

function formatForecastDates(timestamp) {
  let date = new Date(timestamp * 1000);
  let formattedDates = date.toLocaleDateString();
  return formattedDates;
}

function formatForecastDays(timestamp) {
  let weekdays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  let days = new Date(timestamp * 1000);
  let formattedDays = weekdays[days.getDay()];
  return formattedDays;
}

function displayForecast(response) {
  let forecastForEachDay = response.data.daily;

  let forecastElement = document.querySelector("#forecast-for-each-day");
  let forecastHTML = ``;

  forecastForEachDay.forEach(function (forecastDay, index) {
    if (index < 5) {
      forecastHTML =
        forecastHTML +
        `<div class="row forecastWholeRow">
       <div class="col-2"></div>
       <div class="col-3">
         <div class="nextDays">
          <h5 id="forecastDate">${formatForecastDates(forecastDay.dt)} </h5>
          <h5 id="forecastWeekdays"> ${formatForecastDays(forecastDay.dt)}</h5>
         </div>
       </div>
       <div class="col-6">
          <div class="nextDays-weather">
           
               <img id="weatherForecastIcons" class="forecastIcon card-text" 
         
            src="https://openweathermap.org/img/wn/${
              forecastDay.weather[0].icon
            }@2x.png" 
            alt="icon-id-04n">

            <h5 id="forecastMinCelsius" class="card-text"><i class="downArrow fa-solid fa-down-long"></i>${Math.round(
              forecastDay.temp.min
            )}°</h5>

             <h5 id="forecastMaxCelsius" class="card-text"><i class="upArrow fa-solid fa-up-long"></i>${Math.round(
               forecastDay.temp.max
             )}°</h5>
           </div>
         <div class="col-1"></div>
       </div>
     </div>`;
    }
  });
  forecastHTML = forecastHTML + ``;
  forecastElement.innerHTML = forecastHTML;
}

function sendCoordToForecast(coords) {
  let lat = coords.lat;
  let lon = coords.lon;
  let ForecastApiKey = "2bd326a60dc89a53287e446e819664df";
  let ForecastApiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${ForecastApiKey}&units=metric`;

  axios.get(ForecastApiUrl).then(displayForecast);
}

//
//create global variables for the 3 functions 1.default 2.search form 3.current location
let displayCityName = document.querySelector("#user-inputed-city");
let weatherIcon = document.querySelector("#weatherNowIcon");
let weatherDetailLine01 = document.querySelector("#weatherDetail-1");
let weatherDetailLine02 = document.querySelector("#weatherDetail-2");
let weatherDetailLine03 = document.querySelector("#weatherDetail-3");
let lowestDegree = document.querySelector("#lowest-degree");
let highestDegree = document.querySelector("#highest-degree");
let weatherDetailLine04 = document.querySelector("#feels-like-degree");

// 1.Default city function (when first opening the website)

function showWeatherOfDefaultCity(response) {
  displayCityName.innerHTML = `${response.data.name}`;
  //for reference for degree settings(see the global variable) at the bottom of page
  celsius = `${Math.round(response.data.main.temp)}`;
  highestCelsius = `${Math.round(response.data.main.temp_max)}`;
  lowestCelsius = `${Math.round(response.data.main.temp_min)}`;
  feelsLikeCelsius = `${Math.round(response.data.main.feels_like)}`;
  //
  let celsiusDegree = document.querySelector("#degree-number");
  celsiusDegree.innerHTML = `${celsius}`;

  weatherIcon.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  weatherIcon.setAttribute("alt", `icon-id-${response.data.weather[0].icon}`);
  weatherDetailLine01.innerHTML = `${response.data.weather[0].description}`;
  weatherDetailLine02.innerHTML = `Humidity: ${response.data.main.humidity}%`;
  weatherDetailLine03.innerHTML = `Wind: ${Math.round(
    response.data.wind.speed
  )}mps`;
  lowestDegree.innerHTML = `Lowest: ${lowestCelsius}°`;
  highestDegree.innerHTML = `Highest: ${highestCelsius}°`;
  weatherDetailLine04.innerHTML = `Feels Like: ${feelsLikeCelsius}°`;

  let updatedTime = new Date(response.data.dt * 1000);
  let formattedUpdatedTime = updatedTime.toLocaleTimeString();
  let timeNow = document.querySelector("#last-updated-time");
  timeNow.innerHTML = `${formattedUpdatedTime}`;

  let coord = response.data.coord;
  sendCoordToForecast(coord);
}

let apiKey = "7ed26a6948c661d05fafe7355b41b2ec";
let defaultCity = "Hong Kong";
/*let imperialUnit = "units=imperial";*/
let metricUnit = "units=metric";
let defaultCityApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${defaultCity}&appid=${apiKey}&${metricUnit}`;
axios.get(defaultCityApiUrl).then(showWeatherOfDefaultCity);
//

// 2. allow user to search for city as an input in the form
function showWeather(response) {
  //because celsius sign is a default active unit, and fahrenheit is not, "active" here means bold and bigger

  celsiusDegreeSign.classList.add("active");
  fahrenheitDegreeSign.classList.remove("active");
  //
  displayCityName.innerHTML = `${response.data.name}`;
  //for reference for degree settings(see the global variable) at the bottom of page
  celsius = `${Math.round(response.data.main.temp)}`;
  highestCelsius = `${Math.round(response.data.main.temp_max)}`;
  lowestCelsius = `${Math.round(response.data.main.temp_min)}`;
  feelsLikeCelsius = `${Math.round(response.data.main.feels_like)}`;
  //
  let celsiusDegreeOfUserSearch = document.querySelector("#degree-number");
  celsiusDegreeOfUserSearch.innerHTML = `${celsius}`;

  weatherIcon.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  weatherIcon.setAttribute("alt", `icon-id-${response.data.weather[0].icon}`);
  weatherDetailLine01.innerHTML = `${response.data.weather[0].description}`;
  weatherDetailLine02.innerHTML = `Humidity: ${response.data.main.humidity}%`;
  weatherDetailLine03.innerHTML = `Wind: ${Math.round(
    response.data.wind.speed
  )}mps`;
  lowestDegree.innerHTML = `Lowest: ${lowestCelsius}°`;
  highestDegree.innerHTML = `Highest: ${highestCelsius}°`;
  weatherDetailLine04.innerHTML = `Feels Like: ${feelsLikeCelsius}°`;

  let updatedTime = new Date(response.data.dt * 1000);
  let formattedUpdatedTime = updatedTime.toLocaleTimeString();
  let timeNow = document.querySelector("#last-updated-time");
  timeNow.innerHTML = `${formattedUpdatedTime}`;

  let coord = response.data.coord;
  sendCoordToForecast(coord);
}

function showCity(event) {
  event.preventDefault();
  let userEntryCity = document.querySelector("#inputed-city");
  let userEntryCityValue = userEntryCity.value;
  let apiKey = "7ed26a6948c661d05fafe7355b41b2ec";
  /* let imperialUnit = "units=imperial";*/
  let metricUnit = "units=metric";
  let searchCityApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${userEntryCityValue}&appid=${apiKey}&${metricUnit}`;
  axios.get(searchCityApiUrl).then(showWeather);
}

let citySearchForm = document.querySelector("#city-search");
citySearchForm.addEventListener("submit", showCity);

//

// 3. allow user to click current location button
function showWeatherOfUserCurrentLocation(response) {
  //because celsius sign is a default active unit, and fahrenheit is not, "active" here means bold and bigger

  celsiusDegreeSign.classList.add("active");
  fahrenheitDegreeSign.classList.remove("active");
  //
  displayCityName.innerHTML = `${response.data.name}`;
  //for reference for degree settings(see the global variable) at the bottom of page
  celsius = `${Math.round(response.data.main.temp)}`;
  highestCelsius = `${Math.round(response.data.main.temp_max)}`;
  lowestCelsius = `${Math.round(response.data.main.temp_min)}`;
  feelsLikeCelsius = `${Math.round(response.data.main.feels_like)}`;
  //
  let celsiusDegreeOfUserCity = document.querySelector("#degree-number");
  celsiusDegreeOfUserCity.innerHTML = `${celsius}`;
  weatherIcon.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  weatherIcon.setAttribute("alt", `icon-id-${response.data.weather[0].icon}`);
  weatherDetailLine01.innerHTML = `${response.data.weather[0].description}`;
  weatherDetailLine02.innerHTML = `Humidity: ${response.data.main.humidity}%`;
  weatherDetailLine03.innerHTML = `Wind: ${Math.round(
    response.data.wind.speed
  )}mps`;
  lowestDegree.innerHTML = `Lowest: ${lowestCelsius}°`;
  highestDegree.innerHTML = `Highest: ${highestCelsius}°`;
  weatherDetailLine04.innerHTML = `Feels Like: ${feelsLikeCelsius}°`;

  let updatedTime = new Date(response.data.dt * 1000);
  let formattedUpdatedTime = updatedTime.toLocaleTimeString();
  let timeNow = document.querySelector("#last-updated-time");
  timeNow.innerHTML = `${formattedUpdatedTime}`;

  let coord = response.data.coord;
  sendCoordToForecast(coord);
}

function showCurrentLocation(position) {
  let apiKey = "7ed26a6948c661d05fafe7355b41b2ec";
  /* let imperialUnit = "units=imperial"; */
  let metricUnit = "units=metric";
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;

  let userCityApiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&${metricUnit}&appid=${apiKey}`;
  axios.get(userCityApiUrl).then(showWeatherOfUserCurrentLocation);
}

function searchUserLocationWeatherButton(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(showCurrentLocation);
}

let findCurrentLocationButton = document.querySelector(
  ".currentLocationButton"
);
findCurrentLocationButton.addEventListener(
  "click",
  searchUserLocationWeatherButton
);
//

//degree settings

let celsius = null;
let highestCelsius = null;
let lowestCelsius = null;
let feelsLikeCelsius = null;
let celsiusDegreeSign = document.querySelector("#celsius");
let fahrenheitDegreeSign = document.querySelector("#fahrenheit");

function convertToFahrenheit(event) {
  event.preventDefault();

  celsiusDegreeSign.classList.remove("active");
  fahrenheitDegreeSign.classList.add("active");

  let fahrenheitDegreeNumber = document.querySelector("#degree-number");
  let fahrenheit = Math.round((celsius * 9) / 5 + 32);
  fahrenheitDegreeNumber.innerHTML = `${fahrenheit}`;

  let fahrenheitHighestDegree = document.querySelector("#highest-degree");
  let highestFahrenheit = Math.round((highestCelsius * 9) / 5 + 32);
  fahrenheitHighestDegree.innerHTML = `Highest: ${highestFahrenheit}°`;

  let fahrenheitLowestDegree = document.querySelector("#lowest-degree");
  let lowestFahrenheit = Math.round((lowestCelsius * 9) / 5 + 32);
  fahrenheitLowestDegree.innerHTML = `Lowest: ${lowestFahrenheit}°`;

  let fahrenheitFeelsLikeDegree = document.querySelector("#feels-like-degree");
  let feelsLikeFahrenheit = Math.round((feelsLikeCelsius * 9) / 5 + 32);
  fahrenheitFeelsLikeDegree.innerHTML = `Feels Like: ${feelsLikeFahrenheit}°`;
}

let fahrenheitConvertion = document.querySelector("#fahrenheit");
fahrenheitConvertion.addEventListener("click", convertToFahrenheit);

function convertToCelsius(event) {
  event.preventDefault();

  celsiusDegreeSign.classList.add("active");
  fahrenheitDegreeSign.classList.remove("active");

  let celsiusDegreeNumber = document.querySelector("#degree-number");
  celsiusDegreeNumber.innerHTML = `${celsius}`;

  let celsiusHighestDegree = document.querySelector("#highest-degree");
  celsiusHighestDegree.innerHTML = `Highest: ${highestCelsius}°`;

  let celsiusLowestDegree = document.querySelector("#lowest-degree");
  celsiusLowestDegree.innerHTML = `Lowest: ${lowestCelsius}°`;

  let celsiusFeelsLikeDegree = document.querySelector("#feels-like-degree");
  celsiusFeelsLikeDegree.innerHTML = `Feels Like: ${feelsLikeCelsius}°`;
}
let celsiusConvertion = document.querySelector("#celsius");
celsiusConvertion.addEventListener("click", convertToCelsius);
