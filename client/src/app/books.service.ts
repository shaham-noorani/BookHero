import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BooksService {
  constructor(private http: HttpClient, private router: Router) {}

  public searchBookByTitle(title) {
    let base$;

    base$ = this.http
      .get<any>('/api/books/title=' + title)
      .subscribe((data) => {
        return data;
      });

    return of([]);
  }
}
