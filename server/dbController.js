// These methods are responsible for the database queries only.
// Their responsibilities are separate from the other parts
// of the program (e.g. handling http requests)

'use strict';

// DB
const mysql = require('mysql');

// HTTP status codes
const _200 = (id, action) => `{"Message": "Record with id ${id} was ${action}"}\n`;
const _201 = '{"Message": "Record created."}\n';
const _404 = (id) => `{"Error": "Record with id ${id} not found"}\n`;
const _400 = (e) => `{"Error": "Invalid ${e}."}\n`;
const _500 = '{"Error": "SQL error (Query failed)."}\n';
const _503 = '{"Error": "SQL error (Connection failed)."}\n';

/*** *** *** GET api/books/{id} *** *** ***/

function Get(mysqlConfig, id, callBack) {
  // Establish connection
  let connection = mysql.createConnection(mysqlConfig);
  connection.connect(function (err) {
    if (err) return callBack(503, _503);
    // Now, query
    let param = id ? ' WHERE id = ' + id : '';
    let sqlStr = 'SELECT * FROM books' + param + ';';
    let keys = [];
    let arr = [];
    let stuff = '';

    try {
      connection.query(sqlStr, function (error, result) {
        if (error) return (400, _400('query'));
        stuff = JSON.stringify(result, null, 2);
        arr = JSON.parse(stuff);
        keys = arr.map(item => item['id']); // from JSON back to array to array of ids
        if (id && !keys.includes(parseInt(id))) return callBack(404, _404(id)); // Not found!
        if (id)
          // in case of a single-item query, return an object, not an array of a single object 
          stuff = JSON.stringify(arr[0], null, 2);
        return callBack(200, stuff + '\n');
      });
    } catch (error) {
      console.log(error);
    } finally {
      // The connection has to end, no matter how the query went
      connection.end();
    }
  });
}

/*** *** *** POST api/books/{id} *** *** ***/

function Post(mysqlConfig, details, callBack) {
  // Check JSON validity before db connection

  try {
    details = JSON.parse(details);
  } catch (e) {
    return callBack(400, _400('JSON (syntax error)'));
  }

  let dbKeys = ['name', 'author', 'description', 'year', 'price'];
  let jsKeys = Object.keys(details);
  let contains = true;
  dbKeys.forEach(k => (contains = contains && jsKeys.includes(k) && details[k]));
  if (!contains)
    // Not all necessary keys are available in JSON
    return callBack(400, _400('JSON (keys missing)'));

  let connection = mysql.createConnection(mysqlConfig);
  connection.connect(error => {
    if (error) return callBack(503, _503);
    let sqlStr = 'INSERT INTO books (name, author, description, year, price) ' +
      `VALUES ('${details['name']}', '${details['author']}', ` +
      `'${details['description']}', ${details['year']}, ${details['price']});`;

    try {
      connection.query(sqlStr, function (err, result) {
        if (err) return callBack(400, _400('query'));
        return callBack(201, _201);
      });
    } catch (error) {
      console.log(error);
      return callBack(500, _500);
    } finally {
      // The connection has to end, no matter how the query went
      connection.end();
    }
  });
}

/*** *** *** PUT api/books/id *** *** ***/

function Put(mysqlConfig, id, details, callBack) {
  if (!id) return callBack(400);

  let sqlStr = 'UPDATE books SET ';
  let suffix = ' WHERE id = ' + id + ';';

  // [2] Check if JSON is valid

  try {
    details = JSON.parse(details);
  } catch (e) {
    return callBack(400, _400('JSON (syntax error)'));
  }

  try {
    let dbKeys = ['name', 'author', 'description', 'year', 'price'];
    let jsKeys = Object.keys(details);
    let hasMinOneKey = false;

    // 'keys' need to have at least one valid key included
    dbKeys.forEach(k => {
      if (jsKeys.includes(k)) {
        hasMinOneKey = true;
        sqlStr += `${k} = "${details[k]}", `;
      }
    });

    sqlStr = sqlStr.substring(0, sqlStr.length - 2); // Removing the last comma
    sqlStr += suffix;

    if (!hasMinOneKey) return callBack(400, _400('JSON (keys missing)'));
  } catch (error) {
    console.log(error);
  }

  // [3] Check if query is executed successfully

  let connection = mysql.createConnection(mysqlConfig);
  connection.connect(function (error) {
    if (error) return callBack(503, _503);
    try {
      connection.query(sqlStr, function (err, result) {
        if (err) return callBack(400, _400('query'));
        if (!result.affectedRows) return callBack(404, _404(id));
        else return callBack(200, _200(id, 'modified'));
      });
    } catch (error) {
      console.log(error);
      return callBack(500, _500);
    } finally {
      // The connection has to end, no matter how the query went
      connection.end();
    }
  });
}

/*** *** *** DELETE api/books/id *** *** ***/

function Delete(mysqlConfig, id, callBack) {
  let connection = mysql.createConnection(mysqlConfig);
  connection.connect(function (error) {
    if (error) return callBack(503, _503);
    let sqlStr = 'DELETE FROM books WHERE id = ' + id;
    try {
      connection.query(sqlStr, function (err, result) {
        if (err) callBack(400, _400('query'));
        if (!result.affectedRows) return callBack(404, _404(id));
        else return callBack(200, _200(id, 'deleted'));
      });
    } catch (error) {
      console.log(error);
      return callBack(500, _500);
    } finally {
      // The connection has to end, no matter how the query went
      connection.end();
    }
  });
}

module.exports = { Get, Post, Put, Delete };
