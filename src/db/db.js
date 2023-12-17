

const { Connection, Request, TYPES } = require('tedious');

const config = {
  server: 'servertilhjemmeside.database.windows.net',
  authentication: {
    type: 'default',
    options: {
      userName: 'admin20',
      password: 'Kodetdatabase20',
    },
  },
  options: {
    encrypt: true,
    database: 'hjemmesidedatabase',
    trustServerCertificate: false,
  },
};

const connection = new Connection(config);

// Forbinder til SQL-databasen
connection.connect((err) => {
  if (err) {
    console.error('Fejl ved forbindelse til SQL-database:', err.message);
  } else {
    console.log('Forbundet til SQL-database');
  }
});

console.log("Connection state:", connection.state.name);

module.exports = { connection, Request, TYPES };


