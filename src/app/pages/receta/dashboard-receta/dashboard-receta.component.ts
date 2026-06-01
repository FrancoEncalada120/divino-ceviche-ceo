import { Component, OnInit } from '@angular/core';
import { DashboardInsumosComponent } from '../../CEO/dasboard-insumos/dasboard-insumos/dasboard-insumos.component';
import { DashboardStockComponent } from '../../CEO/dashboard-stock/dashboard-stock.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DatePickerModule } from 'primeng/datepicker';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { CardModule } from 'primeng/card';

import { LocationService } from '../../../core/services/location.service';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { Location } from '../../../core/models/location.model';

@Component({
  selector: 'app-dashboard-receta',
  standalone: true,
  imports: [
    DashboardInsumosComponent,
    DashboardStockComponent,
    CommonModule,
    FormsModule,
    DatePickerModule,
    MultiSelectModule,
    TableModule,
    TabViewModule,
    CardModule,
  ],
  templateUrl: './dashboard-receta.component.html',
  styleUrl: './dashboard-receta.component.scss',
})
export class DashboardRecetaComponent implements OnInit {
  loading = false;

  locations: Location[] = [];
  selectedLocation: Location[] = [];
  dateRange: Date[] | null = null;

  private locationChange$ = new Subject<void>();

  constructor(private locationService: LocationService) {}

  ngOnInit(): void {
    console.log('[DashboardReceta] ngOnInit');

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const firstOfMonth = new Date(
      yesterday.getFullYear(),
      yesterday.getMonth(),
      1,
    );

    this.dateRange = [firstOfMonth, yesterday];

    console.log('[DashboardReceta] Default dateRange:', {
      dateRange: this.dateRange,
      formattedDateRange: this.formattedDateRange,
    });

    this.loadLocations();

    this.locationChange$.pipe(debounceTime(500)).subscribe(() => {
      console.log('[DashboardReceta] locationChange$ debounce fired');

      // importante: nueva referencia para que los hijos detecten cambio
      this.selectedLocation = [...(this.selectedLocation || [])];

      console.log('[DashboardReceta] selectedLocation after debounce:', {
        selectedLocation: this.selectedLocation,
        selectedLocationNames: this.selectedLocationNames,
        locationIds: this.selectedLocation.map((x) => x.location_id),
      });

      this.load();
    });
  }

  loadLocations(): void {
    console.log('[DashboardReceta] loadLocations()');

    this.locationService.getLocationAll().subscribe({
      next: (data) => {
        console.log('[DashboardReceta] Locations response:', data);

        this.locations = data ?? [];

        // todos seleccionados por defecto
        this.selectedLocation = [...this.locations];

        console.log('[DashboardReceta] Locations loaded:', {
          totalLocations: this.locations.length,
          selectedLocation: this.selectedLocation,
          selectedLocationNames: this.selectedLocationNames,
          locationIds: this.selectedLocation.map((x) => x.location_id),
        });

        this.load();
      },
      error: (err) => {
        console.error('[DashboardReceta] Locations GET error:', err);
      },
      complete: () => {
        console.log('[DashboardReceta] loadLocations complete');
      },
    });
  }

  load(): void {
    console.log('[DashboardReceta] load() start');

    this.loading = true;

    if (!this.dateRange || this.dateRange.length !== 2) {
      console.warn('[DashboardReceta] Date range is not properly set.', {
        dateRange: this.dateRange,
      });

      this.loading = false;
      return;
    }

    if (
      !this.selectedLocation ||
      this.selectedLocation === null ||
      this.selectedLocation.length === 0
    ) {
      console.warn('[DashboardReceta] No locations selected.', {
        selectedLocation: this.selectedLocation,
      });

      this.loading = false;
      return;
    }

    const locales = this.selectedLocation
      .map((loc) => loc.location_id)
      .join(',');

    const startDate = this.formatDateForApi(this.dateRange[0]);
    const endDate = this.formatDateForApi(this.dateRange[1]);

    console.log('[DashboardReceta] filtros padre listos:', {
      locales,
      selectedLocation: this.selectedLocation,
      selectedLocationNames: this.selectedLocationNames,
      startDate,
      endDate,
      formattedDateRange: this.formattedDateRange,
    });

    /*
      OJO:
      Aquí no necesitas llamar directamente a los hijos.
      Como el HTML tiene:
      
      <app-dashboard-insumos
        [selectedLocation]="selectedLocation"
        [dateRange]="dateRange">
      </app-dashboard-insumos>

      <app-dashboard-stock
        [selectedLocation]="selectedLocation">
      </app-dashboard-stock>

      Angular les pasa los cambios automáticamente.
      Lo importante es crear nueva referencia cuando cambia selectedLocation/dateRange.
    */

    this.loading = false;

    console.log('[DashboardReceta] load() end');
  }

  onLocationsChange(): void {
    console.log('[DashboardReceta] onLocationsChange fired:', {
      selectedLocationBefore: this.selectedLocation,
      idsBefore: this.selectedLocation?.map((x) => x.location_id),
    });

    // Esto es clave: nueva referencia para disparar ngOnChanges en hijos
    this.selectedLocation = [...(this.selectedLocation || [])];

    console.log('[DashboardReceta] onLocationsChange new reference:', {
      selectedLocationAfter: this.selectedLocation,
      idsAfter: this.selectedLocation?.map((x) => x.location_id),
      selectedLocationNames: this.selectedLocationNames,
    });

    this.locationChange$.next();
  }

  onLocationsChangeDate(event: Date[] | null): void {
    console.log('[DashboardReceta] onLocationsChangeDate fired:', {
      event,
      dateRangeBefore: this.dateRange,
    });

    // Esto es clave: nueva referencia para disparar ngOnChanges en hijos
    this.dateRange = event ? [...event] : null;

    console.log('[DashboardReceta] dateRange new reference:', {
      dateRangeAfter: this.dateRange,
      formattedDateRange: this.formattedDateRange,
      startDate: this.dateRange?.[0]
        ? this.formatDateForApi(this.dateRange[0])
        : null,
      endDate: this.dateRange?.[1]
        ? this.formatDateForApi(this.dateRange[1])
        : null,
    });

    this.load();
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

    const start = this.formatDateForApi(this.dateRange[0]);
    const end = this.formatDateForApi(this.dateRange[1]);

    return `${start} - ${end}`;
  }

  private formatDateForApi(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }
}
