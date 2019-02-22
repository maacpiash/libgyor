'use strict';

// Server, routing
const http = require('http');

// DBCtrl
const DbCtrl = require('./dbController');

let mysqlConfig = {
  host: 'localhost',
  user: 'root',
  password: '1212',
  database: 'booksdb'
};

const PORT = 1416;

const server = http.createServer();

server.on('request', (req, res) => {
  let args = req.url.slice(1).split('/');
  if (args.length < 2 || args[0].toLowerCase() != 'api' || args[1].toLowerCase() != 'books') {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.write('{"error": "Invalid URL"}\n');
    res.end();
  }

  let method = req.method;
  let id = args[2] || undefined;
  let body = [];
  let timeStamp = new Date().toLocaleString();

  switch (method) {
  case 'GET':
    DbCtrl.Get(mysqlConfig, id, function (status, payload) {
      res.writeHead(status, { 'Content-Type': 'application/json' });
      res.end(payload);
      console.log(timeStamp, method, status);
    });
    break;

  case 'POST':
    
    body = [];
    req.on('data', chunk => body.push(chunk))
      .on('end', () => {
        if(!body.length) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end('{"Error": "Empty body"}\n');
          console.log(timeStamp, method, '400');
        } else {
          DbCtrl.Post(mysqlConfig, Buffer.concat(body).toString('utf8'), function (status, response) {
            res.writeHead(status, { 'Content-Type': 'application/json' });
            res.end(response);
            console.log(timeStamp, method, status);
          });
        }
      });    
    break;

  case 'PUT':
    if (!id) {
      res.writeHead(400, { 'Content-Type': 'application/json' }); // Bad request
      res.end('{"Error": "Must provide ID of the book to be deleted."}');
      console.log(timeStamp, method, '400');
    } else {
      body = [];
      req.on('data', chunk => body.push(chunk))
        .on('end', () => {
          if(!body.length) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end('{"Error": "Empty body"}\n');
            console.log(timeStamp, method, '400');
          } else {
            DbCtrl.Put(mysqlConfig, id, body.toString('utf8'), function (status, response) {
              console.log(timeStamp, method, status);
              res.writeHead(status, { 'Content-Type': 'application/json' });
              res.end(response);
            });
          }
        });
    }
    break;

  case 'DELETE':
    if (!id) {
      res.writeHead(400, { 'Content-Type': 'application/json' }); // Bad request
      res.end('{"Error": "Must provide ID of the book to be deleted."}');
      console.log(timeStamp, method, "400");
    } else {
      DbCtrl.Delete(mysqlConfig, args[2], function (status, response) {
        res.writeHead(status, { 'Content-Type': 'application/json' });
        res.end(response);
        console.log(timeStamp, method, status);
      });
    }
    break;

  default:
    res.writeHead(405, { 'Content-Type': 'application/json' }); // Bad request
    res.write(`"Error": "Request method ${method} is not acceptable. Only GET, POST, PUT, DELETE methods are accepted."`);
    console.log(timeStamp, method, 405);
    res.end();
    break;
  }
});

server.listen(PORT, console.log(`Server started on port ${PORT}`));