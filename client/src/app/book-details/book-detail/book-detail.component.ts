import { Component, OnInit } from '@angular/core';
import { BookDetailService } from 'src/app/shared/book-detail.service';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.component.html',
  styles: []
})
export class BookDetailComponent implements OnInit {

  constructor(private service: BookDetailService, private toastr: ToastrService) { }

  ngOnInit() {
    this.resetForm()
  }

  resetForm(form?: NgForm) {
    if (form != null) { form.resetForm(); }
    this.service.formData = {
      id: 0,
      name: '',
      author: '',
      description: '',
      year: 0,
      price: 0
    };
  }

  onSubmit(form: NgForm) {
    if (this.service.formData.id == 0) 
      this.insertRecord(form);
    else
      this.updateRecord(form);
  }

  insertRecord(form: NgForm) {
    this.service.postBookDetail(this.service.formData).subscribe(
      res => {
        this.resetForm(form);
        this.toastr.success('Submitted successfully.', 'Libgyor');
        this.service.refreshList();
      },
      err => { console.log(err); }
    );
  }

  updateRecord(form: NgForm) {
    this.service.putBookDetail(this.service.formData).subscribe(
      res => {
        this.resetForm(form);
        this.toastr.info('Submitted successfully.', 'Libgyor');
        this.service.refreshList();
      },
      err => { console.log(err); }
    );
  }
}
