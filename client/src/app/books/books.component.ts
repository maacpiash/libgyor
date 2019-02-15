import { Component, OnInit } from '@angular/core';
import { Book } from '../book';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css']
})
export class BooksComponent implements OnInit {

  book: Book = {
    id: 1,
    name: 'Introduction to Algorithm by CLRS',
    author: 'CLRS',
    description: 'Algorithm',
    year: 1980,
    price: 499
  };

  constructor() { }

  ngOnInit() {
  }

}
