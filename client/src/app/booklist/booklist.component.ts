import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { AuthenticationService } from '../authentication.service';

import { Book, BookListEntry, status } from './book';
import { BooksService } from '../books.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-booklist',
  templateUrl: './booklist.component.html',
  styleUrls: ['./booklist.component.scss'],
})
export class BooklistComponent implements OnInit {
  bookList: BookListEntry[];

  addBookStatus: string;
  addBookRating: number;
  addBookCurrentPage: number;
  addBookReview: number;
  addBookStartDate: Date;
  addBookEndDate: Date;

  @Input() filters: FormGroup;

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

  searchControl = new FormControl();
  newBookOptions: any[];
  autoCompleteList: any[];
  titleSelected: string[];
  bookListEntryToAdd: BookListEntry;

  @ViewChild('autocompleteInput') autocompleteInput: ElementRef;
  @Output() onSelectedOption = new EventEmitter();

  constructor(
    private fb: FormBuilder,
    private auth: AuthenticationService,
    public book: BooksService
  ) {
    this.filters = fb.group({
      completed: true,
      dropped: false,
      onHold: false,
      reading: true,
      planToRead: false,
    });
  }

  statusOrder: Map<string, number> = new Map();
  ngOnInit(): void {
    this.statusOrder.set('Completed', 1);
    this.statusOrder.set('Dropped', 2);
    this.statusOrder.set('On-hold', 3);
    this.statusOrder.set('Reading', 4);
    this.statusOrder.set('Plan to read', 5);

    this.getBooklist();

    // search bar
    this.searchControl.valueChanges.subscribe((userInput) => {
      this.book.searchBookByTitle(userInput).subscribe((books) => {
        this.newBookOptions = books;
        this.autoCompleteExpenseList(userInput);
      });
    });

    this.onChanges();
  }

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

  onChanges() {
    this.filters.valueChanges.subscribe(() => {
      this.getBooklist();
    });
  }

  searchValue = (value) => {
    return this.book.searchBookByTitle(value);
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
    if (status == 'Completed') return this.filters.value.completed;
    if (status == 'Dropped') return this.filters.value.dropped;
    if (status == 'On-hold') return this.filters.value.onHold;
    if (status == 'Reading') return this.filters.value.reading;
    if (status == 'Plan to read') return this.filters.value.planToRead;
    return false;
  };

  // search
  private autoCompleteExpenseList(input) {
    let categoryList = this.filterCategoryList(input);
    this.autoCompleteList = categoryList;
  }

  filterCategoryList(val) {
    if (typeof val != 'string') {
      return [];
    }
    if (val === '' || val === null) {
      return [];
    }
    return this.newBookOptions;
  }

  setBook(event) {
    var books = event?.source?.value;
    if (!books) {
      this.titleSelected = [];
    } else {
      this.titleSelected = [books];
      this.onSelectedOption.emit(books);
    }

    this.newBookOptions.forEach((newBook) => {
      if (newBook.volumeInfo.title == this.titleSelected[0])
        this.bookListEntryToAdd = {
          volumeId: newBook.id,
          status: this.addBookStatus,
          currentPageCount:
            this.addBookStatus == 'Completed'
              ? newBook.volumeInfo.pageCount
              : this.addBookCurrentPage,
          rating: this.addBookRating,
          review: this.addBookReview,
          startDate: this.addBookStartDate,
          endDate: this.addBookEndDate,
          book: {
            title: newBook.volumeInfo.title,
            author: newBook.volumeInfo.authors[0],
            pageCount: newBook.volumeInfo.pageCount,
            coverImage: newBook.volumeInfo.imageLinks.thumbnail,
            blurb: newBook.volumeInfo.description,
            categories: newBook.volumeInfo.categories
              ? newBook.volumeInfo.categories[0].split(' / ')
              : [],
            datePublished: newBook.volumeInfo.publishedDate,
          },
        };
    });

    console.log(this.bookListEntryToAdd);

    this.focusOnPlaceInput();
  }

  focusOnPlaceInput() {
    this.autocompleteInput.nativeElement.focus();
    this.autocompleteInput.nativeElement.value = '';
  }

  addBookToUserList() {
    this.setBook({ source: { value: this.titleSelected[0] } });
    this.book.addToUserBooklist(this.bookListEntryToAdd).subscribe((res) => {
      this.getBooklist();
    });
  }
}
