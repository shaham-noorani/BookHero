import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { AuthenticationService } from '../authentication.service';
import { BookListEntry } from './book';
import { BooksService } from '../books.service';
import { debounceTime } from 'rxjs/operators';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-booklist',
  templateUrl: './booklist.component.html',
  styleUrls: ['./booklist.component.scss'],
})
export class BooklistComponent implements OnInit {
  bookList: BookListEntry[];

  @Input() filters: FormGroup;
  @Input() addBookFormGroup: FormGroup;

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
  bookListEntryToAdd: BookListEntry;

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
      currentPage: 1,
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
    this.bookList.sort((a, b) =>
      this.statusOrder.get(a.status) > this.statusOrder.get(b.status) ? 1 : -1
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

  setBook(event) {
    var title = event?.source?.value;
    if (!title) {
      this.titleSelected = [];
    } else {
      this.titleSelected = [title];
    }

    this.newBookOptions.forEach((newBook) => {
      if (newBook.volumeInfo.title == this.titleSelected[0])
        this.bookListEntryToAdd = {
          volumeId: newBook.id,
          status: this.addBookFormGroup.get('status').value,
          currentPageCount:
            this.addBookFormGroup.get('status').value == 'Completed'
              ? newBook.volumeInfo.pageCount
              : this.addBookFormGroup.get('currentPage').value,
          rating: this.addBookFormGroup.get('rating').value,
          review: this.addBookFormGroup.get('review').value,
          startDate: this.addBookFormGroup.get('startDate').value,
          endDate: this.addBookFormGroup.get('endDate').value,
        };
    });

    this.addBookFormGroup.get('title').reset();
  }

  addBookToUserList() {
    this.setBook({ source: { value: this.titleSelected[0] } });
    this.book.addToUserBooklist(this.bookListEntryToAdd).subscribe((res) => {
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

  deleteEntryVerification(volumeId): void {
    const dialogRef = this.dialog.open(deleteEntryVerificationDialog, {
      width: '250px',
    });

    dialogRef.afterClosed().subscribe((shouldDelete) => {
      if (shouldDelete) this.removeBookFromUserList(volumeId);
    });
  }
}

@Component({
  selector: 'dialog-overview-example-dialog',
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
