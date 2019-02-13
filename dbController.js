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
  let sqlStr = 'SELECT * FROM books' + param + ';';
  let keys = [];
  let stuff = '';

  try {
    connection.query(sqlStr, function(error, result) {
      if (error) throw error;
      stuff = JSON.stringify(result, null, 2) + '\n';
      keys = JSON.parse(stuff).map(item => item['id']); // from JSON back to array to array of ids
      if (id && !keys.includes(parseInt(id)))
        return callBack(404); // Not found!
      return callBack(stuff);
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
    `'${details['description']}', ${year}, ${price});`;

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

function Put(mysqlConfig, id, details, callBack) {
  let returnVal = 500;
  let connection = mysql.createConnection(mysqlConfig);

  if(!id) return callBack('Must have ID');

  // [1] Check if connection is successful

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

  let sqlStr = 'UPDATE books SET ';
  let suffix = ' WHERE id = ' + id + ';';
  let keys = Object.keys(details);

  // [2] Check if JSON is valid
  try {
    
    if (keys.includes('name'))  sqlStr += 'name = "' + details['name'] + '", ';
    if (keys.includes('author'))  sqlStr += 'author = "' + details['author'] + '", ';
    if (keys.includes('description'))  sqlStr += 'description = "' + details['description'] + '", ';
    
    if (keys.includes('year') || keys.includes('_year'))
      sqlStr += 'year = ' + (details['year'] || details['_year']) + ', ';
    
    if (keys.includes('price') || keys.includes('_price'))
      sqlStr += 'price = ' + (details['price'] || details['_price']) + ', ';

    sqlStr = sqlStr.substring(0, sqlStr.length - 2);
    sqlStr += suffix;
    console.log('MySQL', sqlStr);

  } catch (error) {
    console.log(error);
    return callBack('Invalid JSON');
  }

  // [3] Check if query is executed successfully

  try {
    connection.query(sqlStr, function(err, result) {
      if (err) throw err;
      returnVal = 200;
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

module.exports = { Get, Post, Put, Delete };
