
let kaffeAnbefaling = document.getElementById("kaffe_anbefaling");
//let storeHeader = document.getElementById("store-header");
let loading = document.getElementById("loading");
let kaffelink = document.getElementById("kaffe_link");

async function getWeather() {
  loading.style.display = "block";

  const promise = new Promise((resolve, reject) => {
    setTimeout(async () => {
      try {
        const result = await axios.get(
            "https://api.open-meteo.com/v1/forecast?latitude=55.6759&longitude=12.5655&current=temperature_2m"
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
  const temperature = data.current.temperature_2m;
  if (temperature < 20) {
    //orderText.style.display = "none";
    kaffeAnbefaling.innerHTML = "Uha, det er lidt køligt i dag. Vi tilbyder også <a id='kaffe_link' href='https://www.joejuice.com/store/5f871bf1-b0d1-4e2a-ac84-31047281cde9'>kaffe</a>."
    console.log(temperature)
  } else {
    console.log("Tilbyd kaffe..");
  }
});
