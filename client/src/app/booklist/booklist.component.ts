import { debounceTime } from 'rxjs/operators';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';

import {
  BookListEntry,
  Ratings,
  StatusMapToCamelCase,
  statusOrder,
} from './book';
import { AuthenticationService } from '../authentication.service';
import { BooksService } from '../books.service';
import { StatsService, Stats } from '../stats.service';

@Component({
  selector: 'app-booklist',
  templateUrl: './booklist.component.html',
  styleUrls: ['./booklist.component.scss'],
})
export class BooklistComponent implements OnInit {
  bookList: BookListEntry[] = [];
  visibleBookList: BookListEntry[] = [];

  @Input() filters: FormGroup = new FormGroup({});
  @Input() addBookFormGroup: FormGroup;

  stats: Stats = {
    completed: 0,
    dropped: 0,
    onHold: 0,
    reading: 0,
    planToRead: 0,
    pagesRead: 0,
    averageRating: '',
  };
  ratings = Ratings;

  checkboxes = [
    { formControlName: 'completed', text: 'Completed', color: 'lightgreen' },
    { formControlName: 'dropped', text: 'Dropped', color: 'rgb(226, 82, 65)' },
    { formControlName: 'onHold', text: 'On-hold', color: 'lightcoral' },
    {
      formControlName: 'reading',
      text: 'Reading',
      color: 'rgb(60, 150, 236)',
    },
    { formControlName: 'planToRead', text: 'Plan to read', color: 'lightgray' },
  ];

  newBookOptions: any[];
  titleSelected: string[];
  bookToAdd: any;

  constructor(
    private fb: FormBuilder,
    private auth: AuthenticationService,
    public book: BooksService,
    public dialog: MatDialog,
    public stat: StatsService
  ) {
    this.filters = fb.group({
      completed: true,
      dropped: false,
      onHold: false,
      reading: true,
      planToRead: false,
    });

    this.addBookFormGroup = fb.group({
      title: '',
      status: 'Reading',
      rating: '',
      currentPageCount: 0,
      review: '',
      startDate: Date.now(),
      endDate: Date.now(),
    });
  }

  ngOnInit(): void {
    this.getBooklist();

    this.onChanges();
  }

  getBooklist = () => {
    this.auth.profile().subscribe((user) => {
      this.setBookList(user);
    });
  };

  setBookList = (user) => {
    this.bookList = user.bookList;

    this.updateStats();
    this.sortBookList();
    this.filterBookList();
  };

  sortBookList = (): void => {
    this.bookList.sort((a, b) =>
      statusOrder.get(a.status) < statusOrder.get(b.status) ? -1 : 1
    );
  };

  filterBookList = (): void => {
    this.visibleBookList = this.bookList.filter(
      (entry) => this.filters.get(StatusMapToCamelCase.get(entry.status))?.value
    );
  };

  onChanges() {
    this.updateNewBookOptionsDropDown();

    this.filters.valueChanges.subscribe(() => {
      this.filterBookList();
    });
  }

  updateNewBookOptionsDropDown(): void {
    this.addBookFormGroup
      .get('title')
      .valueChanges.pipe(debounceTime(250))
      .subscribe((userInput) => {
        this.book.searchBookByTitle(userInput).subscribe((books) => {
          this.newBookOptions = books;
        });
      });
  }

  setBookToAdd(book) {
    this.titleSelected = [book.volumeInfo.title];
    this.bookToAdd = book;

    this.addBookFormGroup.get('title').reset();
  }

  addBookToUserList() {
    const dataFromAddBookFormGroup = (({
      status,
      review,
      startDate,
      endDate,
      rating,
      currentPageCount,
    }) => ({ status, review, startDate, endDate, rating, currentPageCount }))(
      this.addBookFormGroup.getRawValue()
    );

    dataFromAddBookFormGroup.currentPageCount =
      this.addBookFormGroup.get('status').value == 'Completed'
        ? this.bookToAdd.volumeInfo.pageCount
        : this.addBookFormGroup.get('currentPageCount').value;

    const booklistEntryToAdd: BookListEntry = {
      volumeId: this.bookToAdd.id,
      ...dataFromAddBookFormGroup,
    };

    this.book.addToUserBooklist(booklistEntryToAdd).subscribe((res) => {
      this.getBooklist();
    });

    this.titleSelected = [];
    this.addBookFormGroup.reset();
  }

