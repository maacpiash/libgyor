const test = require('./dbController.js');

let clrs = {
  name: 'Introduction to Algorithms',
  author: 'CLRS',
  description: 'Algorithm',
  year: 2019,
  price: 400
};

let krC = {
  name: 'The C Programming Language',
  author: 'K&R',
  description: 'C programming',
  year: 2019,
  price: 300
};

let mmm = {
  name: 'Digital Logic and Computer Design',
  author: 'M. Morris Mano',
  description: 'DLD',
  year: 2019,
  price: 250
};

let sqlConfig = {
  host: 'localhost',
  user: 'root',
  password: '1212',
  database: 'booksdb'
};

// console.log(book['name']);

// let args = ['api', 'books'];

// test.get(sqlConfig, args);

test.post(sqlConfig, mmm);


/*
let body = '';
req.on('data', chunk => body += chunk.toString()); // convert Buffer to string
*/