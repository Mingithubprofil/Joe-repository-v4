
let orderText = document.getElementById("store");
let storeHeader = document.getElementById("store-header");
let loading = document.getElementById("loading");
let kaffelink = document.getElementById("kaffe_link");

async function getWeather() {
  loading.style.display = "block";

  const promise = new Promise((resolve, reject) => {
    setTimeout(async () => {
      try {
        const result = await axios.get(
          "https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current_weather=true&hourly=temperature_2m,relativehumidity_2m,windspeed_10m"
        );
        resolve(result);
      } catch (err) {
        reject(err);
      } finally {
        loading.style.display = "none";
      }
    }, 2000);
  });

  return promise;
}

getWeather().then(({ data }) => {
  const temperature = data.current_weather.temperature;
  if (temperature < 20) {
    orderText.style.display = "none";
    orderText.textContent = "Uha, det er lidt køligt i dag. Vi tilbyder også kaffe.";
    console.log(temperature)
  } else {
    console.log("Tilbyd kaffe..");
  }
});
