import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { BookDetailsComponent } from './book-details/book-details.component';
import { BookDetailComponent } from './book-details/book-detail/book-detail.component';
import { BookDetailListComponent } from './book-details/book-detail-list/book-detail-list.component';
import { BookDetailService } from './shared/book-detail.service';

@NgModule({
  declarations: [
    AppComponent,
    BookDetailsComponent,
    BookDetailComponent,
    BookDetailListComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [BookDetailService],
  bootstrap: [AppComponent]
})
export class AppModule { }
