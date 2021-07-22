import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private http: HttpClient, private auth: AuthenticationService) {}

  public getUser(id: number): Observable<any> {
    return this.http.get('api/users/' + id.toString());
  }

  public updateFriendCode(friendCode: string): Observable<any> {
    return this.http.post(
      'api/users/set-friend-code/',
      {
        friendCode: friendCode,
      },
      {
        headers: { Authorization: `Bearer ${this.auth.getToken()}` },
      }
    );
  }
}
