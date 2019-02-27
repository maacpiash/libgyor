const mysql = require('mysql');
const createError = require('http-errors');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1212',
  database: 'booksdb',
});

function get(id, cb) {
  connection.query('SELECT * FROM books WHERE id = ?', [id], function(err, result) {
    if (err) return cb(err);
    if (result.length === 0) {
      return cb(createError(404, 'Book not found'));
    }
    return cb(null, result[0]);
  });
}

function getAll(cb) {
  connection.query('SELECT * FROM books', function(err, result) {
    if (err) return cb(err);
    if (result.length === 0) {
      return cb(createError(404, 'Book not found'));
    }
    return cb(null, result);
  });  
}

function post(book, cb) {
  if (!checkKeys(book, true)) return cb(createError(400, 'All keys required.'));
  connection.connect(function(err) {
    if (err) return cb(err);
    let details = [book.name, book.author, book.description, book.year, book.price];
    connection.query(
      'INSERT INTO books (name, author, description, year, price) VALUES (?, ?, ?, ?, ?)', details, function(error, result) {
        if (error) return cb(error);
        return cb(null, result.insertId);
      }
    );
  });
}

function put(id, book, cb) {
  let sqlStr = checkKeys(book, false);
  if (!checkKeys(book, false)) return cb(createError(400, 'At least one valid key required.'));
  connection.connect(function (err) {
    if (err) return cb(err);
    
  });
}

// function put(id, cb) {
//   connection.connect(function (err) {
//     if (err) return cb(err);
//     connection.query();
//   });
// }

function checkKeys(book, checkAll) {
  const dbKeys = ['name', 'author', 'description', 'year', 'price'];
  let allMissing = true; // whether all the valid keys exist
  let oneMissing = false; // whether there is at least one valid key

  let sqlStr = 'UPDATE books SET ';

  for (let k of dbKeys) {
    if (k in book) {
      allMissing = false;
      if (!checkAll) {
        sqlStr += k = ' = ' + book[k] + ', ';
      }
    } else {
      oneMissing = true;
    }
    return checkAll ? allMissing : (oneMissing ? sqlStr.substring(0, sqlStr.length - 2) : false);
  }
}

module.exports = {
  get,
  getAll,
  post,
  checkKeys,
};
