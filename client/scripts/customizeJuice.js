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
  const juiceNameElement = document.getElementById('juiceName');
  const selectedIngredientsContainer = document.getElementById('selectedIngredients');
  const juiceImageContainer = document.querySelector('.juice-image-container');
  const vitaminDisplay = document.getElementById('vitaminDisplay'); // New element for vitamin display
  const maxContainerWidth = 600; // Set the maximum width as needed
  const juiceFee = 50.00; // Standard juice fee
  let cartItems = [];
  let juiceFeeAdded = false; // Flag to check if juice fee is added

  function getRandomPosition(containerWidth, containerHeight, elementWidth, elementHeight) {
    const x = Math.random() * (containerWidth - elementWidth);
    const y = Math.random() * (containerHeight - elementHeight);
    return { x, y };
  }

  function generateRandomJuiceName(ingredients) {
    const adjectives = ['Fresh', 'Healthy', 'Exotic', 'Fruity', 'Delicious', 'Sweet', 'Sour', 'Banging'];
    const nouns = ['Energy', 'Booster', 'Splash', 'Fusion', 'Dynamic', 'Power', 'Kick', 'Bomb'];
    

    const uniqueIngredients = [...new Set(ingredients)]; // Remove duplicate ingredients
    const limitedIngredients = uniqueIngredients.slice(0, 2);

    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];

    return `${randomAdjective} ${limitedIngredients.join(' ')} ${randomNoun}`;
  }

  function updateVitaminDisplay() {
    // Clear previous vitamin display
    vitaminDisplay.innerHTML = '';

    // Get unique vitamins from cart items
    const uniqueVitamins = [...new Set(cartItems.map(item => item.vitamin))];

    // Display each vitamin in a visually appealing way
    uniqueVitamins.forEach(vitamin => {
      const vitaminDiv = document.createElement('div');
      vitaminDiv.classList.add('vitamin-item');
      vitaminDiv.textContent = vitamin;

      // You can add additional styling or icons for each vitamin if needed
      // vitaminDiv.style.color = 'red'; // Example styling

      vitaminDisplay.appendChild(vitaminDiv);
    });
  }

  function addJuiceFee() {
    // Add the standard juice fee
    cartItems.unshift({ name: 'Juice Fee', price: juiceFee, image: null, vitamin: null, isJuiceFee: true });
  }

  function addToCart(button) {
    const productName = button.parentElement.querySelector('h3').textContent;
    const productImage = button.parentElement.querySelector('img').src;
    const productPriceString = button.parentElement.querySelector('p').textContent;
    const productPrice = parseFloat(productPriceString.split(' ')[1].replace(',', '.'));
    const productVitamin = button.parentElement.dataset.vitamin; // Get vitamin from data attribute

    const ingredientImage = document.createElement('img');
    ingredientImage.src = productImage;
    ingredientImage.alt = productName;
    ingredientImage.classList.add('selected-ingredient');

    const ingredientSize = 80; // Just an example size, adjust as needed
    const randomPosition = getRandomPosition(
      juiceImageContainer.clientWidth,
      juiceImageContainer.clientHeight,
      ingredientSize,
      ingredientSize
    );

    const offsetX = 50; // Adjust as needed
    const offsetY = 100; // Adjust as needed

    ingredientImage.style.left = `${randomPosition.x - offsetX}px`;
    ingredientImage.style.top = `${randomPosition.y - offsetY}px`;

    // Scale the ingredient image
    const scale = 0.8; // Adjust the scale factor as needed
    ingredientImage.style.transform = `scale(${scale})`;

    selectedIngredientsContainer.appendChild(ingredientImage);

    const cartItem = { name: productName, price: productPrice, image: productImage, vitamin: productVitamin, isJuiceFee: false };
    cartItems.push(cartItem);

    // Add juice fee only for the first product
    if (!juiceFeeAdded) {
      addJuiceFee();
      juiceFeeAdded = true;
    }

    updateVitaminDisplay(); // Update the vitamin display
    updateCartView();
  }

  function updateCartView() {
    cartItemsList.innerHTML = '';
    let total = 0;

    selectedIngredientsContainer.innerHTML = '';

    cartItems.forEach((item, index) => {
      const listItem = document.createElement('li');
      listItem.innerHTML = `
        ${!item.isJuiceFee ? `<span>${item.name} - ${item.price} kr. </span> <button class="removeBtn" data-index="${index}">Remove</button>` : ''}
      `;
      cartItemsList.appendChild(listItem);

      total += item.price;

      if (item.image && !item.isJuiceFee) {
        const ingredientImage = document.createElement('img');
        ingredientImage.src = item.image;
        ingredientImage.alt = item.name;
        ingredientImage.classList.add('selected-ingredient');
        selectedIngredientsContainer.appendChild(ingredientImage);

        // Scale the ingredient image
        const scale = 0.8; // Adjust the scale factor as needed
        ingredientImage.style.transform = `scale(${scale})`;
      }

      if (!item.isJuiceFee) {
        const removeBtn = listItem.querySelector('.removeBtn');
        removeBtn.addEventListener('click', () => removeFromCart(index));
      }
    });

    const juiceName = generateRandomJuiceName(cartItems.filter(item => !item.isJuiceFee).map(item => item.name));
    juiceNameElement.textContent = `Juice Name: ${juiceName}`;

    totalPriceElement.textContent = `Total: ${total.toFixed(2)} kr.`;

    openCart();
  }

  function removeFromCart(index) {
    cartItems.splice(index, 1);
    updateVitaminDisplay(); // Update the vitamin display
    updateCartView();
  }

  function openCart() {
    cartModal.style.width = '250px';
  }

  function closeCart() {
    cartModal.style.width = '0';
  }

  function adjustContainerSize() {
    const containerWidth = Math.min(maxContainerWidth, juiceImageContainer.clientWidth);
    juiceImageContainer.style.width = `${containerWidth}px`;
  }

  window.addEventListener('resize', adjustContainerSize);

  addToCartButtons.forEach(button => {
    button.addEventListener('click', () => addToCart(button));
  });

  cartIcon.addEventListener('click', openCart);

  closeBtn.addEventListener('click', closeCart);

  // Initial adjustment of container size
  adjustContainerSize();
});


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
async function showOrderConfirmation() {
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

  // Opret dataobjekt med oplysninger om ordren
const orderData = {
  name,
  telefonnummer,
  email,
  orderDetails: 'Your order has been confirmed',  // Tilføj relevante oplysninger om ordren
};

try {
  // Send POST-anmodning til serversiden for at udløse e-mail-sendingen
  const response = await axios.post('/sendConfirmationEmail', orderData);

  if (response.status === 200) {
    console.log('Email sent successfully');
    // Fortsæt med din frontend-logik for bekræftelsessiden eller lignende
  } else {
    console.error('Fejl ved afsendelse af e-mail:', response.statusText);
  }
} catch (error) {
  console.error('Fejl ved afsendelse af e-mail:', error.message);
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
