



/*function submitPayment() {

const accountSid = 'AC12cb9761bd22a85b3994135bbcc68e65';
const authToken = 'a762494ae79bad3c353db3fcd9b840f0';
const client = require('twilio')(accountSid, authToken);

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



