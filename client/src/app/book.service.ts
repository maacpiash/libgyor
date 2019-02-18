import { Injectable } from '@angular/core';
import { Book } from './book';
import { BOOKS } from './mock-books';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root'
})

export class BookService {

  // serverUrl = 'localhost:1416/api/books';

  books: Book[];

  // getAllBooks() { return this.http.get(this.serverUrl); }

  getBooks(): Observable<Book[]> {
    this.messagingService.add('BookService: fetched books.');
    return of(BOOKS);
  }

  constructor(private messagingService: MessageService) { }
}
