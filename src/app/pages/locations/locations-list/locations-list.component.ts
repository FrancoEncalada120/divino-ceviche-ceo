import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { Location } from '../../../core/models/location.model';
import { LocationService } from '../../../core/services/location.service';

@Component({
  selector: 'app-locations-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './locations-list.component.html',
  styleUrls: ['./locations-list.component.scss'], // ✅ era styleUrl
})
export class LocationsListComponent implements OnInit {
  locations: Location[] = [];
  loading = false;

  constructor(private locationService: LocationService) {}

  ngOnInit(): void {
    console.log('[Locations] ngOnInit');
    this.load();
  }

  load(): void {
    console.log('[Locations] load() start');
    this.loading = true;

    this.locationService.getAll().subscribe({
      next: (data) => {
        console.log('[Locations] GET ok, items:', data?.length, data);
        this.locations = data ?? [];
        this.loading = false;
      },
      error: (err) => {
        console.error('[Locations] GET error:', err);
        this.loading = false;
      },
      complete: () => console.log('[Locations] GET complete'),
    });
  }

  add() {}
  edit(row: Location) {}
  remove(row: Location) {}
}
