import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthenticationService } from '../authentication.service';
import { StatsService } from '../stats.service';
import { UsersService } from '../users.service';
import { Friend } from './friends';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.scss'],
})
export class FriendsComponent implements OnInit {
  friendCode: string;
  friendsList: Friend[] = [];

  updatingFriendCode: boolean = false;
  @Input() newFriendCode: string;

  @Input() addFriendCode: string;

  constructor(
    private auth: AuthenticationService,
    private users: UsersService,
    private _snackBar: MatSnackBar,
    private stats: StatsService
  ) {}

  ngOnInit() {
    this.updateFriendsList();
  }

  updateFriendsList(): void {
    this.auth.profile().subscribe((user) => {
      this.friendCode = user.friendCode;
      this.generateFriendsList(user.friends);
    });
  }

  generateFriendsList(friendIds: number[]): void {
    this.friendsList = [];
    friendIds.forEach((id) => {
      this.users.getUser(id).subscribe((user) => {
        this.friendsList.push({
          stats: this.stats.getStats(user.bookList),
          ...user,
        });
      });
    });
  }

  updateFriendCode(): void {
    this.users.updateFriendCode(this.newFriendCode).subscribe(
      (res) => {
        this.friendCode = this.newFriendCode;

        this.updatingFriendCode = false;
        this.newFriendCode = '';
      },
      (err) => this.openErrorSnackBar('This friend code is already in use...')
    );
  }

  addFriend(): void {
    this.users.addFriend(this.addFriendCode).subscribe(
      (res) => {
        this.updateFriendsList();
        this.addFriendCode = '';
      },
      (err) => {
        this.openErrorSnackBar(
          'No user found with friend code ' + this.addFriendCode
        );
      }
    );
  }

  openErrorSnackBar(message: string): void {
    this._snackBar.open(message, 'clear');
  }
}
