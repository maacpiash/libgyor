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

  if (args.length < 2) {
    console.log('Invalid URL');
    process.exit();
  }
  else {
    if (args[0].toLowerCase() != 'api' && args[1].toLowerCase() != 'books') {
      console.log(`Invalid URL ${args[0]}/${args[1]}`);
      process.exit();
    }
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
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.write('Book not found.');
      }
      res.end();
    });
    break;

  case 'POST':
    req.on('data', body => DbCtrl.Post(mysqlConfig, JSON.parse(body.toString('utf8')), function (response) {
      if (response == 201) {
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end();
      }
    }));
    break;

  case 'PUT':
    req.on('data', body => DbCtrl.Put(mysqlConfig, id, JSON.parse(body.toString('utf8')), function (response) {
      if (response == 200) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end();
      } else {
        console.log(response);
        res.end();
      }
    }));
    break;

  case 'DELETE':
    if (!id) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.write('Must provide ID of the book to be deleted.');
      res.end();
    } else {
      DbCtrl.Delete(mysqlConfig, args[2], function(response) {
        console.log(response);
        DbCtrl.Get(mysqlConfig, undefined, function (books) {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.write(books);
          res.end();
        });
      });
    }    
    break;

  default:
    console.log('Invalid request method.');
    res.end();
    break;
  }
});

server.listen(PORT, console.log(`Server started on port ${PORT}`));
