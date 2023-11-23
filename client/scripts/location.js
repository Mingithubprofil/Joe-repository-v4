let kaffeAnbefaling = document.getElementById("kaffe_anbefaling");
let loading = document.getElementById("loading");

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
    kaffeAnbefaling.innerHTML = `Oh, ${temperature} degrees in Copenhagen - it's a bit chilly today. We also offer<a id='kaffe_link' href='#'>Coffee & Tea</a>`;

    // Hent dit kaffe_link element
    const kaffeLink = document.getElementById('kaffe_link');

    // Tilføj en eventlistener til kaffe_link for at udføre scroll
    kaffeLink.addEventListener('click', (event) => {
      event.preventDefault(); // Forhindre standard adfærd (at følge linket)

      // Brug smooth scroll til at glide ned til kaffe/te-sektionen
      document.getElementById('kaffeTeSection').scrollIntoView({ behavior: 'smooth' });
    });

    console.log(temperature);
  } else {
    console.log("Tilbyd kaffe..");
  }
});