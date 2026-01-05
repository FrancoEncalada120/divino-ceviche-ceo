import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
//import { LocationService } from '../../../core/services/location.service';
import { Location } from '../../../core/models/location.model';
import { LocationService } from '../../../core/services/location.service';

@Component({
  selector: 'app-locations-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './locations-list.component.html',
  styleUrl: './locations-list.component.scss',
})
export class LocationsListComponent {
  locations: Location[] = [];
  loading = false;

  //constructor(private locationService: LocationService) {}

  ngOnInit(): void {
    // this.load();
  }

  // load(): void {
  //   this.loading = true;
  //   this.locationService.getAll().subscribe({
  //     next: (data) => {
  //       this.locations = data;
  //       this.loading = false;
  //     },
  //     error: () => {
  //       this.loading = false;
  //     },
  //   });
  // }

  add() {}
  edit(row: Location) {}
  remove(row: Location) {}
}
