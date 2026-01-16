import { CommonModule, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DatePickerModule } from 'primeng/datepicker';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { LocationService } from '../../../core/services/location.service';
import { Location } from '../../../core/models/location.model';
import { Subject } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { DailyMetric } from '../../../core/models/dashboard.models';
import { DailyMetricService } from '../../../core/services/dailymetri.service';

@Component({
  selector: 'app-dailymetric-list',
  imports: [
    CommonModule,

    DatePickerModule,
    MultiSelectModule,
    TabViewModule,
    TableModule,
    ButtonModule,
    CardModule,
    MultiSelectModule,
    FormsModule,
  ],
  templateUrl: './dailymetric-list.component.html',
  styleUrl: './dailymetric-list.component.scss',
})
export class DailymetricListComponent {
  locations: Location[] = [];
  selectedLocation!: Location[];
  dateRange: Date[] | null = null;
  private locationChange$ = new Subject<void>();
  loading = false;

  dailyMetric: DailyMetric[] = [];

  constructor(
    private locationService: LocationService,
    private dailymetric: DailyMetricService
  ) {}

  ngOnInit(): void {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    this.dateRange = [new Date(yesterday), new Date(yesterday)];
    this.loadLocations();
    this.load();
  }

  load(): void {
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

    const startDate = this.dateRange[0].toISOString().split('T')[0];
    const endDate = this.dateRange[1].toISOString().split('T')[0];

    this.loading = true;

    this.dailymetric
      .getAll({
        locacion: locales,
        fechaIni: startDate, // string
        fechaFin: endDate, // string
      })
      .subscribe({
        next: (data) => {
          this.dailyMetric = data; // DailyMetric[]
          const dailyMetric = data ?? []; // ✅ array real

          console.log('dailyMetric items:', dailyMetric.length, dailyMetric);
        },
        error: (err) => {
          console.error(err);
          this.loading = false;
        },
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
      },
      error: (err) => {
        console.error('[Locations] GET error:', err);
      },
      complete: () => console.log('[Locations] GET complete'),
    });
  }

  onLocationsChange() {
    console.log(
      'Locations or date range changed, scheduling dashboard reload...'
    );

    this.locationChange$.next();
    this.load();
  }

  onLocationsChangeDate(event: any) {
    console.log('Rango de fechas cambiado:', event);
    this.load();
  }
}
