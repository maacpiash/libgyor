let http = require('http');

http
  .createServer(function(req, res) {
    res.write('Hello, World Wide Web!\nThis is Libgyor, your friendly-neighborhood library manager.');
    res.end();
  })
  .listen(31416);
