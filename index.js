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

  let data = '';
  res.on('data', chunk => data += chunk);
  
  let method = req.method;

  switch (method) {
  case 'GET':
    
    break;

  case 'POST':
    // TODO
    break;

  case 'PUT':
    // TODO
    break;

  case 'DELETE':
    // TODO
    break;

  default:
    console.log('Invalid request method.');
    break;
  }

  console.log('Return value: ' + returnValue);
  res.write(returnValue); // This line throws an exception.
  res.writeHead(200, { 'Content-Type': 'text/json' });
  res.end();
});

server.listen(PORT, console.log(`Server started on port ${PORT}`));
