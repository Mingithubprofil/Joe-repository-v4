window.addEventListener('DOMContentLoaded', (event) => {
  openLocationPopup();
});

function openLocationPopup() {
  document.getElementById('locationPopup').style.display = 'flex';
}

function closeLocationPopup() {
  document.getElementById('locationPopup').style.display = 'none';
}


// Visning af temperatur baseret på valg af by for ordre

let kaffeAnbefaling = document.getElementById("kaffe_anbefaling");
let loading = document.getElementById("loading");

async function getWeather(city) {
  loading.style.display = "block";

  const promise = new Promise((resolve, reject) => {
    setTimeout(async () => {
      try {
        // Konstruerer API URL'en baseret på den valgte by
        const apiUrl = getApiUrlForCity(city);
        const result = await axios.get(apiUrl);

        console.log("API Result:", result.data);

        if (result && result.data && result.data.hourly && result.data.hourly.temperature_2m) {
          resolve(result);
        } else {
          reject(new Error("Invalid data format from the weather API"));
        }
      } catch (err) {
        reject(err);
      } finally {
        loading.style.display = "none";
      }
    }, 2000);
  });

  return promise;
}

function getApiUrlForCity(city) {
  // Definerer base URL'en for vejr API'et
  const baseUrl = "https://api.open-meteo.com/v1/forecast";

  // Definerer latitude og longitude for hver by
  const cityCoordinates = {
    Copenhagen: { latitude: 55.6759, longitude: 12.5655 },
    Aarhus: { latitude: 56.1567, longitude: 10.2108 },
    Odense: { latitude: 55.3959, longitude: 10.3883 },
    Aalborg: { latitude: 57.048, longitude: 9.9187 },
    Roskilde: { latitude: 55.6415, longitude: 12.0803 },
    Esbjerg: { latitude: 55.4703, longitude: 8.4519 },
    Randers: { latitude: 56.4607, longitude: 10.0364 },
    
  };

  // Koordinaterne for den valgte by
  const { latitude, longitude } = cityCoordinates[city];

  // API URL for den valgte by
  const apiUrl = `${baseUrl}?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m`;

  return apiUrl;
}

function selectCity() {
  let selectedCity = document.getElementById('cities').value;
  console.log("Selected City:", selectedCity);

  let orderTextElement = document.getElementById('orderText');
  if (orderTextElement) {
    orderTextElement.innerText = `On this page, you can order from our delicious menu in ${selectedCity}!`;
  }

  // Kalder getWeather funktionen med selected city
  getWeather(selectedCity)
    .then(({ data }) => {
      const temperature = data?.hourly?.temperature_2m?.[0];

      if (temperature !== undefined) {
        if (temperature < 20) {
          kaffeAnbefaling.innerHTML = `Oh, ${temperature} degrees in ${selectedCity} - it's a bit chilly today. We also offer<a id='kaffe_link' href='#'>Coffee & Tea</a>`;

          // Henter kaffe_link element
          const kaffeLink = document.getElementById('kaffe_link');

          // Tilføjer en eventlistener til kaffe_link for at udføre scroll
          kaffeLink.addEventListener('click', (event) => {
            event.preventDefault(); // Forhindre standard adfærd (at følge linket)

            // Bruger smooth scroll til at glide ned til kaffe/te-sektionen
            document.getElementById('kaffeTeSection').scrollIntoView({ behavior: 'smooth' });
          });

          console.log(temperature);
        } else {
          console.log(`Tilbyd kaffe in ${selectedCity}..`);
        }
      } else {
        console.error("Temperature data not available");
      }
    })
    .catch((error) => {
      console.error("Error fetching weather data:", error.message);
    });

  closeLocationPopup();
}

// Til cart samt payment

