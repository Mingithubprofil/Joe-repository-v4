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
    const adjectives = ['Frisk', 'Sund', 'Eksotisk', 'Frugtagtig', 'Lækker', 'Sød', 'Syrlig', 'Banger'];
    const nouns = ['Energi', 'Booster', 'Splash', 'Fusion', 'Dynamik', 'Power', 'Kick', 'Bombe'];

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
    juiceNameElement.textContent = `Juice Navn: ${juiceName}`;

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
