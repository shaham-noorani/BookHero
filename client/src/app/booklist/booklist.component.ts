import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
// import { of } from 'rxjs';
// import { debounceTime, filter, switchMap } from 'rxjs/operators';
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
  @Input() filters: FormGroup;

  statusOrder: Map<string, number> = new Map();

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
  ) {
    this.filters = fb.group({
      completed: true,
      dropped: false,
      onHold: false,
      reading: true,
      planToRead: false,
    });
  }

  ngOnInit(): void {
    this.statusOrder.set('Completed', 1);
    this.statusOrder.set('Dropped', 2);
    this.statusOrder.set('On-hold', 3);
    this.statusOrder.set('Reading', 4);
    this.statusOrder.set('Plan-to-read', 5);
    this.getBooklist();

    this.onChanges();
  }

  onChanges() {
    // this.searchForm
    //   .get('searchBar')
    //   .valueChanges.pipe(
    //     filter((data) => data.trim().length > 0),
    //     debounceTime(500),
    //     switchMap((id: string) => {
    //       console.log('trim', id.replace(/[\s]/g, ''));
    //       return id ? this.searchValue(id.replace(/[\s]/g, '')) : of([]);
    //     })
    //   )
    //   .subscribe((data) => {
    //     console.log(data);
    //     this.searchResult = data as Array<{}>;
    //   });
    this.filters.valueChanges.subscribe((changes) => {
      this.getBooklist();
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
    this.bookList.sort((a, b) =>
      this.statusOrder.get(a.status) > this.statusOrder.get(b.status) ? 1 : -1
    );
    this.bookList = this.bookList.filter((entry) =>
      this.canDisplay(entry.status)
    );
  };

  removeTags = (str) => {
    if (str === null || str === '') return false;
    else str = str.toString();

    // Regular expression to identify HTML tags in
    // the input string. Replacing the identified
    // HTML tag with a null string.
    return str.replace(/(<([^>]+)>)/gi, '');
  };

  canDisplay = (status): boolean => {
    console.log(status);
    if (status == 'Completed') return this.filters.value.completed;
    if (status == 'Dropped') return this.filters.value.dropped;
    if (status == 'On-hold') return this.filters.value.onHold;
    if (status == 'Reading') return this.filters.value.reading;
    if (status == 'Plan-to-read') return this.filters.value.planToRead;
    return false;
  };
}
