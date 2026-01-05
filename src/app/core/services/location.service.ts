import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Location, LocationUpsert } from '../models/location.model';

@Injectable({ providedIn: 'root' })
export class LocationService {
  private apiUrl = '/api/locations'; // <-- cambia a tu endpoint real si aplica

  constructor(private http: HttpClient) {}

  getAll(): Observable<Location[]> {
    return this.http.get<Location[]>(this.apiUrl);
  }

  create(payload: LocationUpsert): Observable<Location> {
    return this.http.post<Location>(this.apiUrl, payload);
  }

  update(id: number, payload: LocationUpsert): Observable<Location> {
    return this.http.put<Location>(`${this.apiUrl}/${id}`, payload);
  }

  delete(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
