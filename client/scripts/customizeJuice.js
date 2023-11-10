document.addEventListener('DOMContentLoaded', function () {
    const addToCartButtons = document.querySelectorAll('.product button');
    const cartItemsContainer = document.getElementById('cart-items');

    addToCartButtons.forEach(button => {
        button.addEventListener('click', addToCart);
    });

    function addToCart(event) {
        const product = event.target.closest('.product');
        const productName = product.querySelector('h3').innerText;
        const productPrice = product.querySelector('p:last-child').innerText;

        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        cartItem.innerHTML = `
            <img src="${product.querySelector('img').src}" alt="${productName}">
            <div>
                <p>${productName}</p>
                <p>${productPrice}</p>
            </div>
            <button class="remove-button" onclick="removeFromCart(this)">Fjern</button>
        `;

        cartItemsContainer.appendChild(cartItem);
    }

    function removeFromCart(button) {
        const cartItem = button.closest('.cart-item');
        cartItemsContainer.removeChild(cartItem);
    }
});
