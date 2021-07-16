import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Book, BookListEntry } from './booklist/book';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root',
})
export class BooksService {
  public booksData;

  constructor(private http: HttpClient, private auth: AuthenticationService) {}

  public searchBookByTitle(title): Observable<any> {
    return this.http.get<any>('/api/books', {
      params: {
        title: title,
      },
    });
  }

  public addToUserBooklist(booklistEntry: BookListEntry) {
    console.log(this.auth.getToken());
    return this.http.post<any>(
      '/api/users/add-to-booklist',
      {
        status: booklistEntry.status,
        notes: booklistEntry.notes,
        currentPageCount: booklistEntry.currentPageCount,
        rating: booklistEntry.rating,
        review: booklistEntry.review,
        startDate: booklistEntry.startDate,
        endDate: booklistEntry.endDate,
      },
      {
        params: {
          volumeId: booklistEntry.volumeId,
        },
        headers: { Authorization: `Bearer ${this.auth.getToken()}` },
      }
    );
  }

  public removeFromUserBooklist(volumeId: string) {
    return this.http.delete('api/users/remove-from-booklist', {
      params: {
        volumeId: volumeId,
      },
      headers: { Authorization: `Bearer ${this.auth.getToken()}` },
    });
  }
}
