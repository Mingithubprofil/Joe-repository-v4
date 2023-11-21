const express = require("express");
const path = require("path");
const userRoute = express.Router();


//const db = require('../db/db.js');

const { connection, Request, TYPES } = require('../db/db');



// Cookie implementation
const cookieParser = require("cookie-parser");
userRoute.use(cookieParser());


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

/*
// Funktion til at tjekke autentificering
const checkAuth = async (username, password) => {
  try {
    console.log("Received login request with username:", username, "and password:", password);
    // Tjekker om username og password er til stede
    if (!username || !password) {
      return false;
    }

    //console.log("Connection state:", connection.state.name);

    const sql = `SELECT id, username, password FROM Users WHERE username = @username AND password = @password`;
    //const sql = `SELECT id, username, password FROM Users WHERE username = '${username}' AND password = '${password}'`;
    //const sql = `SELECT id, username, password FROM Users WHERE username = 'amigo' AND password = 'Amigo'`;

    console.log("Executing SQL query:", sql);
    console.log("Before SQL query execution");
    const request = new Request(sql, (err, rowCount, rows) => {
      console.log("Inside SQL query callback");
      if (err) {
        console.error('Fejl ved login i SQL-database:', err.message);
        return false;
      } else {
        console.log("SQL-query udført uden fejl");
        console.log("Antal rækker fra databasen:", rowCount);
        console.log("Resultater af SQL-query:", rows);
        const user = rows.map(row => ({
          id: row[0].value,
          username: row[1].value,
          password: row[2].value,
        }));
        console.log("Alle rækker fra databasen:", rows);
        console.log("Resultater af SQL-query:", user);

        if (user.length > 0) {
          console.log("Authentication successful.");
          return true;
        } else {
          console.log("Authentication failed.");
          return false;
        }
      }
    });

    request.addParameter('username', TYPES.VarChar, username);
    request.addParameter('password', TYPES.VarChar, password);
    console.log("Parametre bundet til SQL-query:", request.parameters);

    await new Promise((resolve, reject) => {
      connection.execSql(request, (err, rowCount, rows) => {
        if (err) {
          console.error('Fejl ved udførelse af SQL-query:', err.message);
          reject(err);
        } else {
          console.log("Executed SQL query successfully.");
          resolve(rowCount > 0);
        }
      });
    });
  } catch (error) {
    console.error('Fejl ved checkAuth:', error);
    return false;
  }
}; */

/*
// Funktion til at hente data fra azure sql-database 
async function getUserByUsernameAndPassword(username, password) {
  const query = `
    SELECT user_id, username, password
    FROM Users
    WHERE username = '${username}' AND password = '${password}'
  `;
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(query);
    }, 5000); // Simulerer en 5 sekunders forsinkelse, udskift dette med den faktiske databaseforespørgsel
  });
} */


