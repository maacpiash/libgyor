class Book {
    constructor(name) {
        this.name = name;
        this.author = "";
        this.description = "";
        this.year = 2000; // default value
        this.price = 0; // default value
    }

    get year() { return this._year; }
    set year(value) {
        let currentYear = (new Date()).getFullYear();
        this._year = (value > currentYear) ? currentYear : value;
    }
}

module.exports = Book;