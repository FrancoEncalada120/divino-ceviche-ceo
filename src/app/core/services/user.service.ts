import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User, UserRequest, UserResponse } from '../models/user.models';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly apiUrl = `${environment.apiBaseUrl}/ceo/user`;

  private userLogin: User | null = null;

  constructor(private http: HttpClient) {

    const userData = localStorage.getItem('user');
    if (userData) {
      this.userLogin = JSON.parse(userData);
    }


  }

  login(email: string, password: string): Observable<UserResponse> {

    const data: UserRequest = {
      email,
      password
    };

    console.log("login -> data", data);
    console.log("apiUrl", this.apiUrl);

    return this.http
      .post<UserResponse>(this.apiUrl, data)
      .pipe(
        tap(res => {

          console.log('[login] response:', res);
          this.userLogin = res.user;

        })
      );
  }

  getUser(){
    return this.userLogin;
  }

}
