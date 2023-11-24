

// email.js

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',  // Brug 'gmail' eller konfigurer SMTP-indstillingerne for din mail-udbyder
  auth: {
    user: 'socialjoejuice@gmail.com',
    pass: 'kaqbqxohhrkwxprq',
  },
});

const sendMail = async (to, subject, text) => {
  try {
    const mailOptions = {
      from: 'SocialJoe <socialjoejuice@gmail.com>',
      to,
      subject,
      text,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log('E-mail sendt:', info.messageId);
  } catch (error) {
    console.error('Fejl ved afsendelse af e-mail:', error);
  }
};

module.exports = {
  sendMail,
};
