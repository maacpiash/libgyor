'use strict';

// Server, routing
const express = require('express');
const cors = require('cors');

// DBCtrl
const DbCtrl = require('./dbController');

// MySQL Configuration
let mysqlConfig = {
  host: 'localhost',
  user: 'root',
  password: '1212',
  database: 'booksdb'
};

const PORT = 1416;
const ROUTE = '/api/books/';

let server = express();

server.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'ACL, CANCELUPLOAD, CHECKIN, CHECKOUT, COPY, DELETE, GET, HEAD, LOCK, MKCALENDAR, MKCOL, MOVE, OPTIONS, POST, PROPFIND, PROPPATCH, PUT, REPORT, SEARCH, UNCHECKOUT, UNLOCK, UPDATE, VERSION-CONTROL');
  res.header('Access-Control-Allow-Headers', 'Overwrite, Destination, Content-Type, Depth, User-Agent, Translate, Range, Content-Range, Timeout, X-File-Size, X-Requested-With, If-Modified-Since, X-File-Name, Cache-Control, Location, Lock-Token, If');
  res.header('Access-Control-Expose-Headers', 'DAV, content-length, Allow');
  next();
});

server.use(express.json());


// Error handler middleware: Necessary key(s) check
// POST method must have ALL those keys
// PUT method must have AT LEAST ONE of those keys
server.use(ROUTE, function (req, res, next) {
  const dbKeys = [ 'name', 'author', 'description', 'year', 'price' ];
  let allMissing = true; // whether all the valid keys exist
  let oneMissing = false; // whether there is at least one valid key

  for (let k of dbKeys) {
    if (k in req.body)
      allMissing = false;
    else
      oneMissing = true;
  }

  if ((req.method == 'POST' && oneMissing) || (req.method == 'PUT' && allMissing)) {
    console.log(new Date().toLocaleString(), 'POST', '400');
    res.writeHead('400', { 'Content-Type': 'application/json' });
    res.end('{ "Error from middleware": "Key(s) missing." }');
  } else {
    next();
  }
});
// End of middleware

server.get(ROUTE, (req, res) => {
  let timeStamp = new Date().toLocaleString();
  DbCtrl.Get(mysqlConfig, undefined, (status, payload) => {
    res.writeHead(status, { 'Content-Type': 'application/json' });
    res.end(payload);
    console.log(timeStamp, 'GET', status);
  });
});

server.get(ROUTE + ':id', (req, res) => {
  let id = req.params.id;
  DbCtrl.Get(mysqlConfig, id, (status, payload) => {
    res.writeHead(status, { 'Content-Type': 'application/json' });
    res.end(payload);
    console.log(new Date().toLocaleString(), 'GET', status);
  });
});

server.post(ROUTE, (req, res) => {
  DbCtrl.Post(mysqlConfig, JSON.stringify(req.body), (status, payload) => {
    res.writeHead(status, { 'Content-Type': 'application/json' });
    res.end(payload);
    console.log(new Date().toLocaleString(), 'POST', status);
  });
});

server.put(ROUTE + ':id', (req, res) => {
  DbCtrl.Put(mysqlConfig, req.params.id, JSON.stringify(req.body), (status, response) => {
    res.writeHead(status, { 'Content-Type': 'application/json' });
    res.end(response);
    console.log(new Date().toLocaleString(), 'PUT', status);
  });
});

server.delete(ROUTE + ':id', (req, res) => {
  DbCtrl.Delete(mysqlConfig, req.params.id, (status, response) => {
    res.writeHead(status, { 'Content-Type': 'application/json' });
    res.end(response);
    console.log(new Date().toLocaleString(), 'DELETE', status);
  });
});

server.listen(PORT, console.log(`Server started on port ${PORT}`));