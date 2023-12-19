const express = require("express");
const path = require("path");
const userRoute = express.Router();

const bcrypt = require('bcrypt');

const { connection, Request, TYPES } = require('../db/db');


// til cookie 
const cookieParser = require("cookie-parser");
userRoute.use(cookieParser());


//login

userRoute.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "../../client/pages/login.html"));
});

userRoute.get("/login.js", (req, res) => {
  res.sendFile(path.join(__dirname, "../../client/scripts/login.js"));
});


//register

userRoute.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "../../client/pages/register.html"));
});

userRoute.get("/register.js", (req, res) => {
  res.sendFile(path.join(__dirname, "../../client/scripts/register.js"));
});


//profilePage

userRoute.get("/profilePage", (req, res) => {
  res.sendFile(path.join(__dirname, "../../client/pages/profilePage.html"));
});


//userOrderHistory

userRoute.get("/userOrderHistory", (req, res) => {
  res.sendFile(path.join(__dirname, "../../client/pages/userOrderHistory.html"));
});


//order

userRoute.get("/order", (req, res) => {
  res.sendFile(path.join(__dirname, "../../client/pages/order.html"));
});

userRoute.get("/order.js", (req, res) => {
  res.sendFile(path.join(__dirname, "../../client/scripts/order.js"));
});


//customize_juice

userRoute.get("/customize_juice", (req, res) => {
  res.sendFile(path.join(__dirname, "../../client/pages/customize_juice.html"));
});

userRoute.get("/customizeJuice.js", (req, res) => {
  //res.header('Content-Type', 'text/javascript');
  res.sendFile(path.join(__dirname, "../../client/scripts/customizeJuice.js"));
});


//cart

userRoute.get("/cart.js", (req, res) => {
  //res.header('Content-Type', 'text/javascript');
  res.sendFile(path.join(__dirname, "../../client/scripts/cart.js"));
}); 


//chat

userRoute.get("/juicechat", (req, res) => {
  res.sendFile(path.join(__dirname, "../../client/pages/juicechat.html"));
});


userRoute.get('/juicechat.js', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/scripts/juicechat.js'));
}); 


//css

userRoute.get("/global.css", (req, res) => {
  res.sendFile(path.join(__dirname, "../../client/styles/global.css"));
});


//til email

const { sendMail } = require('../../client/scripts/email.js');  // Importerer sendMail-funktionen

// API-endepunkt for at sende en bekræftelses-e-mail
userRoute.post('/sendConfirmationEmail', async (req, res) => {
  try {
    const { name, telefonnummer, email, orderDetails } = req.body;  // Modtager data fra anmodningen

    // Opretter e-mail-indhold baseret på de modtagne oplysninger
    const subject = 'Order Confirmation';
    const text = `Dear ${name},\n\nThank you for your order.\n\nDetails: ${orderDetails}\n\nBest regards,\nSocialJoe`;

    // Sender e-mail
    await sendMail(email, subject, text);

    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Fejl ved afsendelse af e-mail:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Til registrering af bruger, herunder hashing af password

userRoute.post("/user", async (req, res) => {
  const data = req.body;

  const saltRounds = 10;

  const hash = await bcrypt.hash(data.password, saltRounds);

  console.log('Hashed password:', hash);

      const request = new Request(
        'INSERT INTO Users (username, email, phonenumber, passwordhashed) VALUES (@username, @email, @phonenumber, @passwordhashed);',
        (err) => {
          if (err) {
            console.error('Error inserting user into SQL database:', err.message);
            res.status(500).send('Internal Server Error');
          } else {
            res.send('User added');
          }
        }
      );

      request.addParameter('username', TYPES.VarChar, data.username);
      request.addParameter('email', TYPES.VarChar, data.email);
      request.addParameter('phonenumber', TYPES.VarChar, data.phonenumber);
      request.addParameter('passwordhashed', TYPES.VarChar, hash);

      connection.execSql(request);
    });


//Til at hente en bruger baseret på username

async function getUserByUsername(username) {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT username, passwordhashed
      FROM Users
      WHERE username = @username
    `;

    const user = {
      username: null,
      passwordhashed: null,
    };

    const request = new Request(sql, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(user);
      }
    });

    request.addParameter('username', TYPES.VarChar, username);

    request.on('row', (columns) => {
      columns.forEach((column) => {
        user[column.metadata.colName] = column.value;
      });
    });

    connection.execSql(request);
  });
}


//Til autentificering og login af bruger

userRoute.post("/login", async (req, res) => {
  let username = req.body.username;
  let password = req.body.password;

  if (username && password) {
    try {
      console.log("Received login request from user with username:", username);
      const user = await getUserByUsername(username);

      if (user.username == username) {
        const isPasswordMatch = await bcrypt.compare(password, user.passwordhashed);

        if (isPasswordMatch) {
          console.log(`User ${username} logged in!`);
          const brugerUsername = user.username;

          console.log("Username:", brugerUsername);
          res.cookie('Username', brugerUsername, { httpOnly: true });

          res.status(200).json({
            userExists: true,
            status: "success",
            message: "User logged in"
          });
        } else {
          console.log(`User ${username} entered wrong credentials!`);
          res.status(401).json({ message: 'Wrong username or password!' });
        }
      } else {
        console.log(`User ${username} does not exist!`);
        res.status(401).json({ message: 'Wrong username or password!' });
      }
      res.end();
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ message: 'Internal Server Error' });
      res.end();
    }
  } else {
    console.log('Enter username and password!');
    res.status(400).json({ message: 'Wrong username or password!' });
    res.end();
  }
});


module.exports = userRoute;












