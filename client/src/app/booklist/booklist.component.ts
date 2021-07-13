import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { of } from 'rxjs';
import { debounceTime, filter, switchMap } from 'rxjs/operators';
import { AuthenticationService } from '../authentication.service';
import { BookListEntry } from './book';
import { BooksService } from '../books.service';

@Component({
  selector: 'app-booklist',
  templateUrl: './booklist.component.html',
  styleUrls: ['./booklist.component.scss'],
})
export class BooklistComponent implements OnInit {
  bookList: BookListEntry[];
  addBookStatus: string;
  addBookRating: number;
  searchForm: FormGroup;

  ratings = [
    { value: 10, text: '10 - masterpiece' },
    { value: 10, text: '9 - really good' },
    { value: 10, text: '8 - great' },
    { value: 10, text: '7 - good' },
    { value: 10, text: '6 - okay' },
    { value: 10, text: '5 - not great' },
    { value: 10, text: '4 - bad' },
    { value: 10, text: '3 - really bad' },
    { value: 10, text: '2 - horrible' },
    { value: 10, text: '1 - abysmal' },
  ];

  searchResult = [];
  booksName = [];

  constructor(
    private fb: FormBuilder,
    private auth: AuthenticationService,
    private book: BooksService
  ) {}

  ngOnInit(): void {
    this.getBooklist();
  }

  onChanges() {
    this.searchForm
      .get('searchBar')
      .valueChanges.pipe(
        filter((data) => data.trim().length > 0),
        debounceTime(500),
        switchMap((id: string) => {
          console.log('trim', id.replace(/[\s]/g, ''));
          return id ? this.searchValue(id.replace(/[\s]/g, '')) : of([]);
        })
      )
      .subscribe((data) => {
        console.log(data);
        this.searchResult = data as Array<{}>;
      });
  }

  searchValue = (value) => {
    return this.book.searchBookByTitle(value);
  };

  getBooklist = () => {
    this.auth.profile().subscribe((user) => {
      this.setBookList(user);
    });
  };

  setBookList = (user) => {
    this.bookList = user.bookList;
  };

  removeTags = (str) => {
    if (str === null || str === '') return false;
    else str = str.toString();

    // Regular expression to identify HTML tags in
    // the input string. Replacing the identified
    // HTML tag with a null string.
    return str.replace(/(<([^>]+)>)/gi, '');
  };
}
