'use strict';

const http = require('http');
const Book = require('./book.js');
// let fileMan = require('fs');

http
  .createServer(function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(
      '<h2>Hello, World Wide Web!</h2><h4>This is Libgyor, your friendly-neighborhood library manager.</h4>'
    );
    res.end();
  })
  .listen(31416);
