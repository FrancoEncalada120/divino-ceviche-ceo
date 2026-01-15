import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User, UserRequest, UserResponse } from '../models/user.models';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly apiUrl = `${environment.apiBaseUrl}/ceo/user`;
  private userLogin: User | null = null;

  constructor(private http: HttpClient) {
    const userData = localStorage.getItem('user');
    if (userData) this.userLogin = JSON.parse(userData);
  }

  get currentUser(): User | null {
    return this.userLogin;
  }

  login(email: string, password: string): Observable<UserResponse> {
    const data: UserRequest = { email, password };

    return this.http.post<UserResponse>(this.apiUrl, data).pipe(
      tap((res) => {
        this.userLogin = res.user;
        localStorage.setItem('user', JSON.stringify(res.user));
      })
    );
  }

  logout(): void {
    this.userLogin = null;
    localStorage.removeItem('user');
  }
}
