import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AuditInfoComponent } from '../../../shared/components/audit-info/audit-info.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  DailyMetric,
  DailyMetricCreateDto,
} from '../../../core/models/dashboard.models';
import { LocationService } from '../../../core/services/location.service';
import { Location } from '../../../core/models/location.model';

@Component({
  selector: 'app-modal',
  imports: [CommonModule, FormsModule, AuditInfoComponent],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
})
export class ModalComponent {
  @Output() close = new EventEmitter<void>();
  @Output() submit = new EventEmitter<DailyMetricCreateDto>();
  @Input() dailyMetric: DailyMetricCreateDto | null = null;

  loading = false;
  locations: Location[] = [];
  selectedLocation!: Location[];

  constructor(private locationService: LocationService) {}

  formData: Partial<DailyMetricCreateDto> = {
    daily_metric_id: null,
    location_id: 0,
    daily_metric_date: '',
    daily_metric_tickets: 0,
    daily_metric_net_sales: 0,
    daily_metric_daily_hourly: 0,
    created_at: null,
    created_by: null,
    updated_at: null,
    updated_by: null,
  };

  ngOnInit(): void {
    console.log('dailyMetric', this.dailyMetric);
    this.formData = { ...this.dailyMetric };

    this.load();
  }

  load(): void {
    this.locationService.getAll().subscribe({
      next: (data) => {
        console.log('[Locations] GET ok, items:', data?.length, data);
        this.locations = data ?? [];
      },
      error: (err) => {
        console.error('[Locations] GET error:', err);
      },
      complete: () => console.log('[Locations] GET complete'),
    });
  }

  onClose(): void {
    this.close.emit();
  }

  onSubmit() {
    this.submit.emit(this.formData as DailyMetricCreateDto);
  }
}
