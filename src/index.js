import './style.css';


async function get_data(location = 'Boston'){
  try{
    //Get latitude and longitude of location
    const location_data = await fetch('http://api.openweathermap.org/geo/1.0/direct?q=' + location + '&limit=1&appid=910338b7304957522a845744793da366');
    const location_data_json = await location_data.json();
    const [lat,lon]= [location_data_json[0].lat, location_data_json[0].lon];
    //Use the coords to get the weather
    const weather_data = await fetch('https://api.openweathermap.org/data/2.5/weather?lat=' +  lat + '&lon=' + lon + '&appid=910338b7304957522a845744793da366');
    const weather_data_json = await weather_data.json();
    return weather_data_json;
  } catch(err){
    console.log(err);
  }
}

async function process_data(promise_data){
  const data = await promise_data;
  console.log(data);
  return{
    name: data.name,
    coords: data.coord,
    feels_like: data.main.feels_like,
    humidity: data.main.humidity,
    temp: data.main.temp,
    temp_max: data.main.temp_max,
    temp_min: data.main.temp_min,
    main_desc: data.weather[0].main,
    sub_desc: data.weather[0].description,
  }
}

async function see_data(location){
  const data_obj = await process_data(get_data(location));
  return data_obj;
}

function k_to_f(k){
  return (k-273.15)*1.8 + 32;display 
}

function k_to_c(k){
  return k-273.15;
}

const form = document.getElementById('getcity');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const city = document.getElementById('city').value;
  const cityPromise = see_data(city)
    .then(resolve => {
      console.log(resolve);
      display(resolve);
   }) 
});

function display(tempObj){
  const title= getByClass('title');
  const temp = getByClass('temp');
  const high = getByClass('temphigh');
  const low = getByClass('templow');
  const feel = getByClass('tempfeel');
  title.textContent = `${tempObj.name}: ${tempObj.main_desc}`;
  temp.textContent = tempObj.temp;
  high.textContent = tempObj.temp_max;
  low.textContent = tempObj.temp_min;
  feel.textContent = tempObj.feels_like;

}


function getByClass(cls){
  return document.querySelector('.' + cls);
}