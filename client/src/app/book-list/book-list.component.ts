import { Component, OnInit } from '@angular/core';
import { Book } from '../shared/book.model';
import { BookDetailService } from '../shared/book-detail.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styles: []
})
export class BookListComponent implements OnInit {

  constructor(private service: BookDetailService, private toastr: ToastrService) { }

  ngOnInit() {
    this.service.refreshList();
  }

  populateForm(bd: Book) {
    this.service.formData = Object.assign({ }, bd);
  }

  onDelete(id) {
    if (confirm('Are you sure to delete this record?')) {
      this.service.deleteBookDetail(id)
        .subscribe(res => {
            this.service.refreshList();
            this.toastr.warning('Deleted successfully', 'Libgyor');
          },
          err => console.log(err)
        );
    }
  }

}
