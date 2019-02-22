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
    this.resetForm();
  }

  resetForm(form?: NgForm) {
    if (form != null) { form.form.reset(); }
    this.service.formData = {
      id: 0,
      name: '',
      author: '',
      description: '',
      year: 0,
      price: 0
    };
  }

  clearForm(form: NgForm) {
    this.resetForm();
  }

  onSubmit(form: NgForm) {
    if (this.service.formData.id == 0)
      this.insertRecord(form);
    else
      this.updateRecord(form);
  }

  insertRecord(form: NgForm) {
    this.service.postBookDetail().subscribe(
      res => {
        this.resetForm(form);
        this.toastr.success('Submitted successfully.', 'Libgyor');
        this.service.refreshList();
      },
      err => { console.log(err); }
    );
  }

  updateRecord(form: NgForm) {
    this.service.putBookDetail().subscribe(
      res => {
        this.resetForm(form);
        this.toastr.info('Submitted successfully.', 'Libgyor');
        this.service.refreshList();
      },
      err => { console.log(err); }
    );
  }
}
