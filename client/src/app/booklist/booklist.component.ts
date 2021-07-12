import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import { BookListEntry } from './book';

@Component({
  selector: 'app-booklist',
  templateUrl: './booklist.component.html',
  styleUrls: ['./booklist.component.scss'],
})
export class BooklistComponent implements OnInit {
  bookList: BookListEntry[];

  // statusColors = {
  //   'Completed': ""
  // }

  constructor(private auth: AuthenticationService) {}

  ngOnInit(): void {
    this.getBooklist();
  }

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
