import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Book } from './booklist/book';

@Injectable({
  providedIn: 'root',
})
export class BooksService {
  public booksData;

  constructor(private http: HttpClient) {}

  public searchBookByTitle(title): Observable<any> {
    return this.http.get<any>('/api/books', {
      params: {
        title: title,
      },
    });
  }
}
