import { Injectable } from '@angular/core';
import { Book } from './book.model';

@Injectable({
  providedIn: 'root'
})
export class BookDetailService {

  formData: Book;

  constructor() { }
}
