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
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.write('Invalid URL');
    res.end();
  }

  let method = req.method;
  let id = args[2] || undefined;
  let body = [];
  
  switch (method.toUpperCase()) {
  case 'GET':
    DbCtrl.Get(mysqlConfig, id, function(books) {
      if (books != 404) {
        console.log(method, 200);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(books);
      } else {
        console.log(method, books);
        res.writeHead(books, { 'Content-Type': 'text/plain' });
        res.write('Book not found.\n');
      }
    });
    res.end();
    break;

  case 'POST':
    req.on('data', chunk => body.push(chunk))
      .on('end', body => {
        if (!body) { // Checking if a body exists.
          console.log('POST 400');
          res.writeHead(400, { 'Content-Type': 'text/plain' });
          res.write('Invalid JSON');
        } else {
          DbCtrl.Post(mysqlConfig, JSON.parse(body.toString('utf8')), function(response) {
            console.log(method, response);
            if (response == 201) {    
              res.writeHead(201, { 'Content-Type': 'text/plain' });
              res.write('Entry created.');
            } else {
              res.writeHead(response, { 'Content-Type': 'text/plain' });
              res.write(response >= 500 ? 'Sorry, something went wrong.' : 'Invalid JSON');
            }
          });
        }
      });
    res.end();
    break;

  case 'PUT':
    req.on('data', chunk => body.push(chunk))
      .on('end', body => {
        if(!body) {
          console.log('PUT 400');
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.write('Invalid JSON');
        } else {
          DbCtrl.Put(mysqlConfig, id, JSON.parse(body.toString('utf8')), function(response) {
            console.log(method, response);
            res.writeHead(response, { 'Content-Type': 'application/json' });
            res.write(response >= 400 ? `No entry with id ${id} found.` : 'Entry modified.');
          });
        }
      });
    res.end();
    break;

  case 'DELETE':
    if (!id) {
      console.log('DELETE 400');
      res.writeHead(400, { 'Content-Type': 'application/json' }); // Bad request
      res.write('Must provide ID of the book to be deleted.');
    } else {
      DbCtrl.Delete(mysqlConfig, args[2], function(response) {
        console.log(method, response);
        res.writeHead(response, { 'Content-Type': 'application/json' });
        res.write(response >= 400 ? `No entry with id ${id} found.` : 'Entry deleted.\n');
      });
    }
    res.end();
    break;

  default:
    console.log(`Invalid request ${method}.`);
    res.writeHead(400, { 'Content-Type': 'text/plain' }); // Bad request
    res.write('Requested method is not acceptable. Only GET, POST, PUT, DELETE methods are accepted.\n');
    res.end();
    break;
  }
});

server.listen(PORT, console.log(`Server started on port ${PORT}`));
