//data mockup import
import {states} from "./states.js";
import {countries} from "./countries.js";

//variables
let form = document.getElementById("form");
let name = document.getElementById("name");
let selectElementCountry = document.getElementById("selectElementCountry");
let selectElementProvince = document.getElementById("selectElementProvince");

//chronometer function

// Sets the maximum time of the timer 
const targetTime = Date.now() + 120000; // 120000 milliseconds, which is equal to 2 minutes (2 * 60 seconds * 1000 milliseconds).

// Update the timer every second
const intervalId = setInterval(updateTimer, 1000);

function updateTimer() {
  // Calculate the remaining time in seconds
  const remainingTime = Math.round((targetTime - Date.now()) / 1000);

  if (remainingTime <= 0) {
    // If the timer has expired, stop the interval
    clearInterval(intervalId);
    let createModal = document.getElementById("createModal")
    createModal.innerHTML = `       
      <!-- Modal -->
      <div class="modal fade" id="modalTimeOver"  role="dialog" aria-labelledby="modalTimeOverLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="modalTimeOverLabel">¡TIME OVER!</h1>
            </div>
            <div class="modal-body">
            <p>Time ended! Click the 'Try Again' button to start again</p>
            </div>
            <div class="modal-footer">
            <button type="button" class="btn btn-form mt-3" id="reloadBtn" data-dismiss="modal">Try Again</button>
          </div>
          </div>
        </div>
      </div> `

      //allows the modal to be executed, without the need for a button
      $(document).ready(function(){
        $('#modalTimeOver').modal('show');
      });

      //makes the modal not close even if clicked
      let modalTimeOverStatic = new bootstrap.Modal(document.getElementById('modalTimeOver'), {
        backdrop: 'static'
      });
      modalTimeOverStatic.show();

      //reload the web when they click on the button
      let reloadBtn = document.getElementById("reloadBtn")
      reloadBtn.addEventListener("click", function() {
        location.reload();
      });

    return;
  }

  // Calculate the hours, minutes, and seconds from the remaining time
  const hours = Math.floor(remainingTime / 3600);
  const minutes = Math.floor((remainingTime % 3600) / 60);
  const seconds = remainingTime % 60;

  // Pad the hours, minutes, and seconds with leading zeros if necessary
  const paddedHours = hours.toString().padStart(2, '0');
  const paddedMinutes = minutes.toString().padStart(2, '0');
  const paddedSeconds = seconds.toString().padStart(2, '0');

  // Update the clock display
  document.getElementById('hours').innerHTML = `${paddedHours} | `;
  document.getElementById('minutes').innerHTML = `${paddedMinutes} | `;
  document.getElementById('seconds').innerHTML = paddedSeconds;

}

// function: birthday
function birthday(event) {

let userBirthdayDate = document.getElementById("birthdayDate");
let today = new Date();
let birthday = new Date(userBirthdayDate.value);
let age = today.getFullYear() - birthday.getFullYear();
if (age >= 18 && age <= 63) {
    return {
      value:true,
      information:birthday,
    }
  } else {
    alert("Sorry, the age entered is not within the acceptable range of 18 to 63 years. Please update your entry");
    return false
  }
}


// function: mail
function mailValidator(event) {
    const emailAddress = document.getElementById("emailAddress").value;
    const regex  = /@.+[.]/;
    if(regex.test(emailAddress)){
      return {
        value:true,
        information: emailAddress,
      }
    }else{
      alert("Please enter a valid email address format.")
      return false
    }

}

// function: country 

function getCountry() {
  countries.map((country) => {
      //date-mock
      let countryListElement = document.createElement("option");
      countryListElement.textContent = country.name;
      countryListElement.setAttribute("value", country.name)
      selectElementCountry.appendChild(countryListElement);
    });
  }

  // function: province
  function getProvince() {
    selectElementProvince.innerHTML = ""; // clear previous options
    let selectedCountry = countries.find((country) => country.name === selectElementCountry.value);
    if (selectedCountry) {
      // Filter the list of provinces by the ID of the selected country
      let filteredProvinces = states.filter((province) => province.id_country === selectedCountry.id);
  
      // Add options for filtered provinces
      filteredProvinces.forEach((province) => {
        let provinceListElement = document.createElement("option");
        provinceListElement.textContent = province.name;
        provinceListElement.setAttribute("value", province.name)
        selectElementProvince.appendChild(provinceListElement); 
      });
    }
  }

  //Consuming API - Weather Form

  function weatherData(data){
    let weatherForm= document.getElementById("weatherForm");
    weatherForm.innerHTML =`City: ${data.city.name} | <span class="form-element-context-weather-temp">${data.list[0].main.temp}°</span>`
  }
  function getWeather(posicion) {
    const {longitude, latitude} = posicion;
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=6752644c4b10d307e40b484055d4f5a5&units=metric`
    fetch(url)
        .then(response => {return response.json()})
        .then(data => {
          weatherData(data)
        })
        .catch(error => {
            console.log(error)
        })
  }

  async function getLocationDefault() {
      const request = await fetch("https://ipinfo.io/json?token=90d44b45827c47")
      const jsonResponse = await request.json()
      const loc = jsonResponse.loc.split(',');
      const coords = {
          latitude: loc[0],
          longitude: loc[1]
      };
      getWeather(coords);
      return coords;
  }

  function init() {
      navigator.geolocation.getCurrentPosition(posicion => {
          getWeather(posicion.coords)
      }, error => {
          getLocationDefault()
      })
  }
  
  
  //Function Call
  
  getCountry()

  init()


  //Events:

  //Country selection events
  selectElementCountry.addEventListener("change",()=>{
    getProvince()
  })


// form submission event
form.addEventListener("submit", (event) => {
    event.preventDefault();
    const modalBirthday = birthday(event);
    const modalMailValidator = mailValidator(event)
    // modal
    if (modalBirthday.value && modalMailValidator.value) {
      clearInterval(intervalId);
      let createModal = document.getElementById("createModal")
      createModal.innerHTML = `       
        <!-- Modal -->
        <div class="modal fade" id="informationModal" tabindex="-1" aria-labelledby=informationModalLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h1 class="modal-title fs-5" id="informationModalLabel">GREAT! YOU HAVE COMPLETED THE DATA FORM!</h1>
              </div>
              <div class="modal-body">
                <p>Name: ${name.value}</p>
                <p>Mail: ${modalMailValidator.information}</p>
                <p>Date: ${modalBirthday.information.toLocaleDateString()}</p>
                <p>Country: ${selectElementCountry.value}</p>
                <p>State: ${selectElementProvince.value}</p>
              </div>
            </div>
          </div>
        </div> `
      let activeModal = new bootstrap.Modal(document.getElementById('informationModal'), {
        backdrop: 'static'
    });
      activeModal.show();
  }else{
    
    //clean - Birthday and mail
    modalBirthday.information.innerHTML = "";
    modalMailValidator.information.innerHTML = "";
  }
});


