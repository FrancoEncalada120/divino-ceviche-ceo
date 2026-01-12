import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Location } from '../../core/models/location.model';
import { DashboardService } from '../../core/services/dashboard.service';
import { DashboardResponse } from '../../core/models/dashboard.models';
import { LocationService } from '../../core/services/location.service';
import { DatePickerModule } from 'primeng/datepicker';
import { MultiSelectModule } from 'primeng/multiselect';
import { FormsModule } from '@angular/forms';

import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePickerModule, MultiSelectModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  loading = false;
  locations: Location[] = [];
  dasboard: DashboardResponse | null = null;

  dateRange: Date[] | null = null;

  selectedLocation!: Location[];

  constructor(
    private dashboardSvc: DashboardService,
    private locationService: LocationService
  ) {}

  ngOnInit(): void {
    // 📅 Inicializar con AYER
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    this.dateRange = [new Date(yesterday), new Date(yesterday)];

    this.loadLocations();

    this.locationChange$.pipe(debounceTime(1000)).subscribe(() => {
      console.log('Locations changed, reloading dashboard...');
      this.load();
    });
  }

  load(): void {
    this.loading = true;

    if (!this.dateRange || this.dateRange.length !== 2) {
      console.warn('Date range is not properly set.');
      this.loading = false;
      return;
    }

    if (
      !this.selectedLocation ||
      this.selectedLocation === null ||
      this.selectedLocation.length === 0
    ) {
      console.warn('No locations selected.');
      this.loading = false;
      return;
    }

    const locales = this.selectedLocation
      .map((loc) => loc.location_id)
      .join(',');

    console.log('Range de fechas:', this.formattedDateRange);
    console.log('Range de fechas:', this.dateRange);

    const startDate = this.dateRange[0].toISOString().split('T')[0];
    const endDate = this.dateRange[1].toISOString().split('T')[0];

    this.dashboardSvc.getDashboard(startDate, endDate, locales).subscribe({
      next: (res) => {
        this.dasboard = res;
        console.log('Dashboard data:', res);
      },
      error: () => (this.loading = false),
      complete: () => (this.loading = false),
    });
  }

  loadLocations(): void {
    this.locationService.getAll().subscribe({
      next: (data) => {
        console.log('[Locations] GET ok, items:', data?.length, data);
        this.locations = data ?? [];

        // 👇 TODOS seleccionados por defecto
        this.selectedLocation = [...this.locations];

        this.load();
      },
      error: (err) => {
        console.error('[Locations] GET error:', err);
      },
      complete: () => console.log('[Locations] GET complete'),
    });
  }

  get selectedLocationNames(): string {
    if (!this.selectedLocation?.length) {
      return 'None';
    }

    if (this.selectedLocation.length === this.locations.length) {
      return 'All locations';
    }

    return this.selectedLocation.map((c) => c.location_name).join(', ');
  }

  get formattedDateRange(): string {
    if (
      !this.dateRange ||
      this.dateRange.length !== 2 ||
      !this.dateRange[0] ||
      !this.dateRange[1]
    ) {
      return 'No date selected';
    }

    const format = (d: Date) => d.toISOString().split('T')[0];

    return `${format(this.dateRange[0])} - ${format(this.dateRange[1])}`;
  }

  private locationChange$ = new Subject<void>();

  onLocationsChange() {
    console.log(
      'Locations or date range changed, scheduling dashboard reload...'
    );

    this.locationChange$.next();
  }

  onLocationsChangeDate(event: any) {
    console.log('Rango de fechas cambiado:', event);
    this.load();
  }
}
