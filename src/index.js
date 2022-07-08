import './style.css';

let current_loc;
//Initialize the display
see_data('New York City').then(resolve => {
  current_loc = resolve;
  display();
});
let currentFormat = 'F';
const inC = document.getElementById('inC');
inC.addEventListener('click', () => {
  currentFormat = 'C';
  inC.classList.add('selected');
  inF.classList.remove('selected');
  display();
});
const inF = document.getElementById('inF');
inF.addEventListener('click', () => {
  currentFormat = 'F';
  inF.classList.add('selected');
  inC.classList.remove('selected');
  display();
});



async function get_data(location = 'New York City'){
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
    country: data.sys.country,
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

function obj_to_c(obj){
  return {
    country: obj.country,
    name: obj.name,
    coords: obj.coords,
    feels_like: Math.round(k_to_c(obj.feels_like)),
    humidity: obj.humidity,
    temp: Math.round(k_to_c(obj.temp)),
    temp_max: Math.round(k_to_c(obj.temp_max)),
    temp_min: Math.round(k_to_c(obj.temp_min)),
    main_desc: obj.main_desc,
    sub_desc: obj.sub_desc,
  }
}

function obj_to_f(obj){
  return {
    country: obj.country,
    name: obj.name,
    coords: obj.coords,
    feels_like: Math.round(k_to_f(obj.feels_like)),
    humidity: obj.humidity,
    temp: Math.round(k_to_f(obj.temp)),
    temp_max: Math.round(k_to_f(obj.temp_max)),
    temp_min: Math.round(k_to_f(obj.temp_min)),
    main_desc: obj.main_desc,
    sub_desc: obj.sub_desc,
  }
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
      current_loc = resolve;
      display();
      get_giphy_data(current_loc.main_desc);
   }) 
});

function display(){
  let tempObj;
  let appender;
  switch(currentFormat){
    case 'F':
      tempObj = obj_to_f(current_loc);
      appender = '°F';
    break;
    case 'C':
      tempObj = obj_to_c(current_loc);
      appender = ' C';
  }
  const title= getByClass('title');
  const temp = getByClass('temp');
  const high = getByClass('temphigh');
  const low = getByClass('templow');
  const feel = getByClass('tempfeel');
  title.textContent = `${tempObj.name}, ${tempObj.country}: ${tempObj.main_desc}`;
  temp.textContent = tempObj.temp + appender;
  high.textContent = tempObj.temp_max + appender;
  low.textContent = tempObj.temp_min + appender;
  feel.textContent = tempObj.feels_like + appender;

}


function getByClass(cls){
  return document.querySelector('.' + cls);
}

async function get_giphy_data(query){
  const data = await fetch('https://api.giphy.com/v1/gifs/translate?api_key=ml9QhXXS33SxzHC5tOezQ3ZirizRsQEX&s=' + query, {mode: 'cors'})
  .then(resolve => {
    return resolve.json();
  })
  .then(resolve =>{
    return resolve.data.images.original.url;
  });
  const img = document.getElementById('gif');
  img.src = await data;
}