  removeBookFromUserList(volumeId) {
    this.book.removeFromUserBooklist(volumeId).subscribe((res) => {
      this.getBooklist();
    });
  }

  updateBooklistEntry(entry: BookListEntry) {
    this.book.updateBooklistEntry(entry).subscribe((res) => {
      this.getBooklist();
    });
  }

  deleteEntryVerification(volumeId): void {
    const dialogRef = this.dialog.open(deleteEntryVerificationDialog, {
      width: '300px',
      height: '200px',
    });

    dialogRef.afterClosed().subscribe((shouldDelete) => {
      if (shouldDelete) this.removeBookFromUserList(volumeId);
    });
  }

  toggleUpdateEntryDialog(entry: BookListEntry): void {
    const dialogRef = this.dialog.open(updateEntryDialog, {
      width: '20vw',
      height: '50vh',
      data: entry,
    });

    dialogRef.afterClosed().subscribe((updatedEntry) => {
      if (!updatedEntry) return;
      this.updateBooklistEntry(updatedEntry);
    });
  }

  updateStats() {
    this.stats = this.bookList
      ? this.stat.getStats(this.bookList)
      : this.stat.init();
  }

  removeHTMLTags = (str: string): string => {
    for (let i = 0; i < str.length - 1; i++) {
      if (
        ['.', ',', '!', '?'].includes(str.charAt(i)) &&
        str.charAt(i + 1) != ' '
      ) {
        str =
          str.substring(0, i + 1) + ' ' + str.substring(i + 1, str.length + 1);
      }
    }
    return str.replace(/(<([^>]+)>)/gi, '');
  };
}

@Component({
  selector: 'booklist-entry-update-dialog',
  templateUrl: './booklist-entry-update-dialog.html',
})
export class updateEntryDialog {
  @Input() updatedEntryFormGroup: FormGroup;
  ratings = Ratings;

  constructor(
    public dialogRef: MatDialogRef<updateEntryDialog>,
    @Inject(MAT_DIALOG_DATA) public updatedEntry: BookListEntry,
    public fb: FormBuilder
  ) {
    this.updatedEntryFormGroup = fb.group({
      status: updatedEntry.status,
      rating: updatedEntry.rating,
      currentPage: updatedEntry.currentPageCount,
      review: updatedEntry.review,
      startDate: updatedEntry.startDate,
      endDate: updatedEntry.endDate,
    });
  }

  updateEntry(): void {
    const vId = this.updatedEntry.volumeId;
    const book = this.updatedEntry.book;
    this.updatedEntry = {
      volumeId: vId,
      status: this.updatedEntryFormGroup.get('status').value,
      rating: this.updatedEntryFormGroup.get('rating').value,
      currentPageCount: this.updatedEntryFormGroup.get('currentPage').value,
      review: this.updatedEntryFormGroup.get('review').value,
      startDate: this.updatedEntryFormGroup.get('startDate').value,
      endDate: this.updatedEntryFormGroup.get('endDate').value,
      book: book,
    };
    this.dialogRef.close(this.updatedEntry);
  }

  cancel(): void {
    this.dialogRef.close(false);
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }
}

@Component({
  selector: 'book-list-entry-delete-dialog',
  templateUrl: './booklist-entry-delete-dialog.html',
})
export class deleteEntryVerificationDialog {
  constructor(public dialogRef: MatDialogRef<deleteEntryVerificationDialog>) {}

  deleteEntry(): void {
    this.dialogRef.close(true);
  }

  cancel(): void {
    this.dialogRef.close(false);
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }
}
