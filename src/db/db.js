

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

// Forbind til SQL-databasen
connection.connect((err) => {
  if (err) {
    console.error('Fejl ved forbindelse til SQL-database:', err.message);
  } else {
    console.log('Forbundet til SQL-database');
  }
});

module.exports = connection;








/*

//database

const { Connection, Request } = require('tedious');


// Konfigurationsoplysninger for forbindelsen 
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
    encrypt: true, // Aktiver kryptering
    database: 'hjemmesidedatabase',
    trustServerCertificate: false, // Brug kun i udviklingsmiljøer
  },
};


// Opretter forbindelse
const connection = new Connection(config);


// Event-lytter til 'connect' - dette udløses, når der oprettes forbindelse til databasen
connection.on('connect', (err) => {
  if (err) {
    console.error('Fejl ved forbindelse til Azure SQL Database:', err);
  } else {
    console.log('Forbundet til Azure SQL Database');

    // Udfør SQL-operationer her (indsæt, opdater, hent, slet data)
    executeStatement();
  }
});


/*

// Funktion til at udføre en SQL-forespørgsel (test af forbindelse til databasen)
function executeStatement() {
  const request = new Request('SELECT * FROM Users', (err, rowCount) => {
    if (err) {
      console.error('Fejl ved udførelse af SQL-forespørgsel:', err);
    } else {
      console.log(`${rowCount} rækker returneret`);
    }

    connection.close(); // Luk forbindelsen, når operationen er afsluttet
  });

  // Event-lytter til 'row' - dette udløses, når en række returneres fra databasen
  request.on('row', (columns) => {
    columns.forEach((column) => {
      console.log(`${column.metadata.colName}: ${column.value}`);
    });
  });

  // Udfør SQL-forespørgslen
  connection.execSql(request);
}





function executeStatement(sql, parameters) {
  return new Promise((resolve, reject) => {
    const request = new Request(sql, (err, rowCount) => {
      if (err) {
        console.error('Fejl ved udførelse af SQL-forespørgsel:', err);
        reject(err);
      } else {
        console.log(`${rowCount} rækker returneret`);
        resolve(); // Opfyld løftet, når operationen er afsluttet uden fejl
      }
    });

    // Tilknyt parameterne til forespørgslen, hvis de er defineret
    if (parameters && parameters.length > 0) {
      parameters.forEach((param) => {
        request.addParameter(param.name, param.type, param.value);
      });
    }

    // Event-lytter til 'row' - dette udløses, når en række returneres fra databasen
    request.on('row', (columns) => {
      columns.forEach((column) => {
        console.log(`${column.metadata.colName}: ${column.value}`);
      });
    });

    // Tilføj event-lytter til 'doneInProc', så vi kan håndtere slutningen af en forespørgsel med flere resultater
    request.on('doneInProc', () => {
      resolve(); // Opfyld løftet, når operationen er afsluttet uden fejl
    });

    // Udfør SQL-forespørgslen
    connection.execSql(request);
  });
}



// Event-lytter til 'end' som udløses, når forbindelsen afsluttes
connection.on('end', () => {
  console.log('Forbindelsen er afsluttet');
});


// Til at håndtere fejl ved forbindelse
connection.on('error', (err) => {
  console.error('Forbindelsesfejl:', err);
});


// Til at åbne forbindelsen
connection.connect();


*/