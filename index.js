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
    res.write(`Invalid URL ${args[0]}/${args[1]}`);
    res.end();
  }

  let method = req.method;
  let id = args[2] || undefined;

  switch (method) {
    case 'GET':
      DbCtrl.Get(mysqlConfig, id, function (books) {
        if (books != 404) {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.write(books);
        } else {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.write('Book not found.');
        }
        res.end();
      });
      break;

    case 'POST':
      req.on('data', body => DbCtrl.Post(mysqlConfig, JSON.parse(body.toString('utf8')), function (response) {
        if (response == 201) {
          res.writeHead(201, { 'Content-Type': 'text/plain' });
          res.write('Entry created.');
        } else {
          res.write(response >= 500 ? 'Sorry, something went wrong.' : 'Invalid ');
          res.writeHead(response, { 'Content-Type': 'text/plain' });
        }
        res.end();
      }));
      break;

    case 'PUT':
      req.on('data', body => DbCtrl.Put(mysqlConfig, id, JSON.parse(body.toString('utf8')), function (response) {
        console.log(response);
        res.writeHead(response, { 'Content-Type': 'application/json' });
        res.end();
      }));
      break;

    case 'DELETE':
      if (!id) {
        res.writeHead(400, { 'Content-Type': 'application/json' }); // Bad request
        res.write('Must provide ID of the book to be deleted.');
        res.end();
      } else {
        DbCtrl.Delete(mysqlConfig, args[2], function (response) {
          console.log(response);
          res.writeHead(response, { 'Content-Type': 'application/json' });
          res.end();          
        });
      }
      break;

    default:
      console.log('Invalid request method.');
      res.writeHead(400, { 'Content-Type': 'text/plain' }); // Bad request
      res.write('Request method is not acceptable. Only GET, POST, PUT, DELETE methods are accepted.');
      res.end();
      break;
  }
});

server.listen(PORT, console.log(`Server started on port ${PORT}`));
