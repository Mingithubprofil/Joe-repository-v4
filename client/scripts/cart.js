document.addEventListener("DOMContentLoaded", function () {
    let cart = [];
    let totalPrice = 0;
  
    const addToCartButtons = document.querySelectorAll(".product button");
  
    const cartModal = document.getElementById("cartModal");
    const cartItemsList = document.getElementById("cartItems");
    const totalPriceDisplay = document.getElementById("totalPrice");
  
    addToCartButtons.forEach((button, index) => {
      button.addEventListener("click", function () {
        const product = {
          index: index + 1,
          name: document.querySelectorAll(".product h3")[index].textContent,
          price: parseFloat(
            document.querySelectorAll(".product p")[index * 2 + 2].textContent.replace("Pris: ", "").replace(" kr.", "")
          ),
        };
  
        cart.push(product);
        totalPrice += product.price;
  
        updateCartDisplay();
        alert(`Added ${product.name} to the cart!`);
      });
    });
  
    function updateCartDisplay() {
      cartItemsList.innerHTML = "";
      cart.forEach((product) => {
        const listItem = document.createElement("li");
        listItem.textContent = `${product.name} - ${product.price} kr.`;
        cartItemsList.appendChild(listItem);
      });
  
      totalPriceDisplay.textContent = `Total: ${totalPrice.toFixed(2)} kr.`;
    }
  
    // Open the cart modal
    document.getElementById("cartIcon").addEventListener("click", function () {
      cartModal.style.display = "block";
    });
  
    // Close the cart modal
    document.querySelector(".close").addEventListener("click", function () {
      cartModal.style.display = "none";
    });
  
    // Close the cart modal if the user clicks outside of it
    window.addEventListener("click", function (event) {
      if (event.target === cartModal) {
        cartModal.style.display = "none";
      }
    });
  });
  