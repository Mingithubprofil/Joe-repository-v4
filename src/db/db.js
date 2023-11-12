

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



