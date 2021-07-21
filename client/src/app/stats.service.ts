import { Injectable } from '@angular/core';
import { Book, BookListEntry } from './booklist/book';

@Injectable({
  providedIn: 'root',
})
export class StatsService {
  constructor() {}

  public getStats(bookList: BookListEntry[]): Stats {
    return {
      completed: bookList.filter((entry) => entry.status == 'Completed').length,
      dropped: bookList.filter((entry) => entry.status == 'Dropped').length,
      onHold: bookList.filter((entry) => entry.status == 'On-hold').length,
      reading: bookList.filter((entry) => entry.status == 'Reading').length,
      planToRead: bookList.filter((entry) => entry.status == 'Plan to read')
        .length,
      pagesRead: this.getPagesRead(bookList),
      averageRating: this.getAverageRating(bookList),
    };
  }

  private getPagesRead(bookList: BookListEntry[]): number {
    var total = 0;
    bookList.forEach((entry) => (total += entry.currentPageCount));
    return total;
  }

  private getAverageRating(bookList: BookListEntry[]): string {
    if (bookList.length == 0) return '';

    var totalRating = 0;
    var numberOfRatings = 0;

    bookList.forEach((entry) => {
      if (entry.rating) {
        totalRating += entry.rating;
        numberOfRatings++;
      }
    });

    return (Math.round((totalRating / numberOfRatings) * 100) / 100).toFixed(2);
  }

  init(): Stats {
    return {
      completed: 0,
      dropped: 0,
      onHold: 0,
      reading: 0,
      planToRead: 0,
      pagesRead: 0,
      averageRating: '0',
    };
  }
}

export interface Stats {
  completed: number;
  dropped: number;
  onHold: number;
  reading: number;
  planToRead: number;
  pagesRead: number;
  averageRating: string;
}
