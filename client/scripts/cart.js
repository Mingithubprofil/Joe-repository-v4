document.addEventListener('DOMContentLoaded', function () {
    const addToCartButtons = document.querySelectorAll('.addToCartBtn');
    const cartModal = document.getElementById('cartModal');
    const closeBtn = document.querySelector('.close');
    const cartItemsList = document.getElementById('cartItems');
    const totalPriceElement = document.getElementById('totalPrice');
    const cartIcon = document.getElementById('cartIcon'); // Cart icon ID
    let cartItems = [];
  
    // Event listeners for "Add to Cart" buttons
    addToCartButtons.forEach(button => {
      button.addEventListener('click', () => addToCart(button));
    });
  
    // Event listener for opening the cart modal when clicking the cart icon
    cartIcon.addEventListener('click', openCart);
  
    // Event listener for closing the cart modal
    closeBtn.addEventListener('click', closeCart);
  
    // Function to add an item to the cart
    function addToCart(button) {
      const productName = button.parentElement.querySelector('h3').textContent;
      const productPrice = 63.00; // Set the price accordingly
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
  });
  