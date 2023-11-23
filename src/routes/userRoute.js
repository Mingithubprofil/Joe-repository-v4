const express = require("express");
const path = require("path");
const userRoute = express.Router();

//const bcrypt = require('bcrypt');

const { connection, Request, TYPES } = require('../db/db');


// Cookie implementation
const cookieParser = require("cookie-parser");
userRoute.use(cookieParser());

//til sms
//const { MessagingResponse } = require('twilio').twiml;
//const twilio = require('twilio');


//let id = 1;
//let db = [];


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


//userHome

userRoute.get("/userHome", (req, res) => {
  res.sendFile(path.join(__dirname, "../../client/pages/userHome.html"));
});

userRoute.get("/userHome.js", (req, res) => {
  res.sendFile(path.join(__dirname, "../../client/scripts/userHome.js"));
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

userRoute.get("/userOrder", (req, res) => {
  res.sendFile(path.join(__dirname, "../../client/pages/userOrder.html"));
});


//customize_juice

userRoute.get("/customize_juice", (req, res) => {
  res.sendFile(path.join(__dirname, "../../client/pages/customize_juice.html"));
});

userRoute.get("/customizeJuice.js", (req, res) => {
  //res.header('Content-Type', 'text/javascript');
  res.sendFile(path.join(__dirname, "../../client/scripts/customizeJuice.js"));
});

userRoute.get("/user_customize_juice", (req, res) => {
  res.sendFile(path.join(__dirname, "../../client/pages/user_customize_juice.html"));
});


/* //sms 

userRoute.post("/sms", (req, res) => {
  const twiml = new MessagingResponse();
  twiml.message('Hej, det er Joe');

  res.type('text/xml').send(twiml.toString());
}); */

//location 

userRoute.get("/location.js", (req, res) => {
  //res.header('Content-Type', 'text/javascript');
  res.sendFile(path.join(__dirname, "../../client/scripts/location.js"));
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

/*
//sms

userRoute.post("/submit-order", async (req, res) => {
  try {
    // Hent bestillingsoplysninger fra anmodningen
    const { name, telefonnummer, // andre bestillingsoplysninger } = req.body;

    // Udfør betalingsbehandling eller anden nødvendig logik her

    // Send besked med Twilio
    const client = require('twilio')(accountSid, authToken);
    const accountSid = 'AC12cb9761bd22a85b3994135bbcc68e65';
    const authToken = 'a762494ae79bad3c353db3fcd9b840f0';
    

    client.messages
      .create({
        body: `Hej ${name}, din ordre er nu modtaget og vil blive leveret indenfor 5 minutter. Tak fordi du valgte `,
        messagingServiceSid: 'MG178da6c222de9ec03486b61a2e72c85e',
        to: `+45${telefonnummer}`
      })
      .then(message => {
        console.log(message);
        res.status(200).json({ message: 'Order received. SMS sent.' });
      })
      .catch(error => {
        console.error('Error sending SMS:', error);
        res.status(500).json({ message: 'Internal Server Error' });
      });
  } catch (error) {
    console.error('Error processing order:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}); */


//til registering af bruger (virker fint)

userRoute.post("/user", (req, res) => {
  const data = req.body;

  const request = new Request(
    'INSERT INTO Users (username, password, email, phonenumber) VALUES (@username, @password, @email, @phonenumber);',
    (err) => {
      if (err) {
        console.error('Fejl ved indsættelse af bruger i SQL-database:', err.message);
        res.status(500).send('Internal Server Error');
      } else {
        res.send('User added');
      }
    }
  );

  request.addParameter('username', TYPES.VarChar, data.username);
  request.addParameter('password', TYPES.VarChar, data.password);
  request.addParameter('email', TYPES.VarChar, data.email);
  request.addParameter('phonenumber', TYPES.VarChar, data.phonenumber);


  console.log(request.parameters);

  connection.execSql(request);
});


/*
userRoute.post("/user", async (req, res) => {
  const data = req.body;

  const saltRounds = 10;

  bcrypt.hash(data.password, saltRounds, async function(err, hash) {
    if (err) {
      console.error('Error hashing password:', err);
      res.status(500).send('Internal Server Error');
    } else {
      const request = new Request(
        'INSERT INTO Users (username, password, email, phonenumber) VALUES (@username, @password, @email, @phonenumber);',
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
      request.addParameter('password', TYPES.VarChar, hash); // Gem hashet password
      request.addParameter('email', TYPES.VarChar, data.email);
      request.addParameter('phonenumber', TYPES.VarChar, data.phonenumber);

      connection.execSql(request);
    }
  });
});*/


//til at hente en bestemt profil

userRoute.get("/user/:id", (req, res) => {
  const userId = req.params.id;
  const sql = `SELECT id, username FROM Users WHERE id = @userId`;

  const request = new Request(sql, (err, rowCount, rows) => {
    if (err) {
      console.error('Fejl ved hentning af bruger fra SQL-database:', err.message);
      res.status(500).send('Internal Server Error');
    } else {
      const user = rows.map(row => ({
        id: row[0].value,
        username: row[1].value,
      }));
      res.send(user);
    }
  });

  request.addParameter('userId', TYPES.Int, userId);
  connection.execSql(request);
});


//til at slette en bruger

userRoute.delete("/user/:id", (req, res) => {
  const userId = req.params.id;
  const sql = `DELETE FROM Users WHERE id = @userId`;

  const request = new Request(sql, (err) => {
    if (err) {
      console.error('Fejl ved sletning af bruger i SQL-database:', err.message);
      res.status(500).send('Internal Server Error');
    } else {
      res.send(`User with ID ${userId} deleted`);
    }
  });

  request.addParameter('userId', TYPES.Int, userId);
  connection.execSql(request);
});


//funktion til at hente data fra sql-database

async function getUserByUsernameAndPassword(username, password) {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT username, password
      FROM Users
      WHERE username = @username AND password = @password
    `;

    const user = {
      username: null,
      password: null,
    };

    const request = new Request(sql, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(user);
      }
    });

    request.addParameter('username', TYPES.VarChar, username);
    request.addParameter('password', TYPES.VarChar, password);

    request.on('row', (columns) => {
      columns.forEach((column) => {
        user[column.metadata.colName] = column.value;
      });
    });

    connection.execSql(request);
  });
}

// Login-endpoint med autentificering
userRoute.post("/login", async (req, res) => {
  let username = req.body.username;
  let password = req.body.password;

  if (username && password) {
    try {
      console.log("Received login request from user with username:", username);
      const user = await getUserByUsernameAndPassword(username, password);

      if (user.username == username && user.password == password) {
        console.log(`User ${username} logged in!`);
        //console.log("User data in authentication:", user);

        const brugerUsername = user.username;
        const brugerPassword = user.password;

        console.log("Username:", brugerUsername);
        //console.log("Password:", brugerPassword);

        res.cookie('Username', brugerUsername, { httpOnly: true });

        res.status(200).json({
          userExists: true,
          status: "success",
          message: "User logged in"
          //username: brugerUsername,
          //password: brugerPassword
        });
      } else {
        console.log(`User ${username} entered wrong credentials!`);
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


/*

userRoute
  .get("/user", (req, res) => {
    res.send(db);
  })
  .post("/user", (req, res) => {
    let data = req.body;
    let user = {};
    user = data;
    user.id = id;
    id++;
    db.push(user);
    res.send("User added");
  })
  .get("/user/:id", (req, res) => {
    let response = "";
    let i = 0;
    while (i < db.length) {
      if (req.params.id == db[i].id) {
        response = db[i];
        break;
      }
      i++;
      if (i == db.length) {
        response = "User not found";
      }
    }
    res.send(response);
  })
  .delete("/user/:id", (req, res) => {
    let response = "";
    let i = 0;
    while (i < db.length) {
      if (req.params.id == db[i].id) {
        response = `User with ID ${db[i].id} deleted`;
        db.splice(i, 1);
        // res.send(db[i])
        break;
      }
      i++;
      if (i == db.length) {
        response = "User not found";
      }
    }
    res.send(response);
  })
  .post("/login", (req, res) => {
    let response = "";
    let i = 0;
    while (i < db.length) {
      if (req.body.username == db[i].username) {
        if (req.body.password === db[i].password) {
          response = "User logged in";
        } else {
          response = "Password incorrect";
        }
        break;
      }
      i++;
      if (i == db.length) {
        response = "No user with this username found";
      }
    }
    // res.send(response);

    // Cookie implementation

    res
      .cookie("userAuth", req.body.username ? req.body.username : "", {
        maxAge: 3600000,
      })
      .send(response)
      .status(200);
  });

  */


