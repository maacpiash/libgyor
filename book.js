class Book {
  constructor(name) {
    this.name = name;
    this.author = '';
    this.description = '';
    this.year = 2000; // default value
    this.price = 0; // default value
  }

  // getter and setter for 'year' property

  get year() {
    return this._year;
  }
  
  set year(value) {
    let currentYear = new Date().getFullYear();
    this._year = value > currentYear ? currentYear : value;
  }

  // getter and setter for 'price' property

  get price() {
    return this._price;
  }

  set price(value) {
    this._price = value > 0 ? value : 0;
  }
}

module.exports = Book;