const MongoClient = require('mongodb').MongoClient;
const createError = require('http-errors');
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url, { useNewUrlParser: true });
const dbName = 'Library';
const colName = 'Books';
const dbKeys = ['title', 'author', 'description', 'tags', 'publisher', 'year', 'price'];

function get(id, cb) {
  client.connect(function (err) {
    if (err) return cb(err);
    const table = client.db(dbName).collection(colName);
    table.find({ _id: id }).toArray(function(err, docs) {
      if (err) return cb(err);
      if (docs.length === 0) return cb(createError(404, `Book with id ${id} not found`));
      return cb(null, docs);
    });
  });
}

function getAll(cb) {
  client.connect(function (err) {
    if (err) return cb(err);
    const table = client.db(dbName).collection(colName);
    table.find({}).toArray(function(err, docs) {
      if (err) return cb(err);
      if (docs.length === 0) return cb(createError(404, 'Book not found'));
      return cb(null, docs);
    });
  });
}

function post(book, cb) {
  // if (!hasAllKeys(book)) {
  //   console.log('OBJECT', book);
  //   return cb(createError(400, 'All keys required.'));
  // }
  
  // let details = [book.name, book.author, book.description, book.year, book.price];
  // connection.query(
  //   'INSERT INTO books (name, author, description, year, price) VALUES (?, ?, ?, ?, ?)', details, function(error, result) {
  //     if (error) return cb(error);
  //     return cb(null, result.insertId);
  //   }
  // );
}

function put(id, book, cb) {
//   if(!hasOneKey(book)) return cb(createError(400, 'At least one key required.'));
//   connection.query(buildPutQuery(book, id), function(err, res) {
//     if (err) return cb(err);
//     return cb(null, res.insertId);
//   });
}

function deLete(id, cb) {
//   connection.query('DELETE FROM books WHERE id = ' + id, function(err, res) {
//     if (err) return cb(err);
//     return cb(null, res.affectedRows);
//   });
}

function hasAllKeys(book) {
  let jsKeys = Object.keys(book);
  let flag = true;
  dbKeys.forEach(k => flag = flag && jsKeys.includes(k));
  return flag;
}

function hasOneKey(book) {
  let jsKeys = Object.keys(book);
  if (jsKeys.length === 0)
    return false;
  let flag = false;
  dbKeys.forEach(k => { if (jsKeys.includes(k)) flag = true; });
  return flag;
}

function buildPutQuery(book, id) {
//   let sqlStr = 'UPDATE books SET ';
//   let keys = Object.keys(book);
//   keys.forEach(k => {
//     if(book[k])
//       sqlStr += `${k} = "${book[k]}", `;
//   });
//   return sqlStr.substring(0, sqlStr.length - 2) + ` WHERE id = ${id};`;
}

module.exports = {
  get,
  getAll,
  post,
  put,
  deLete
};
