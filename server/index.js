'use strict';

// Server, routing
const express = require('express');
const cors = require('cors');

// DBCtrl
const DbCtrl = require('./dbController');
const service = require('./service');
const appErrorHandler = require('./app-error-handler');

// MySQL Configuration
let mysqlConfig = {
  host: 'localhost',
  user: 'root',
  password: '1212',
  database: 'booksdb'
};

const LISTEN_PORT = process.env.LISTEN_PORT || 1416;
const ROUTE = '/api/books/';

let app = express();

app.use(cors());

app.use(express.json());

app.use(appErrorHandler);

// Error handler middleware: Necessary key(s) check
// POST method must have ALL those keys
// PUT method must have AT LEAST ONE of those keys
// server.use(ROUTE, function (req, res, next) {
//   const dbKeys = [ 'name', 'author', 'description', 'year', 'price' ];
//   let allMissing = true; // whether all the valid keys exist
//   let oneMissing = false; // whether there is at least one valid key
//
//   for (let k of dbKeys) {
//     if (k in req.body)
//       allMissing = false;
//     else
//       oneMissing = true;
//   }
//
//   if ((req.method == 'POST' && oneMissing) || (req.method == 'PUT' && allMissing)) {
//     console.log(new Date().toLocaleString(), 'POST', '400');
//     res.writeHead('400', { 'Content-Type': 'application/json' });
//     res.end('{ "Error from middleware": "Key(s) missing." }');
//   } else {
//     next();
//   }
// });
// End of middleware

app.get('/api/books', (req, res) => {
  let timeStamp = new Date().toLocaleString();
  DbCtrl.Get(mysqlConfig, undefined, (status, payload) => {
    res.writeHead(status, { 'Content-Type': 'application/json' });
    res.end(payload);
    console.log(timeStamp, 'GET', status);
  });
});

app.get('/api/books/:id', (req, res, next) => {
  const id = req.params.id;
  service.get(id, function (err, book) {
    if (err) return next(err);
    res.send(book);
  });
});

app.post(ROUTE, (req, res) => {
  DbCtrl.Post(mysqlConfig, JSON.stringify(req.body), (status, payload) => {
    res.writeHead(status, { 'Content-Type': 'application/json' });
    res.end(payload);
    console.log(new Date().toLocaleString(), 'POST', status);
  });
});

app.put(ROUTE + ':id', (req, res) => {
  DbCtrl.Put(mysqlConfig, req.params.id, JSON.stringify(req.body), (status, response) => {
    res.writeHead(status, { 'Content-Type': 'application/json' });
    res.end(response);
    console.log(new Date().toLocaleString(), 'PUT', status);
  });
});

app.delete(ROUTE + ':id', (req, res) => {
  DbCtrl.Delete(mysqlConfig, req.params.id, (status, response) => {
    res.writeHead(status, { 'Content-Type': 'application/json' });
    res.end(response);
    console.log(new Date().toLocaleString(), 'DELETE', status);
  });
});

app.listen(LISTEN_PORT, console.log(`Server started on port ${LISTEN_PORT}`));