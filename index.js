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

  // let data = '';
  // req.on('data', chunk => console.log('Chunk', chunk.toString()));
  // console.log('Data', data);
  // console.log('Body', req.body);
  let response = '';
  let method = req.method;

  switch (method) {
  case 'GET':
    DbCtrl.Get(mysqlConfig, undefined, function (books) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.write(books);
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
    // TODO
    break;

  case 'DELETE':
    if (args.length < 3) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.write('Must provide ID of the book to be deleted.');
      res.end();
    }
    DbCtrl.Delete(mysqlConfig, args[2], function(response) {
      console.log(response);
      DbCtrl.Get(mysqlConfig, undefined, function (books) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.write(books);
        res.end();
      });
    });
    
    break;

  default:
    console.log('Invalid request method.');
    break;
  }

  // console.log('Return value: ' + returnValue);
  // res.write(returnValue); // This line throws an exception.
  
  //res.end();
});

server.listen(PORT, console.log(`Server started on port ${PORT}`));
