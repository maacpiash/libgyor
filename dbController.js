// These methods are responsible for the database queries only.
// Their responsibilities are separate from the other parts
// of the program (e.g. handling http requests)

'use strict';

// DB
const mysql = require('mysql');

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
    console.log('SQL ERROR: Connection failed. ', error);
    return callBack(503);
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
    console.log('SQL ERROR: Query failed.');
    console.log(error);
    return callBack(400);
  } finally { // The connection has to end, no matter how the query went
    connection.end();
  }
}

/*** *** *** POST api/books/{id} *** *** ***/

function Post(mysqlConfig, details, callBack) {
  // Check JSON validity before db connection
  let dbKeys = ['name', 'author', 'description', 'year', 'price'];
  let jsKeys = Object.keys(details);
  let contains = true;
  dbKeys.forEach(k => contains = contains && jsKeys.includes(k));
  if (!contains)
    // Not all necessary keys are available in JSON
    return callBack(400); // Bad request

  let connection = mysql.createConnection(mysqlConfig);
  try {
    connection.connect(error => { if (error) throw error; });
  } catch (error) {
    console.log('SQL ERROR: Connection failed.\n', error);
    return callBack(503);
  }

  let sqlStr =
    'INSERT INTO books (name, author, description, year, price) ' +
    `VALUES ('${details['name']}', '${details['author']}', ` +
    `'${details['description']}', ${details['year']}, ${details['price']});`;

  try {
    connection.query(sqlStr, function(err, result) {
      if (err) throw err;
      return callBack(201);
    });
  } catch (error) {
    console.log('SQL ERROR: Query failed.\n', error);
    return callBack(400);
  } finally { // The connection has to end, no matter how the query went
    connection.end();
  }
}

/*** *** *** PUT api/books/id *** *** ***/

function Put(mysqlConfig, id, details, callBack) {
  let connection = mysql.createConnection(mysqlConfig);

  if(!id) return callBack(400);

  // [1] Check if connection is successful

  try {
    connection.connect(function(error) {
      if (error) throw error;
    });
  } catch (error) {
    console.log('SQL ERROR: Connection failed.');
    console.log(error);
    return callBack(503);
  }

  let sqlStr = 'UPDATE books SET ';
  let suffix = ' WHERE id = ' + id + ';';
  let keys = Object.keys(details);

  // [2] Check if JSON is valid

  try {
    let flag = false;

    if (keys.includes('name'))  { flag = true; sqlStr += 'name = "' + details['name'] + '", '; }
    if (keys.includes('author'))  { flag = true; sqlStr += 'author = "' + details['author'] + '", '; }
    if (keys.includes('description')) { flag = true; sqlStr += 'description = "' + details['description'] + '", '; }
    if (keys.includes('year')) { flag = true; sqlStr += 'year = ' + details['year'].toString() + ', '; }
    if (keys.includes('price')) { flag = true; sqlStr += 'price = ' + details['price'].toString() + ', '; }

    sqlStr = sqlStr.substring(0, sqlStr.length - 2); // Removing the last comma
    sqlStr += suffix;

    if (!flag)
      throw 'Invalid key(s)';
  } catch (error) {
    console.log(error);
    return callBack(400);
  }

  // [3] Check if query is executed successfully

  try {
    connection.query(sqlStr, function(err, result) {
      if (err) throw err;
      if (!result.affectedRows)
        return callBack(404);
      else
        return callBack(204);
    });
  } catch (error) {
    console.log('SQL ERROR: Query failed.');
    console.log(error);
    return callBack(400);
  } finally { // The connection has to end, no matter how the query went
    connection.end();
  }
}

/*** *** *** DELETE api/books/id *** *** ***/

function Delete(mysqlConfig, id, callBack) {
  let connection = mysql.createConnection(mysqlConfig);
  try {
    connection.connect(function(error) {
      if (error) throw error;
    });
  } catch (error) {
    console.log('SQL ERROR: Connection failed.');
    console.log(error);
    return callBack(503);
  }

  let sqlStr = 'DELETE FROM books WHERE id = ' + id;
  try {
    connection.query(sqlStr, function(err, result) {
      if (err) throw err;
      console.log(result);
      if (!result.affectedRows)
        return callBack(404);
      else
        return callBack(204);
    });
  } catch (error) {
    console.log('SQL ERROR: Query failed.');
    return callBack(400);
  } finally { // The connection has to end, no matter how the query went
    connection.end();
  }
}

module.exports = { Get, Post, Put, Delete };
