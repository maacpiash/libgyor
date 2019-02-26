const mysql = require('mysql');
const createError = require('http-errors');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1212',
    database: 'booksdb'
});

function get(id, cb) {
    connection.connect(function (err) {
        if (err) return cb(err);
        connection.query('SELECT * FROM books WHERE id = ?', [id], function (err, result) {
            if (err) return cb(err);
            if (result.length === 0) {
                return cb(createError(404, 'Book not found'));
            }
            cb(null, result[0]);
        });
    })
}

module.exports = {
    get,
};
