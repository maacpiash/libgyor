import { Injectable } from '@angular/core';
import { Book } from './book.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BookDetailService {

  formData: Book;
  readonly APIURL = '/api/books/';
  list: Book[];

  constructor(private http: HttpClient) { }

  postBookDetail() {
    return this.http.post(this.APIURL, this.formData);
  }

  putBookDetail() {
    return this.http.put(this.APIURL + this.formData.id, this.formData);
  }

  deleteBookDetail(id) {
    return this.http.delete(this.APIURL + id);
  }

  refreshList() {
    this.http.get(this.APIURL)
      .toPromise()
      .then(res => this.list = res as Book[]);
  }
}
