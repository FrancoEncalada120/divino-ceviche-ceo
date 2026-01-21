import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User, UserRequest, UserResponse } from '../models/user.models';

type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};

@Injectable({ providedIn: 'root' })
export class UserService {

  private readonly apiUrl = `${environment.apiBaseUrl}/ceo/user`;

  constructor(private http: HttpClient) {

  }

  getAll(): Observable<User[]> {
    console.log('[UserService] GET', this.apiUrl);

    return this.http.get<ApiResponse<User[]>>(this.apiUrl).pipe(
      map((res) => {
        const arr = res?.data;
        return Array.isArray(arr) ? arr : [];
      }),
    );
  }

  create(user: User): Observable<User> {
    console.log('user: User', user);

    return this.http
      .post<ApiResponse<User>>(this.apiUrl + '/create', user)
      .pipe(
        map((res) => {
          if (!res.success) {
            throw new Error(res.message || 'Error creating user');
          }
          return res.data;
        }),
      );
  }

  update(location: User): Observable<User> {
    return this.http
      .put<ApiResponse<User>>(`${this.apiUrl}/${location.user_id}`, location)
      .pipe(
        map((res) => {
          if (!res.success) {
            throw new Error(res.message || 'Error updating user');
          }
          return res.data;
        }),
      );
  }

  login(email: string, password: string): Observable<UserResponse> {
    const data: UserRequest = { email, password };

    return this.http.post<UserResponse>(this.apiUrl, data).pipe(
      tap((res) => {
        localStorage.setItem('user', JSON.stringify(res.user));
      }),
    );
  }

  logout(): void {
    localStorage.removeItem('user');
  }

  getUser(): User | null {
    try {
      const userData = localStorage.getItem('user');
      return userData ? (JSON.parse(userData) as User) : null;
    } catch {
      return null;
    }
  }


  changePassword(
    userId: number,
    payload: { currentPassword: string; newPassword: string },
  ): Observable<any> {
    return this.http.put(`${this.apiUrl}/${userId}/change-password`, payload);
  }
}
