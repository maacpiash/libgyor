// These methods are responsible for the database queries only.
// Their responsibilities are separate from the other parts
// of the program (e.g. handling http requests)

'use strict';

// DB
const mysql = require('mysql');

// Data model
const Book = require('./book.js');

/*** *** *** GET api/books/{id} *** *** ***/
function Get(mysqlConfig, id, callBack) {
  let returnVal = '';
  // Establish connection
  let connection = mysql.createConnection(mysqlConfig);
  try {
    connection.connect(function(err) {
      if (err) throw err;
    });
  } catch (error) {
    returnVal = 'SQL ERROR: Connection failed.';
    console.log(returnVal);
    console.log(error);
    return returnVal(returnVal);
  }

  // Now, query
  let param = id ? ' WHERE id = ' + id : '';
  let sqlStr = 'SELECT * FROM books' + param;

  try {
    connection.query(sqlStr, function(error, result) {
      if (error) throw error;
      return callBack(JSON.stringify(result));
    });
  } catch (error) {
    returnVal = 'SQL ERROR: Query failed.';
    console.log(returnVal);
    console.log(error);
    return callBack(returnVal);
  } finally { // The connection has to end, no matter how the query went
    connection.end();
  }
}

/*** *** *** POST api/books/{id} *** *** ***/
function Post(mysqlConfig, details, callBack) {
  //
  let returnVal = 500;
  let connection = mysql.createConnection(mysqlConfig);
  try {
    connection.connect(function(error) {
      if (error) throw error;
    });
  } catch (error) {
    returnVal = 'SQL ERROR: Connection failed.';
    console.log(returnVal);
    console.log(error);
    return callBack(returnVal);
  }
  let year = details['year'] || details['_year'];
  let price = details['price'] || details['_price'];

  let sqlStr =
    'INSERT INTO books (name, author, description, year, price) ' +
    `VALUES ('${details['name']}', '${details['author']}', ` +
    `'${details['description']}', ${year}, ${price})`;

  try {
    connection.query(sqlStr, function(err, result) {
      if (err) throw err;
      returnVal = 201;
      return callBack(returnVal);
    });
  } catch (error) {
    returnVal = 'SQL ERROR: Query failed.';
    console.log(returnVal);
    console.log(error);
    return callBack(returnVal);
  } finally { // The connection has to end, no matter how the query went
    connection.end();
  }
}

/*** *** *** PUT api/books/id *** *** ***/
function Put(mysqlConfig, sqlQuery, callBack) {

}

/*** *** *** DELETE api/books/id *** *** ***/
function Delete(mysqlConfig, id, callBack) {
  let returnVal = '';
  let connection = mysql.createConnection(mysqlConfig);
  try {
    connection.connect(function(error) {
      if (error) throw error;
    });
  } catch (error) {
    returnVal = 'SQL ERROR: Connection failed.';
    console.log(returnVal);
    console.log(error);
    return callBack(returnVal);
  }

  let sqlStr = 'DELETE FROM books WHERE id = ' + id;
  try {
    connection.query(sqlStr, function(err, result) {
      if (err) throw err;
      console.log(result);
      return callBack('OK');
    });
  } catch (error) {
    returnVal = 'SQL ERROR: Query failed.';
    console.log(error);
    return callBack(returnVal);
  } finally { // The connection has to end, no matter how the query went
    connection.end();
  }
}

module.exports = { Get, Post, Delete };
