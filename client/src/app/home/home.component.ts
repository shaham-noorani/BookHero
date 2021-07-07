import { Component, OnInit } from '@angular/core';
import { AuthenticationService, UserDetails } from '../authentication.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  user: UserDetails;

  constructor(private auth: AuthenticationService) {}

  ngOnInit(): void {
    this.getUserDetails();
  }

  getUserDetails = () => {
    this.auth.profile().subscribe(
      (user) => {
        console.log(user);
        this.user = user;
      },
      (err) => {
        console.log(err);
      }
    );
  };
}
