import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthenticationService } from '../authentication.service';
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

  constructor(
    private auth: AuthenticationService,
    private users: UsersService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.auth.profile().subscribe(
      (user) => {
        this.friendCode = user.friendCode;
        this.generateFriendsList(user.friends);
      },
      (err) => {
        console.error(err);
      }
    );
  }

  generateFriendsList(friendIds: number[]): void {
    friendIds.forEach((id) => {
      this.users.getUser(id).subscribe((user) => {
        this.friendsList.push(user);
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
      (err) => this.openErrorSnackBar()
    );
  }

  openErrorSnackBar(): void {
    this._snackBar.openFromComponent(errorSnackBarComponent, {
      duration: 5000,
    });
  }
}

@Component({
  selector: 'error-snack-bar',
  template: '<span>Friend code is already in use...</span>',
})
export class errorSnackBarComponent {}
