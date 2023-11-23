window.addEventListener('DOMContentLoaded', (event) => {
  openLocationPopup();
});

function openLocationPopup() {
  document.getElementById('locationPopup').style.display = 'flex';
}

function closeLocationPopup() {
  document.getElementById('locationPopup').style.display = 'none';
}

function selectCity() {
  var selectedCity = document.getElementById('cities').value;
  console.log("Selected City:", selectedCity);

  var orderTextElement = document.getElementById('orderText');
  if (orderTextElement) {
    orderTextElement.innerText = `On this page, you can order from our delicious menu in ${selectedCity}!`;
  }

  closeLocationPopup();
}

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
      // Check if there are items in the cart
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

// Function to show order confirmation
function showOrderConfirmation() {
  // Get the values from the input fields
  const name = document.getElementById('name').value.trim();
  const telefonnummer = document.getElementById('telefonnummer').value.trim();
  const email = document.getElementById('e-mail').value.trim();

  // Check if any of the required fields is empty
  if (name === '' || telefonnummer === '' || email === '') {
      alert('Please fill in all the required fields.');
      return; // Stop execution if any field is empty
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
}


function hideOrderConfirmation() {
  document.getElementById("orderConfirmation").style.display = "none";
}

function closepaymentPopup() {
  document.getElementById('paymentForm1').style.display = 'none';
}

function closeorderConfirmation() {
  document.getElementById('orderConfirmation').style.display = 'none';
}