// Funktion til at hente data fra azure sql-database 
async function getUserByUsernameAndPassword(username, password) {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT user_id, username, password
      FROM Users
      WHERE username = '${username}' AND password = '${password}'
    `;
    
    const request = new Request(sql, (err, rowCount, rows) => {
      if (err) {
        reject(err);
      } else {
        const users = rows.map(row => ({
          user_id: row[0].value,
          username: row[1].value,
          password: row[2].value,
        }));
        resolve(users);
      }
    });

    connection.execSql(request);
  });
}

// Login-endpoint med autentificering
userRoute.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    console.log("Received login request with username:", username, "and password:", password);

    // Funktion til at tjekke autentificering
    const hentBrugerId = await getUserByUsernameAndPassword(username, password);

    if (hentBrugerId) {
      console.log(`Bruger ${username} logged ind!`);
      console.log("User data in authentication:", hentBrugerId);

      const brugerId = hentBrugerId[0].user_id;
      const brugerUsername = hentBrugerId[0].username;
      const brugerPassword = hentBrugerId[0].user_password;

      console.log("User ID:", brugerId);
      console.log("Username:", brugerUsername);
      console.log("Password:", brugerPassword);

      res.cookie('brugerId', brugerId, { httpOnly: true });

      res.status(200).json({ userExists: true, status: "success", message: "User logged in", userId: brugerId, username: brugerUsername, password: brugerPassword });
    } else {
      console.log(`User ${username} skrev forkert!`);
      res.status(401).json({ message: 'Forkert bruger eller kode!' });
    }
  } catch (error) {
    console.error('Fejl ved login:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

/*
// Endpoint og funktion til autentificering
userRoute.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    console.log("Received login request with username:", username, "and password:", password);

    // Funktion til at tjekke autentificering
    const checkAuth = (username, password) => {
      console.log("Received login request with username:", username, "and password:", password);

      if (username && password) {
        // Brug .then() og .catch() til at håndtere promise
        getUserByUsernameAndPassword(username, password)
          .then((hentBrugerId) => {
            if (hentBrugerId && hentBrugerId.length > 0) {
              console.log(`Bruger ${username} logged ind!`);
              console.log("User data in authentication:", hentBrugerId);

              const brugerId = hentBrugerId[0].user_id;
              const brugerUsername = hentBrugerId[0].username;
              const brugerPassword = hentBrugerId[0].user_password;

              console.log("User ID:", brugerId);
              console.log("Username:", brugerUsername);
              console.log("Password:", brugerPassword);

              res.status(201).json({ userId: brugerId, username: brugerUsername, password: brugerPassword });
            } else {
              console.log(`User ${username} skrev forkert!`);
              res.status(400).json({ message: 'Forkert bruger eller kode!' });
            }
          })
          .catch((error) => {
            console.error('Database error: ' + error.stack);
            res.status(500).send('Database error!');
          });
      } else {
        console.log('Skriv brugernavn og kode!');
        res.status(400).json({ message: 'Forkert bruger eller kode!' });
      }
    };

    // Middleware funktion til at tjekke autentificering
    const isAuthenticated = await checkAuth(username, password);

    console.log({ isAuthenticated });

    if (!isAuthenticated) {
      return res.status(401).send("Unauthorized");
    }

    // Resten af din kode (håndtering af login)

    return res.status(200).json({ userExists: true, status: "success", message: "User logged in" });
  } catch (error) {
    console.error('Fejl ved login:', error);
    return res.status(500).send('Internal Server Error');
  }
});
*/

/*

// Funktion til autentificering
const checkAuth = async (username, password) => {
  try {
    console.log("Received login request with username:", username, "and password:", password);

    if (username && password) {
      const hentBrugerId = await getUserByUsernameAndPassword(username, password);

      if (hentBrugerId && hentBrugerId.length > 0) {
        console.log(`Bruger ${username} logged ind!`);
        console.log("User data in authentication:", hentBrugerId);

        const brugerId = hentBrugerId[0].user_id;
        const brugerUsername = hentBrugerId[0].username;
        const brugerPassword = hentBrugerId[0].user_password;

        console.log("User ID:", brugerId);
        console.log("Username:", brugerUsername);
        console.log("Password:", brugerPassword);

        response.status(201).json({ userId: brugerId, username: brugerUsername, password: brugerPassword });
      } else {
        console.log(`User ${username} skrev forkert!`);
        response.status(400).json({ message: 'Forkert bruger eller kode!' });
      }
      response.end();
    } else {
      console.log('Skriv brugernavn og kode!');
      response.status(400).json({ message: 'Forkert bruger eller kode!' });
    }
  } catch (error) {
    console.error('Database error: ' + error.stack);
    response.send('Database error!');
    response.end();
  }
};



// Login-endpoint med autentificering
userRoute.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    console.log("Received login request with username:", username, "and password:", password);

    // Middleware funktion til at tjekke autentificering
    const isAuthenticated = await checkAuth(username, password);

    console.log({ isAuthenticated });


    if (!isAuthenticated) {
      return res.status(401).send("Unauthorized");
    }

    // Resten af din kode (håndtering af login)

    return res.status(200).json({ userExists: true, status: "success", message: "User logged in" });
  } catch (error) {
    console.error('Fejl ved login:', error);
    return res.status(500).send('Internal Server Error');
  }
});

*/



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


