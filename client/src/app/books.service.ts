import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BookListEntry } from './booklist/book';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root',
})
export class BooksService {
  constructor(private http: HttpClient, private auth: AuthenticationService) {}

  public searchBookByTitle(title: string): Observable<any> {
    return this.http.get('/api/books', {
      params: {
        title: title,
      },
    });
  }

  public addToUserBooklist(booklistEntry: BookListEntry): Observable<any> {
    return this.http.post(
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

  public updateBooklistEntry(booklistEntry: BookListEntry): Observable<any> {
    return this.http.put('/api/users/update-booklist-entry', booklistEntry, {
      params: {
        volumeId: booklistEntry.volumeId,
      },
      headers: { Authorization: `Bearer ${this.auth.getToken()}` },
    });
  }

  public removeFromUserBooklist(volumeId: string): Observable<any> {
    return this.http.delete('api/users/remove-from-booklist', {
      params: {
        volumeId: volumeId,
      },
      headers: { Authorization: `Bearer ${this.auth.getToken()}` },
    });
  }
}
