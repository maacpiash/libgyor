import { Component, OnInit } from '@angular/core';
import { Book } from './../../shared/book.model';
import { BookDetailService } from './../../shared/book-detail.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-book-detail-list',
  templateUrl: './book-detail-list.component.html',
  styles: []
})
export class BookDetailListComponent implements OnInit {

  constructor(private service: BookDetailService, private toastr: ToastrService) { }

  ngOnInit() {
    this.service.refreshList();
  }

  populateForm(bd: Book) {
    this.service.formData = bd;// Object.assign({}, bd);
  }

  onDelete(id) {
    if(confirm('Are you sure to delete this record?'))
      this.service.deleteBookDetail(id).subscribe(
        res => {
          this.service.refreshList();
          this.toastr.warning('Deleted successfully', 'Libgyor');
        },
        err => console.log(err)
      );
  }  

}
