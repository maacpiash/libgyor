// These methods are responsible for the database queries only.
// Their responsibilities are separate from the other parts
// of the program (e.g. handling http requests)

'use strict';

// DB
const mysql = require('mysql');

// Data model
const Book = require('./book.js');

/*** *** *** GET api/books/{id} *** *** ***/
function get(mysqlConfig, id, doWhateverWith) {
  let connection = mysql.createConnection(mysqlConfig);
  try {
    connection.connect(function(err) {
      if (err) throw err;
    });
  } catch (error) {
    console.log('SQL ERROR: Connection failed.');
    console.log(error);
    return;
  }
  let param = id ? ' WHERE id = ' + id : '';
  let sqlStr = 'SELECT * FROM books' + param;

  try {
    connection.query(sqlStr, function(error, result, fields) {
      if (error) throw error;
      doWhateverWith(JSON.stringify(result));
    });
    //return retVal; // 
  } catch (error) {
    console.log('SQL ERROR: Query failed.');
    console.log(error);
  } finally { // The connection has to end, no matter how the query went
    connection.end();
  }
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
