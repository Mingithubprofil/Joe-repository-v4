const express = require("express");
const path = require("path");
const userRoute = express.Router();


//const db = require('../db/db.js');

const { connection, Request, TYPES } = require('../db/db');



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


// Funktion til at tjekke autentificering
const checkAuth = async (username, password) => {
  try {
    // Tjekker om username og password er til stede
    if (!username || !password) {
      return false;
    }

    //const sql = `SELECT id, username, password FROM Users WHERE username = @username AND password = @password`;
    const sql = `SELECT id, username, password FROM Users WHERE username = '${username}' AND password = '${password}'`;


    console.log("Executing SQL query:", sql);

    const request = new Request(sql, (err, rowCount, rows) => {
      if (err) {
        console.error('Fejl ved login i SQL-database:', err.message);
        return Promise.reject(err);
      } else {
        console.log("SQL-query udført uden fejl");
        const user = rows.map(row => ({
          id: row[0].value,
          username: row[1].value,
          password: row[2].value,
        }));
        console.log("Alle rækker fra databasen:", rows);
        console.log("Resultater af SQL-query:", user);

        return user.length > 0;
      }
    });

    request.addParameter('username', TYPES.VarChar, username);
    request.addParameter('password', TYPES.VarChar, password);
    console.log("Parametre bundet til SQL-query:", request.parameters);

    return new Promise((resolve, reject) => {
      connection.execSql(request);
    });
  } catch (error) {
    console.error('Fejl ved checkAuth:', error);
    return false;
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


