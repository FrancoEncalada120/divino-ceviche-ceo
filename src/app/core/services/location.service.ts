import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Location } from '../models/location.model';
import { environment } from '../../../environments/environment';
import { User } from '../models/user.models';

type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};


@Injectable({ providedIn: 'root' })
export class LocationService {
  private readonly apiUrl = `${environment.apiBaseUrl}/ceo/locations`;

  constructor(private http: HttpClient) { }

  getLocationAll(): Observable<Location[]> {

    const userData = localStorage.getItem('user');
    const user: User | null = userData ? (JSON.parse(userData) as User) : null;

    let url = this.apiUrl;
    if (user?.user_rol === 3) {
      url += `?location_id=${user?.location_id}`
    }


    return this.http.get<ApiResponse<Location[]>>(url).pipe(
      map((res) => {
        const arr = res?.data;
        return Array.isArray(arr) ? arr : [];
      })
    );
  }

  create(location: Location): Observable<Location> {

    console.log('[create] POST', this.apiUrl);
    console.log('[create] data', location);

    return this.http
      .post<ApiResponse<Location>>(this.apiUrl, location)
      .pipe(
        map(res => {

          console.log('[create] res', res);

          if (!res.success) {
            throw new Error(res.message || 'Error creating location');
          }
          return res.data;
        })
      );
  }

  update(location: Location): Observable<Location> {
    return this.http
      .put<ApiResponse<Location>>(`${this.apiUrl}/${location.location_id}`, location)
      .pipe(
        map(res => {
          if (!res.success) {
            throw new Error(res.message || 'Error updating location');
          }
          return res.data;
        })
      );
  }

}
