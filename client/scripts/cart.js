
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
    // Handle the selected city as needed (e.g., pass it to your server, store in a variable, etc.)
    console.log("Selected City:", selectedCity);

    // Update the text with the selected city
    var orderTextElement = document.getElementById('orderText');
    if (orderTextElement) {
        orderTextElement.innerText = `På denne side kan du bestille en juice fra vores lækre menu i ${selectedCity}!`;
    }

    // Close the popup (you can remove this if you want to keep it open)
    closeLocationPopup();
}



document.addEventListener('DOMContentLoaded', function () {
  const addToCartButtons = document.querySelectorAll('.addToCartBtn');
  const cartModal = document.getElementById('cartModal');
  const closeBtn = document.querySelector('.close');
  const cartItemsList = document.getElementById('cartItems');
  const totalPriceElement = document.getElementById('totalPrice');
  const cartIcon = document.getElementById('cartIcon'); // Cart icon ID
  const betalBtn = document.querySelector('.betalBtn'); // Betal knap

  let cartItems = [];

  // Event listeners for "Add to Cart" buttons
  addToCartButtons.forEach(button => {
      button.addEventListener('click', () => addToCart(button));
  });

  // Event listener for opening the cart modal when clicking the cart icon
  cartIcon.addEventListener('click', openCart);

  // Event listener for closing the cart modal
  closeBtn.addEventListener('click', closeCart);

  // Event listener for opening the payment form
  betalBtn.addEventListener('click', openPaymentForm);

  // Function to add an item to the cart
  function addToCart(button) {
      const productContainer = button.closest('.product');
      const productName = productContainer.querySelector('h3').textContent;

      // Find the price element and extract the numerical value
      const priceElement = productContainer.querySelector('p[pricetag]');
      const productPrice = parseFloat(priceElement.getAttribute('pricetag'));

      const cartItem = { name: productName, price: productPrice };

      cartItems.push(cartItem);
      updateCartView();
  }

  // Function to remove an item from the cart
  function removeFromCart(index) {
      cartItems.splice(index, 1);
      updateCartView();
  }

  // Function to update the cart view
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

          // Add event listener to the remove button
          const removeBtn = listItem.querySelector('.removeBtn');
          removeBtn.addEventListener('click', () => removeFromCart(index));

          total += item.price;
      });

      totalPriceElement.textContent = `Total: ${total.toFixed(2)} kr.`;

      openCart();
  }

  // Function to open the cart modal
  function openCart() {
      cartModal.style.width = '250px'; // Set the width as desired
  }

  // Function to close the cart modal
  function closeCart() {
      cartModal.style.width = '0';
  }

  // Function to open the payment form
  function openPaymentForm() {
    // Close the cart modal
    closeCart();

    // Set the display property of the payment form to 'block'
    document.getElementById('paymentForm').style.display = 'block';
}
});
