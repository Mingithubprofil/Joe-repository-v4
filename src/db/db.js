

const sql = require('mssql');

const config = {
  user: 'admin20',
  password: 'Kodetdatabase20',
  server: 'servertilhjemmeside.database.windows.net',
  database: 'hjemmesidedatabase',
  options: {
    encrypt: true, // Sørg for at aktivere kryptering
  },
};


async function connectAndQuery() {
    try {
      // Opret forbindelse til databasen
      const pool = await sql.connect(config);
      console.log('Forbundet til Azure SQL Database');
  
      // Opret en forespørgsel
      const result = await pool.request().query('SELECT * FROM Users');
      
      // Log resultatet af forespørgslen
      console.log('Data fra databasen:', result.recordset);
    } catch (err) {
      // Håndter fejl ved forbindelse eller forespørgsel
      console.error('Fejl ved forbindelse til Azure SQL Database:', err.message);
      console.error('Fejldetaljer:', err);
    } finally {
      // Luk forbindelsen ved afslutning af din applikation
      sql.close();
      console.log('Forbindelse til Azure SQL Database lukket ved afslutning.');
    }
  }
  
  // Kør funktionen
  connectAndQuery();
  


/*

sql.connect(config)
  .then(pool => {
    console.log('Forbundet til Azure SQL Database');

    // Udfør SQL-operationer her (indsæt, opdater, hent, slet data)
    return pool.request().query('SELECT * FROM Users');
  })
  .then(result => {
    console.log('Data fra databasen:', result.recordset);
  })  
  .catch(err => {
    console.error('Fejl ved forbindelse til Azure SQL Database:', err);
    console.error('Fejlbesked:', err.message); // Tilføj fejlmeddelelsen til logningen
    console.error('Fejldetaljer:', err);
  })
  .finally(() => {
    // Luk forbindelsen ved afslutning af din applikation
    //sql.close();
    console.log('Forbindelse til Azure SQL Database lukket ved afslutning.');
  });

  */


/* 

//Luk forbindelsen ved afslutning af din applikation

process.on('SIGINT', () => {
  sql.close();
  console.log('Forbindelse til Azure SQL Database lukket ved afslutning.');
  process.exit();
});

*/



