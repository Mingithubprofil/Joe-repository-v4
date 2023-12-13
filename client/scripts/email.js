

// Henter nodemailer-biblioteket

const nodemailer = require('nodemailer');

// Tilføjer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',  // Bruger 'gmail' som service
  auth: {
    user: 'socialjoejuice@gmail.com',
    pass: 'kaqbqxohhrkwxprq',
  },
});

// Tilføjer funktion til afsendelse af mailbesked

const sendMail = async (to, subject, text) => {
  try {
    // Tilføjer afsenders mail samt tilhørende parametre
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

// Eksporterer funktionen til andre filer
module.exports = {
  sendMail,
};

