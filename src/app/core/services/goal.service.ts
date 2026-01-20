import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Goal } from '../models/goal.models';
import { environment } from '../../../environments/environment';

type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};

@Injectable({ providedIn: 'root' })
export class GoalService {
  private readonly apiUrl = `${environment.apiBaseUrl}/ceo/goals`;

  constructor(private http: HttpClient) { }

  getAll(month: Number, year: Number): Observable<Goal[]> {

    const url = `${this.apiUrl}?month=${month}&year=${year}`;
    console.log('[Goals] getAll URL:', url);

    return this.http.get<ApiResponse<Goal[]>>(url).pipe(
      map((res) => {
        const arr = res?.data;
        return Array.isArray(arr) ? arr : [];
      })
    );
  }

  create(location: Goal): Observable<Goal> {

    return this.http
      .post<ApiResponse<Goal>>(this.apiUrl, location)
      .pipe(
        map(res => {

          if (!res.success) {
            throw new Error(res.message || 'Error creating location');
          }
          return res.data;
        })
      );
  }

  update(location: Goal): Observable<Goal> {
    return this.http
      .put<ApiResponse<Goal>>(`${this.apiUrl}/${location.goal_id}`, location)
      .pipe(
        map(res => {
          if (!res.success) {
            throw new Error(res.message || 'Error updating location');
          }
          return res.data;
        })
      );
  }

  delete(goal: Goal): Observable<Goal> {
    return this.http
      .delete<ApiResponse<Goal>>(`${this.apiUrl}/${goal.goal_id}`)
      .pipe(
        map(res => {
          if (!res.success) {
            throw new Error(res.message || 'Error deleting goal');
          }
          return res.data;
        })
      );
  }

}
