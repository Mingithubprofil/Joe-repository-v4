
/*
//configuration af db

const sql = require('mssql');

const config = {
  user: 'admin20',
  password: 'Kodetdatabase20',
  server: 'servertilhjemmeside.database.windows.net',
  database: 'hjemmesidedatabase',
  options: {
    encrypt: true, 
  },
};

//connection til db

async function connectAndQuery() {
    try {
      // Opretter forbindelse til databasen
      const pool = await sql.connect(config);
      console.log('Forbundet til Azure SQL Database');
  
      // Opretter en forespørgsel for tjek
      const result = await pool.request().query('SELECT * FROM Users');
      
      // Logger resultatet af forespørgslen
      console.log('Data fra databasen:', result.recordset);
    } catch (err) {
      // Håndterer fejl ved forbindelse eller forespørgsel
      console.error('Fejl ved forbindelse til Azure SQL Database:', err.message);
      console.error('Fejldetaljer:', err);
    } finally {
      // Lukker forbindelsen ved afslutning af applikationen
      sql.close();
      console.log('Forbindelse til Azure SQL Database lukket ved afslutning.');
    }
  }
  
  // Til at køre funktionen

  connectAndQuery();
  

/* 

//Til lukning af forbindelsen ved afslutning af applikationen

process.on('SIGINT', () => {
  sql.close();
  console.log('Forbindelse til Azure SQL Database lukket ved afslutning.');
  process.exit();
});

*/

const { Connection, Request } = require('tedious');

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
    encrypt: true, // Sørg for at aktivere kryptering
    database: 'hjemmesidedatabase',
  },
};

const connection = new Connection(config);

connection.on('connect', (err) => {
  if (err) {
    console.error('Fejl ved forbindelse til Azure SQL Database:', err.message);
  } else {
    console.log('Forbundet til Azure SQL Database');

    // Udfør SQL-operationer her (indsæt, opdater, hent, slet data)
    executeStatement();
  }
});

function executeStatement() {
  const request = new Request('SELECT * FROM Users', (err, rowCount) => {
    if (err) {
      console.error('Fejl ved udførelse af SQL-forespørgsel:', err.message);
    } else {
      console.log(`${rowCount} rækker returneret`);
    }

    connection.close();
  });

  request.on('row', (columns) => {
    columns.forEach((column) => {
      console.log(`${column.metadata.colName}: ${column.value}`);
    });
  });

  connection.execSql(request);
}



//database