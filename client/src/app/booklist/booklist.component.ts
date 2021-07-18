import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { AuthenticationService } from '../authentication.service';
import { BookListEntry } from './book';
import { BooksService } from '../books.service';
import { debounceTime } from 'rxjs/operators';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';

@Component({
  selector: 'app-booklist',
  templateUrl: './booklist.component.html',
  styleUrls: ['./booklist.component.scss'],
})
export class BooklistComponent implements OnInit {
  bookList: BookListEntry[];

  @Input() filters: FormGroup;
  @Input() addBookFormGroup: FormGroup;

  stats = {
    completed: 0,
    dropped: 0,
    onHold: 0,
    reading: 0,
    planToRead: 0,
    pagesRead: 0,
    averageRating: '0',
  };

  ratings = [
    { value: 10, text: '10 - masterpiece' },
    { value: 9, text: '9 - really good' },
    { value: 8, text: '8 - great' },
    { value: 7, text: '7 - good' },
    { value: 6, text: '6 - okay' },
    { value: 5, text: '5 - not great' },
    { value: 4, text: '4 - bad' },
    { value: 3, text: '3 - really bad' },
    { value: 2, text: '2 - horrible' },
    { value: 1, text: '1 - abysmal' },
  ];

  newBookOptions: any[];
  titleSelected: string[];
  bookToAdd: any;

  constructor(
    private fb: FormBuilder,
    private auth: AuthenticationService,
    public book: BooksService,
    public dialog: MatDialog
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
      currentPage: 0,
      review: '',
      startDate: Date.now(),
      endDate: Date.now(),
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
    this.bookList.sort((a, b) =>
      this.statusOrder.get(a.status) < this.statusOrder.get(b.status) ? -1 : 1
    );
    this.bookList = this.bookList.filter((entry) =>
      this.canDisplay(entry.status)
    );
  };

  onChanges() {
    this.addBookFormGroup
      .get('title')
      .valueChanges.pipe(debounceTime(250))
      .subscribe((userInput) => {
        this.book.searchBookByTitle(userInput).subscribe((books) => {
          this.newBookOptions = books;
        });
      });

    this.filters.valueChanges.subscribe(() => {
      this.getBooklist();
    });
  }

  removeHTMLTags = (str: string): string => {
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

  setBook(book) {
    var title = book.volumeInfo.title;
    if (!title) {
      this.titleSelected = [];
    } else {
      this.titleSelected = [title];
    }

    this.bookToAdd = book;

    this.addBookFormGroup.get('title').reset();
  }

  addBookToUserList() {
    const booklistEntryToAdd: BookListEntry = {
      volumeId: this.bookToAdd.id,
      status: this.addBookFormGroup.get('status').value,
      currentPageCount:
        this.addBookFormGroup.get('status').value == 'Completed'
          ? this.bookToAdd.volumeInfo.pageCount
          : this.addBookFormGroup.get('currentPage').value,
      rating: this.addBookFormGroup.get('rating').value,
      review: this.addBookFormGroup.get('review').value,
      startDate: this.addBookFormGroup.get('startDate').value,
      endDate: this.addBookFormGroup.get('endDate').value,
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
      width: '20vw',
      height: '20vh',
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
    this.stats = {
      completed: this.bookList.filter((entry) => entry.status == 'Completed')
        .length,
      dropped: this.bookList.filter((entry) => entry.status == 'Dropped')
        .length,
      onHold: this.bookList.filter((entry) => entry.status == 'On-hold').length,
      reading: this.bookList.filter((entry) => entry.status == 'Reading')
        .length,
      planToRead: this.bookList.filter(
        (entry) => entry.status == 'Plan to read'
      ).length,
      pagesRead: this.getPagesRead(),
      averageRating: this.getAverageRating(),
    };
  }

  getPagesRead(): number {
    var total = 0;
    this.bookList.forEach((entry) => (total += entry.currentPageCount));
    return total;
  }

  getAverageRating(): string {
    var totalRating = 0;
    var numberOfRatings = 0;

    this.bookList.forEach((entry) => {
      if (entry.rating) {
        totalRating += entry.rating;
        numberOfRatings++;
      }
    });

    return (Math.round((totalRating / numberOfRatings) * 100) / 100).toFixed(2);
  }
}

@Component({
  selector: 'booklist-entry-update-dialog',
  templateUrl: './booklist-entry-update-dialog.html',
})
export class updateEntryDialog {
  @Input() updatedEntryFormGroup: FormGroup;
  ratings = [
    { value: 10, text: '10 - masterpiece' },
    { value: 9, text: '9 - really good' },
    { value: 8, text: '8 - great' },
    { value: 7, text: '7 - good' },
    { value: 6, text: '6 - okay' },
    { value: 5, text: '5 - not great' },
    { value: 4, text: '4 - bad' },
    { value: 3, text: '3 - really bad' },
    { value: 2, text: '2 - horrible' },
    { value: 1, text: '1 - abysmal' },
  ];

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
