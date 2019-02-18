import { Injectable } from '@angular/core';
import { Book } from './book';
import { BOOKS } from './mock-books';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class BookService {

  serverUrl = 'localhost:1416/api/books';

  getAllBooks() { return this.http.get(this.serverUrl); }

  getBooks(): Observable<Book[]> { return of(BOOKS); }

  constructor(private http: HttpClient) { }
}
