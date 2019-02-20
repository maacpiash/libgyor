import { Injectable } from '@angular/core';
import { Book } from './book.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BookDetailService {

  formData: Book;
  readonly APIURL = '/api/books';
  list: Book[];

  constructor(private http: HttpClient) { }

  postBookDetail(formData: Book) {
    return this.http.post(this.APIURL, formData);
  }

  putBookDetail(formData: Book) {
    return this.http.put(this.APIURL + formData.id, formData);
  }

  deleteBookDetail(id) {
    return this.http.delete(this.APIURL + id);
  }

  refreshList() {
    this.http.get(this.APIURL).toPromise().then(res => this.list = res as Book[]);
  }
}
