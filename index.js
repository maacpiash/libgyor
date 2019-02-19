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
  let message = '';
  let body = [];
  let timeStamp = new Date().toLocaleString();
  let item = '';

  switch (method) {
  case 'GET':
    DbCtrl.Get(mysqlConfig, id, function (books) {
      if (books != 404) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(books);
        console.log(timeStamp, method, '200');
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Book not found.');
        console.log(timeStamp, method, '404');
      }      
    });
    break;

  case 'POST':
    
    body = [];
    req.on('data', chunk => body.push(chunk))
      .on('end', () => {
        if(!body.length) {
          res.writeHead(400, { 'Content-Type': 'text/plain' });
          res.end('Empty body');
          console.log(timeStamp, method, 'Empty body');
        } else {
          DbCtrl.Post(mysqlConfig, Buffer.concat(body).toString('utf8'), function (response) {
            if (response == 201) {
              res.writeHead(201, { 'Content-Type': 'text/plain' });
              res.end('Entry created.');
            } else if (typeof response == 'string') {
              res.writeHead(400, { 'Content-Type': 'text/plain' });
              res.end(response);
            } else {
              res.writeHead(response, { 'Content-Type': 'text/plain' });
              message = response >= 500 ? 'Sorry, something went wrong.' : 'Invalid request.';
              res.end(message);
            }
            console.log(timeStamp, method, response);
          });
        }
      });    
    break;

  case 'PUT':
    if (!id) {
      res.writeHead(400, { 'Content-Type': 'text/plain' }); // Bad request
      console.log(timeStamp, method, 400, 'No ID');
      res.end('Must provide ID of the book to be deleted.');
    } else {
      body = [];
      req.on('data', chunk => body.push(chunk))
        .on('end', () => {
          if(!body.length) {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end('Empty body');
            console.log(timeStamp, method, 'Empty body');
          } else {
            DbCtrl.Put(mysqlConfig, id, body.toString('utf8'), function (response) {
              if (typeof response == 'string') {
                message = response;
                response = 400;
              } else switch(response) {
              case 204:
                message = 'Book detail(s) modified.';
                break;
              case 400:
                message = 'Bad request';
                break;
              case 404:
                message = 'Book not found';
                break;
              case 503:
                message = 'SQL ERROR: Connection failed.';
                break;
              default:
                break;
              }   
              console.log(timeStamp, method, response);
              res.writeHead(response, { 'Content-Type': 'text/plain' });
              res.end(message);
            });
          }
        });
      }
    break;

  case 'DELETE':
    if (!id) {
      res.writeHead(400, { 'Content-Type': 'text/plain' }); // Bad request
      console.log(timeStamp, method, 400);
      res.end('Must provide ID of the book to be deleted.');
    } else {
      DbCtrl.Delete(mysqlConfig, args[2], function (response) {
        console.log(timeStamp, method, response);
        res.writeHead(response, { 'Content-Type': 'text/plain' });
        res.end(`Book with id ${id} deleted.`);
      });
    }
    break;

  default:
    console.log(`Invalid request ${method}.`);
    res.writeHead(400, { 'Content-Type': 'text/plain' }); // Bad request
    res.write('Request method is not acceptable. Only GET, POST, PUT, DELETE methods are accepted.');
    console.log(timeStamp, method, 400);
    res.end();
    break;
  }
});

server.listen(PORT, console.log(`Server started on port ${PORT}`));
