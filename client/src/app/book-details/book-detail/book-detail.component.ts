import { Component, OnInit } from '@angular/core';
import { BookDetailService } from 'src/app/shared/book-detail.service';

@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.component.html',
  styles: []
})
export class BookDetailComponent implements OnInit {

  constructor(private service: BookDetailService) { }

  ngOnInit() {
  }

}
