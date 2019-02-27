'use strict';

// Server, routing, cors, log
const express = require('express');
const cors = require('cors');

// Database Service
const service = require('./service');

// Error creation and handling
const createError = require('http-errors');
const appErrorHandler = require('./app-error-handler');

const LISTEN_PORT = process.env.LISTEN_PORT || 4000;

let app = express();

app.use(cors());

app.use(express.json());

app.get('/api/books', (req, res, next) => {
  service.getAll(function(err, result) {
    if (err) return next(createError(404, 'Book not found'));
    res.status(200);
    res.send(result);
    next();
  });
});

app.get('/api/books/:id', (req, res, next) => {
  service.get(req.params.id, function(err, result) {
    if (err) return next(err);
    res.status(200);
    res.send(result);
    next();
  });
});

app.post('/api/books', (req, res, next) => {
  service.post(req.body, function (err, result) {
    if (err) return next(err);
    res.status(201);
    res.send({result});
    next();
  });
});

app.put('/api/books/:id', (req, res, next) => {

  // DbCtrl.Put(mysqlConfig, req.params.id, JSON.stringify(req.body), (status, response) => {
  //   res.writeHead(status, { 'Content-Type': 'application/json' });
  //   res.end(response);
  //   next();
  // });
});

app.delete('/api/books/:id', (req, res) => {
  // DbCtrl.Delete(mysqlConfig, req.params.id, (status, response) => {
  //   res.writeHead(status, { 'Content-Type': 'application/json' });
  //   res.end(response);
  //   console.log(new Date().toLocaleString(), 'DELETE', status);
  // });
});

app.use('/api/books', (req, res, next) => {
  console.log(new Date().toLocaleString(), req.method, res.statusCode);
  next();
});

app.use(appErrorHandler);


app.listen(LISTEN_PORT, console.log(`Server started on port ${LISTEN_PORT}`));