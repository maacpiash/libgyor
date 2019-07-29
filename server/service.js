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
  if (!hasAllKeys(book))
    return cb(createError(400, 'All keys required.'));

  client.connect(function (err) {
    if (err) return cb(err);
    const table = client.db(dbName).collection(colName);
    table.insertOne(book, function(err, res) {
      if (err) return cb(err);
      if (res.insertedCount === 0) return cb(createError(500, 'Book insertion failed.'));
      return cb(null);
    });
  });
}

function put(id, book, cb) {
  if(!hasOneKey(book)) return cb(createError(400, 'At least one key required.'));
  // connection.query(buildPutQuery(book, id), function(err, res) {
  //   if (err) return cb(err);
  //   return cb(null, res.insertId);
  // });
}

function deLete(id, cb) {
  client.connect(function (err) {
    if (err) return cb(err);
    const table = client.db(dbName).collection(colName);
    table.deleteOne({ id }, function(err, res) {
      if (err) return cb(err);
      if (res.result.n === 0) return cb(createError(500, 'Book deletion failed.'));
      return cb(null);
    });
  });
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

module.exports = {
  get,
  getAll,
  post,
  put,
  deLete
};
