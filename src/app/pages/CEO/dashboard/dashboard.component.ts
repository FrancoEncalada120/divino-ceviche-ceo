import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Location } from '../../../core/models/location.model';
import { DashboardService } from '../../../core/services/dashboard.service';
import {
  CashFlow,
  DashboardResponse,
} from '../../../core/models/dashboard.models';
import { LocationService } from '../../../core/services/location.service';
import { DatePickerModule } from 'primeng/datepicker';
import { MultiSelectModule } from 'primeng/multiselect';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { TxtsignoPipe } from '../../../core/pipes/txtsigno.pipe';
import { TabPanel } from 'primeng/tabview';
import { CardModule } from 'primeng/card';
import { CashflowListComponent } from '../../cashflow/cashflow-list/cashflow-list.component';

@Component({
  selector: 'app-dashboard',

  imports: [
    CommonModule,
    FormsModule,
    DatePickerModule,
    MultiSelectModule,
    TxtsignoPipe,
    CashflowListComponent,
    TableModule,
    TabViewModule,
    CardModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  loading = false;
  locations: Location[] = [];
  dasboard: DashboardResponse | null = null;

  dateRange: Date[] | null = null;

  selectedLocation!: Location[];
  movimientos: CashFlow[] = [];
  cashflowMonths: CashFlow[] = [];

  constructor(
    private dashboardSvc: DashboardService,
    private locationService: LocationService,
  ) {}

  ngOnInit(): void {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const firstOfMonth = new Date(
      yesterday.getFullYear(),
      yesterday.getMonth(),
      1,
    );

    this.dateRange = [firstOfMonth, yesterday];

    this.loadLocations();

    this.locationChange$.pipe(debounceTime(1000)).subscribe(() => {
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

    const startDate = this.dateRange[0].toISOString().split('T')[0];
    const endDate = this.dateRange[1].toISOString().split('T')[0];

    this.dashboardSvc.getDashboard(startDate, endDate, locales).subscribe({
      next: (res) => {
        this.dasboard = res;
        this.movimientos = res.cashflow;
      },
      error: () => (this.loading = false),
      complete: () => (this.loading = false),
    });
  }

  loadLocations(): void {
    this.locationService.getLocationAll().subscribe({
      next: (data) => {
        this.locations = data ?? [];

        // 👇 TODOS seleccionados por defecto
        this.selectedLocation = [...this.locations];

        this.load();
      },
      error: (err) => {
        console.error('[Locations] GET error:', err);
      },
      complete: () => {},
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
    this.locationChange$.next();
  }

  onLocationsChangeDate(event: any) {
    this.load();
  }
}
