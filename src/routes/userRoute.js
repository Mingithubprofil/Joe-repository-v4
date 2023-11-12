const express = require("express");
const path = require("path");
const userRoute = express.Router();


//const db = require('../db/db.js');

const { executeStatement } = require('../db/db');

// Cookie implementation
const cookieParser = require("cookie-parser");
userRoute.use(cookieParser());


let id = 1;
let db = [];


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


// Endpoint for at hente alle brugere
userRoute.get("/user", (req, res) => {
  const sql = 'SELECT * FROM Users';
  executeStatement(sql, () => {
    // Send svar til klienten
    // Antaget at resultaterne af query'en er i en variabel kaldet 'users'
    res.send(users);
  });
});

// Endpoint for at tilføje en ny bruger
userRoute.post("/user", (req, res) => {
  const { username, password } = req.body;

  // Tjek om username og password er til stede i request body
  if (!username || !password) {
    return res.status(400).send("Username and password are required");
  }

  const sql = `INSERT INTO Users (username, password) VALUES ('${username}', '${password}')`;
  executeStatement(sql, () => {
    // Send svar til klienten
    res.send("User added");
  });
});

// Endpoint for at hente en specifik bruger
userRoute.get("/user/:id", (req, res) => {
  const userId = req.params.id;
  const sql = `SELECT * FROM Users WHERE id = ${userId}`;
  executeStatement(sql, () => {
    // Send svar til klienten
    // Antaget at resultaterne af query'en er i en variabel kaldet 'user'
    res.send(user);
  });
});

// Endpoint for at slette en bruger
userRoute.delete("/user/:id", (req, res) => {
  const userId = req.params.id;
  const sql = `DELETE FROM Users WHERE id = ${userId}`;
  executeStatement(sql, () => {
    // Send svar til klienten
    res.send(`User with ID ${userId} deleted`);
  });
});

// Endpoint for login

userRoute.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Tjek om username og password er til stede i request body
  if (!username || !password) {
    return res.status(400).send("Username and password are required");
  }

  const sql = `SELECT * FROM Users WHERE username = '${username}' AND password = '${password}'`;
  executeStatement(sql, () => {
    // Send svar til klienten baseret på resultatet af login-query'en
    // Antaget at resultaterne af query'en er i en variabel kaldet 'user'
    if (user) {
      // Tilføj cookie med brugernavn
      res.cookie("userAuth", username, {
        maxAge: 3600000,
      });

      res.status(200).send("User logged in");
    } else {
      res.status(401).send("Invalid username or password");
    }
  });
});

module.exports = userRoute;


/*

//database 

userRoute.get('/databaseInfo', async (req, res) => {
  try {
    // Kald db-funktionen og log resultatet
    const result = await database.connectAndQuery();
    console.log('Resultat fra database:', result);
    res.send('Se konsollen for resultatet.');
  } catch (error) {
    console.error('Fejl ved at hente data fra database:', error);
    res.status(500).send('Der opstod en fejl.');
  }
}); */

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


