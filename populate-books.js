const fs = require('fs');
require('dotenv').config();

const MongoClient = require('mongodb').MongoClient;
const url = process.env.DBURL || 'mongodb://localhost:27017/Library';

MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
  if (err) throw err;
  console.log('Database created!');
  fs.readFile('./books.json', function(err, data) {
    if (err) throw err;
    const books = JSON.parse(data);
    db.db('Library').collection('Books').insertMany(books, function(err, res) {
      if (err) throw err;
      db.close();
    });
  });
});
