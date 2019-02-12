// These methods are responsible for the database queries only.
// Their responsibilities are separate from the other parts
// of the program (e.g. handling http requests)

// DB
const mysql = require('mysql');

// Data model
const Book = require('./book.js');

/*** *** *** GET api/books/{id} *** *** ***/
function get(mysqlConfig, args) {
  // args = ['api', 'books', '2' (optional)]
  let connection = mysql.createConnection(mysqlConfig);
  connection.connect(function(err) {
    if (err) throw err;
    console.log('Connected!');
    let sqlStr =
      args.length == 3
        ? 'SELECT * FROM books'
        : 'SELECT * FROM books WHERE id = ' + args[2];
    connection.query(sqlStr, function(error, result, fields) {
      if (err) throw err;
      console.log('RESULT', JSON.stringify(result));
    });
  });
}

/*** *** *** POST api/books/{id} *** *** ***/
function post(mysqlConfig, details) {
  //
  let returnVal = '';
  let connection = mysql.createConnection(mysqlConfig);
  connection.connect(function(error) {
    if (error) throw error;
    console.log('Connected!');
  });
  let year = details['year'] || details['_year'];
  let price = details['price'] || details['_price'];

  let sqlStr =
    'INSERT INTO books (name, author, description, year, price) ' +
    `VALUES ('${details['name']}', '${details['author']}', ` +
    `'${details['description']}', ${year}, ${price})`;

  connection.query(sqlStr, function(err, result) {
    if (err) throw err;
    console.log('RESULT', result);
    returnVal = '1 record inserted';
  });
  connection.end();
  return returnVal;
}

module.exports = { get, post };
