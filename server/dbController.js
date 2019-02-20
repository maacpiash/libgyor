// These methods are responsible for the database queries only.
// Their responsibilities are separate from the other parts
// of the program (e.g. handling http requests)

'use strict';

// DB
const mysql = require('mysql');

/*** *** *** GET api/books/{id} *** *** ***/

function Get(mysqlConfig, id, callBack) {
  // Establish connection
  let connection = mysql.createConnection(mysqlConfig);
  try {
    connection.connect(function (err) {
      if (err) throw err;
      // Now, query
      let param = id ? ' WHERE id = ' + id : '';
      let sqlStr = 'SELECT * FROM books' + param + ';';
      let keys = [];
      let arr = [];
      let stuff = '';

      try {
        connection.query(sqlStr, function (error, result) {
          if (error) throw error;
          stuff = JSON.stringify(result, null, 2) + '\n';
          arr = JSON.parse(stuff);
          keys = arr.map(item => item['id']); // from JSON back to array to array of ids
          if (id && !keys.includes(parseInt(id))) return callBack(404); // Not found!
          if (id) stuff = JSON.stringify(arr[0], null, 2);
          return callBack(stuff);
        });
      } catch (error) {
        console.log('SQL ERROR: Query failed.');
        console.log(error);
        return callBack(400);
      } finally {
        // The connection has to end, no matter how the query went
        connection.end();
      }
    });
  } catch (error) {
    console.log('SQL ERROR: Connection failed. ', error);
    return callBack(503);
  }
}

/*** *** *** POST api/books/{id} *** *** ***/

function Post(mysqlConfig, details, callBack) {
  // Check JSON validity before db connection

  try {
    details = JSON.parse(details);
  } catch (e) {
    return callBack('Invalid JSON : Syntax error.');
  }

  let dbKeys = ['name', 'author', 'description', 'year', 'price'];
  let jsKeys = Object.keys(details);
  let contains = true;
  dbKeys.forEach(k => (contains = contains && jsKeys.includes(k)));
  if (!contains)
    // Not all necessary keys are available in JSON
    return callBack('Invalid JSON : Keys missing.'); // Bad request

  let connection = mysql.createConnection(mysqlConfig);
  try {
    connection.connect(error => {
      if (error) throw error;
      let sqlStr = 'INSERT INTO books (name, author, description, year, price) ' +
        `VALUES ('${details['name']}', '${details['author']}', ` +
        `'${details['description']}', ${details['year']}, ${details['price']});`;

      try {
        connection.query(sqlStr, function (err, result) {
          if (err) throw err;
          return callBack(201);
        });
      } catch (error) {
        console.log('SQL ERROR: Query failed.\n', error);
        return callBack(400);
      } finally {
        // The connection has to end, no matter how the query went
        connection.end();
      }
    });
  } catch (error) {
    console.log('SQL ERROR: Connection failed.\n', error);
    return callBack(503);
  }
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
    return callBack('Invalid JSON');
  }

  try {
    let keys = Object.keys(details);
    let flag = false;

    // 'keys' need to have at least one valid key included
    if (keys.includes('name')) {
      flag = true;
      sqlStr += 'name = "' + details['name'] + '", ';
    }
    if (keys.includes('author')) {
      flag = true;
      sqlStr += 'author = "' + details['author'] + '", ';
    }
    if (keys.includes('description')) {
      flag = true;
      sqlStr += 'description = "' + details['description'] + '", ';
    }
    if (keys.includes('year')) {
      flag = true;
      sqlStr += 'year = ' + details['year'].toString() + ', ';
    }
    if (keys.includes('price')) {
      flag = true;
      sqlStr += 'price = ' + details['price'].toString() + ', ';
    }

    sqlStr = sqlStr.substring(0, sqlStr.length - 2); // Removing the last comma
    sqlStr += suffix;

    if (!flag) throw 'Invalid key(s)';
  } catch (error) {
    return callBack(error);
  }

  // [3] Check if query is executed successfully

  let connection = mysql.createConnection(mysqlConfig);

  try {
    connection.connect(function (error) {
      if (error) throw error;
      try {
        connection.query(sqlStr, function (err, result) {
          if (err) throw err;
          if (!result.affectedRows) return callBack(404);
          else return callBack(204);
        });
      } catch (error) {
        console.log('SQL ERROR: Query failed.');
        console.log(error);
        return callBack(500);
      } finally {
        // The connection has to end, no matter how the query went
        connection.end();
      }
    });
  } catch (error) {
    console.log(error);
    return callBack(503);
  }
}

/*** *** *** DELETE api/books/id *** *** ***/

function Delete(mysqlConfig, id, callBack) {
  let connection = mysql.createConnection(mysqlConfig);
  try {
    connection.connect(function (error) {
      if (error) throw error;
      let sqlStr = 'DELETE FROM books WHERE id = ' + id;
      try {
        connection.query(sqlStr, function (err, result) {
          if (err) throw err;
          if (!result.affectedRows) return callBack(404);
          else return callBack(204);
        });
      } catch (error) {
        console.log('SQL ERROR: Query failed.');
        return callBack(400);
      } finally {
        // The connection has to end, no matter how the query went
        connection.end();
      }
    });
  } catch (error) {
    console.log('SQL ERROR: Connection failed.');
    console.log(error);
    return callBack(503);
  }
}

module.exports = { Get, Post, Put, Delete };