document.addEventListener('DOMContentLoaded', function () {
  const addToCartButtons = document.querySelectorAll('.addToCartBtn');
  const cartModal = document.getElementById('cartModal');
  const closeBtn = document.querySelector('.close');
  const cartItemsList = document.getElementById('cartItems');
  const totalPriceElement = document.getElementById('totalPrice');
  const cartIcon = document.getElementById('cartIcon');
  const betalBtn = document.querySelector('.betalBtn');
  const paymentTotalElement = document.getElementById('paymentTotal');
  const submitPaymentBtn = document.getElementById('Betalnu');

  let cartItems = [];

  addToCartButtons.forEach(button => {
      button.addEventListener('click', () => addToCart(button));
  });

  cartIcon.addEventListener('click', openCart);
  closeBtn.addEventListener('click', closeCart);
  betalBtn.addEventListener('click', function () {
      // Tjekker om der er genstande i kurven
      if (cartItems.length > 0) {
          openPaymentForm();
      } else {
          alert('You need to add at least one item to the cart to proceed with the payment.');
      }
  });

  submitPaymentBtn.addEventListener('click', submitPayment);

  function addToCart(button) {
      const productContainer = button.closest('.product');
      const productName = productContainer.querySelector('h3').textContent;

      const priceElement = productContainer.querySelector('p[pricetag]');
      const productPrice = parseFloat(priceElement.getAttribute('pricetag'));

      const cartItem = { name: productName, price: productPrice };

      cartItems.push(cartItem);
      updateCartView();
  }

  function removeFromCart(index) {
      cartItems.splice(index, 1);
      updateCartView();
  }

  function updateCartView() {
      cartItemsList.innerHTML = '';
      let total = 0;

      cartItems.forEach((item, index) => {
          const listItem = document.createElement('li');
          listItem.innerHTML = `
              ${item.name} - ${item.price} kr.
              <button class="removeBtn" data-index="${index}">Remove</button>
          `;
          cartItemsList.appendChild(listItem);

          const removeBtn = listItem.querySelector('.removeBtn');
          removeBtn.addEventListener('click', () => removeFromCart(index));

          total += item.price;
      });

      totalPriceElement.textContent = `Total: ${total.toFixed(2)} kr.`;

      updatePaymentTotal(total);

      openCart();
  }

  function updatePaymentTotal(total) {
      paymentTotalElement.textContent = `Total: ${total.toFixed(2)} kr.`;
  }

  function openCart() {
    cartModal.style.width = '250px';
  }

  function closeCart() {
    cartModal.style.width = '0';
  }

  function openPaymentForm() {
    closeCart();
    document.getElementById('paymentForm1').style.display = 'block';
  }

  function updatePaymentTotal(total) {
    if (paymentTotalElement) {
      paymentTotalElement.textContent = `Total beløb: ${total.toFixed(2)} kr.`;
    }
  }
});

//twilio

/* const accountSid = 'AC12cb9761bd22a85b3994135bbcc68e65';
  const authToken = 'a762494ae79bad3c353db3fcd9b840f0';
  const client = require('twilio')(accountSid, authToken);

 function submitPayment() {
  
  const name = document.getElementById("name").value;
  const telefonnummer = document.getElementById("telefonnummer").value;

  client.messages
    .create({
      body: `Hej ${name}, din ordre er nu modtaget og vil blive leveret indenfor 5 minutter. Tak fordi du valgte `,
      messagingServiceSid: 'MG178da6c222de9ec03486b61a2e72c85e',
      to: `+45${telefonnummer}`
    })
    .then(message => {
      console.log(message);
      showOrderConfirmation();
    });
} */

// Funktion til at vise ordrebekræftelse
async function showOrderConfirmation() {
  // Henter værdierne fra inputfelterne
  const name = document.getElementById('name').value.trim();
  const telefonnummer = document.getElementById('telefonnummer').value.trim();
  const email = document.getElementById('e-mail').value.trim();

  // Tjekker om nogle af de krævede felter er tomme
  if (name === '' || telefonnummer === '' || email === '') {
      alert('Please fill in all the required fields.');
      return; // Stopper eksekvering hvis nogle af felterne er tomme
  }

  // Validate phone number (allow only digits and minimum of 8 digits)
  if (!/^\d{8,}$/.test(telefonnummer)) {
      alert('Please enter a valid phone number (minimum 8 digits).');
      return; // Stop execution if validation fails
  }

  // Validate email (check for the presence of @ symbol)
  if (!email.includes('@')) {
      alert('Please enter a valid email address.');
      return; // Stop execution if validation fails
  }

  // Get the current time
  const currentTime = new Date();
  const hours = currentTime.getHours();
  const minutes = currentTime.getMinutes();
  
  // Format the time as HH:MM
  const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

  // Update the order time
  document.getElementById('orderTime').innerText = formattedTime;

  // Get the selected location
  const selectedLocation = document.getElementById("cities").value;

  // Update the selected location
  document.getElementById('selectedLocation').innerText = selectedLocation;

  // Proceed with the order confirmation logic
  document.getElementById('paymentForm1').style.display = 'none';
  const orderConfirmation = document.getElementById('orderConfirmation');

  if (orderConfirmation) {
      orderConfirmation.style.display = 'block';
  }

// Opretter dataobjekt med oplysninger om ordren
const orderData = {
  name,
  telefonnummer,
  email,
  orderDetails: 'Your order has been confirmed',  
};

try {
  // Sender POST-anmodning til serversiden for at udløse e-mail-afsendelsen
  const response = await axios.post('/sendConfirmationEmail', orderData);

  if (response.status === 200) {
    console.log('Email sent successfully');
    
  } else {
    console.error('Fejl ved afsendelse af e-mail:', response.statusText);
  }
} catch (error) {
  console.error('Fejl ved afsendelse af e-mail:', error.message);
}

}

// Funktioner til at lukke felter

function hideOrderConfirmation() {
  document.getElementById("orderConfirmation").style.display = "none";
}

function closepaymentPopup() {
  document.getElementById('paymentForm1').style.display = 'none';
}

function closeorderConfirmation() {
  document.getElementById('orderConfirmation').style.display = 'none';
}
