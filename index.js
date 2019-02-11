'use strict';

// Server, routing
const http = require('http');

// DB
const mysql = require('mysql');

// Data model
const Book = require('./book.js');

let connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1212',
  database: 'booksdb'
});

/*
connection.connect(function(error) {
  if (error) throw error;
  console.log('Connected!');
  // let sql =
  //   'CREATE TABLE books (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), author VARCHAR(255), description VARCHAR(511), year INT, price INT)';
  // connection.query(sql, function(err, res) {
  //   if (err) throw err;
  //   console.log('Table created!');
  // });
});
*/

let sqlStr = '';
let validPaths = ['books'];
const PORT = 1416;

const server = http.createServer();

server.on('request', (req, res) => {
  let args = req.url.slice(1).split('/');

  if (!validPaths.includes(args[0].toLowerCase())) {
    console.log(`Invalid URL ${args[0]}`);
    process.exit();
  }

  let returnValue = '';

  let method = req.method;

  switch (method) {
  case 'GET':
    connection.connect(function(err) {
      if (err) throw err;
      console.log('Connected!');
      sqlStr = args.length == 1 ? 'SELECT * FROM books' : 'SELECT * FROM books WHERE id = ' + args[1];
      connection.query(sqlStr, function(error, result, fields) {
        if (err) throw err;
        returnValue = JSON.stringify(result);
        console.log('Books: ' + returnValue);
      });
    });
    break;

  case 'POST':
    // TODO
    break;

  case 'PUT':
    // TODO
    break;

  case 'DELETE':
    // TODO
    break;

  default:
    console.log('Invalid request method.');
    break;
  }

  console.log('Return value: ' + returnValue);
  res.write(returnValue); // This line throws an exception.
  res.writeHead(200, { 'Content-Type': 'text/json' });
  res.end();
});

server.listen(PORT, console.log(`Server started on port ${PORT}`));
