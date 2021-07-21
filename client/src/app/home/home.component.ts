import { Component, OnInit } from '@angular/core';
import { AuthenticationService, UserDetails } from '../authentication.service';
import { Stats, StatsService } from '../stats.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  user: UserDetails;
  stats: Stats;

  constructor(
    private auth: AuthenticationService,
    private statsService: StatsService
  ) {}

  ngOnInit(): void {
    this.getUserDetails();
  }

  getUserDetails = () => {
    this.auth.profile().subscribe(
      (user) => {
        this.user = user;
        this.stats = this.statsService.getStats(user.bookList);
      },
      (err) => {
        this.user = null;
      }
    );
  };
}
