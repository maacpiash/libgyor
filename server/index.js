'use strict';

// Server, routing
const express = require('express');

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
server.use(express.json());

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
