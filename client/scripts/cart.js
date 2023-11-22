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
    orderTextElement.innerText = `På denne side kan du bestille en juice fra vores lækre menu i ${selectedCity}!`;
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
  betalBtn.addEventListener('click', openPaymentForm);

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

  function openCart() {
    cartModal.style.width = '250px';
  }

  function closeCart() {
    cartModal.style.width = '0';
  }

  function openPaymentForm() {
    closeCart();
    document.getElementById('paymentForm').style.display = 'block';
  }

  function updatePaymentTotal(total) {
    if (paymentTotalElement) {
      paymentTotalElement.textContent = `Total beløb: ${total.toFixed(2)} kr.`;
    }
  }
});


function submitPayment() {
  const accountSid = 'AC12cb9761bd22a85b3994135bbcc68e65';
  const authToken = 'bdbc23653559799ad052af1277f0091a';
  const client = new Twilio(accountSid, authToken);

  const name = document.getElementById("name").value;
  const telefonnummer = document.getElementById("telefonnummer").value;

  client.messages
    .create({
      body: `Hej ${name}, det er JOE. I dag er der tilbud på Juicen. Kom ind i vores cafe og prøv den.`,
      messagingServiceSid: 'MG178da6c222de9ec03486b61a2e72c85e',
      to: telefonnummer
    })
    .then(message => {
      console.log(message);
      showOrderConfirmation();
    });
}

function showOrderConfirmation() {
  document.getElementById('paymentForm').style.display = 'none';
  document.getElementById('orderConfirmation').style.display = 'block';
  const selectedLocation = document.getElementById("cities").value;

  const orderConfirmation = document.getElementById("orderConfirmation");
  if (orderConfirmation) {
    const selectedLocationElement = orderConfirmation.querySelector("#selectedLocation");

    if (selectedLocationElement) {
      selectedLocationElement.innerText = selectedLocation;
    }

    orderConfirmation.style.display = "block";
  }
}

function hideOrderConfirmation() {
  document.getElementById("orderConfirmation").style.display = "none";
}

function closepaymentPopup() {
  document.getElementById('paymentForm').style.display = 'none';
}

function closeorderConfirmation() {
  document.getElementById('orderConfirmation').style.display = 'none';
}
