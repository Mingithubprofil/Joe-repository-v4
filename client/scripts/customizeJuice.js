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
  const vitaminDisplay = document.getElementById('vitaminDisplay'); // Nyt element for visning af vitaminer
  const maxContainerWidth = 600; 
  const juiceFee = 50.00; // Standard juice fee
  let cartItems = [];
  let juiceFeeAdded = false; // Tjekker om juice fee er tilføjet

  function getRandomPosition(containerWidth, containerHeight, elementWidth, elementHeight) {
    const x = Math.random() * (containerWidth - elementWidth);
    const y = Math.random() * (containerHeight - elementHeight);
    return { x, y };
  }

  function generateRandomJuiceName(ingredients) {
    const adjectives = ['Fresh', 'Healthy', 'Exotic', 'Fruity', 'Delicious', 'Sweet', 'Sour', 'Banging'];
    const nouns = ['Energy', 'Booster', 'Splash', 'Fusion', 'Dynamic', 'Power', 'Kick', 'Bomb'];
    

    const uniqueIngredients = [...new Set(ingredients)]; // Fjerner duplikat ingredienser
    const limitedIngredients = uniqueIngredients.slice(0, 2);

    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];

    return `${randomAdjective} ${limitedIngredients.join(' ')} ${randomNoun}`;
  }

  function updateVitaminDisplay() {
    // Clearer tidliere display af vitamin
    vitaminDisplay.innerHTML = '';

    // Henter unikke vitaminers fra cart items
    const uniqueVitamins = [...new Set(cartItems.map(item => item.vitamin))];

    // Display'er hver vitamin 
    uniqueVitamins.forEach(vitamin => {
      const vitaminDiv = document.createElement('div');
      vitaminDiv.classList.add('vitamin-item');
      vitaminDiv.textContent = vitamin;

      // vitaminDiv.style.color = 'red'; // Example styling

      vitaminDisplay.appendChild(vitaminDiv);
    });
  }

  function addJuiceFee() {
    // Tilføjer standard juice fee
    cartItems.unshift({ name: 'Juice Fee', price: juiceFee, image: null, vitamin: null, isJuiceFee: true });
  }

  function addToCart(button) {
    const productName = button.parentElement.querySelector('h3').textContent;
    const productImage = button.parentElement.querySelector('img').src;
    const productPriceString = button.parentElement.querySelector('p').textContent;
    const productPrice = parseFloat(productPriceString.split(' ')[1].replace(',', '.'));
    const productVitamin = button.parentElement.dataset.vitamin; 

    const ingredientImage = document.createElement('img');
    ingredientImage.src = productImage;
    ingredientImage.alt = productName;
    ingredientImage.classList.add('selected-ingredient');

    const ingredientSize = 80; 
    const randomPosition = getRandomPosition(
      juiceImageContainer.clientWidth,
      juiceImageContainer.clientHeight,
      ingredientSize,
      ingredientSize
    );

    const offsetX = 50; 
    const offsetY = 100; 

    ingredientImage.style.left = `${randomPosition.x - offsetX}px`;
    ingredientImage.style.top = `${randomPosition.y - offsetY}px`;

    // Ingrediens billede
    const scale = 0.8; 
    ingredientImage.style.transform = `scale(${scale})`;

    selectedIngredientsContainer.appendChild(ingredientImage);

    const cartItem = { name: productName, price: productPrice, image: productImage, vitamin: productVitamin, isJuiceFee: false };
    cartItems.push(cartItem);

    // Tilføjer kun juice fee til første produkt
    if (!juiceFeeAdded) {
      addJuiceFee();
      juiceFeeAdded = true;
    }

    updateVitaminDisplay(); // Opdaterer vitamin display'et
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

        
        const scale = 0.8; 
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
    updateVitaminDisplay(); // Updaterer vitamin display'et
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
      // Tjekker om der er items i cart
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

// Funktion til at vise ordrebekræftelse
async function showOrderConfirmation() {
  // Henter værdierne fra inputfelterne
  const name = document.getElementById('name').value.trim();
  const telefonnummer = document.getElementById('telefonnummer').value.trim();
  const email = document.getElementById('e-mail').value.trim();

  // Tjekker om felterne er tommme
  if (name === '' || telefonnummer === '' || email === '') {
      alert('Please fill in all the required fields.');
      return; 
  }

  // Validerer telefonnummer (tillader kun cifre og minimum 8 cifre)
  if (!/^\d{8,}$/.test(telefonnummer)) {
      alert('Please enter a valid phone number (minimum 8 digits).');
      return; 
  }

  // Validerer email (tjekker for @ symbol)
  if (!email.includes('@')) {
      alert('Please enter a valid email address.');
      return; 
  }

  // Henter tidspunkt
  const currentTime = new Date();
  const hours = currentTime.getHours();
  const minutes = currentTime.getMinutes();
  
  // Formaterer tidspunktet
  const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

  // Opdaterer ordretidspunkt
  document.getElementById('orderTime').innerText = formattedTime;

  // Henter den valgte lokation
  const selectedLocation = document.getElementById("cities").value;

  // Opdaterer den valgte lokation
  document.getElementById('selectedLocation').innerText = selectedLocation;

  // Fortsætter med logikken for ordrebekræftelsen
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


function hideOrderConfirmation() {
  document.getElementById("orderConfirmation").style.display = "none";
}

function closepaymentPopup() {
  document.getElementById('paymentForm1').style.display = 'none';
}

function closeorderConfirmation() {
  document.getElementById('orderConfirmation').style.display = 'none';
}
