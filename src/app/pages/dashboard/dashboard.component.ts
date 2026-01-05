import { Component, OnInit } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DashboardService } from '../../core/services/dashboard.service';
import { DashboardResponse, KpiCard } from '../../core/models/dashboard.models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NgClass, ReactiveFormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  loading = false;

  locations: DashboardResponse['locations'] = [
    { id: 'all', name: 'All locations' },
  ];
  hasMissingYesterday = false;
  kpis: KpiCard[] = [];

  // ✅ SOLO declarar (no inicializar aquí)
  filtersForm!: ReturnType<FormBuilder['group']>;

  constructor(private fb: FormBuilder, private dashboardSvc: DashboardService) {
    // ✅ inicialización correcta
    this.filtersForm = this.fb.nonNullable.group({
      locationId: ['all', Validators.required],
      range: ['last7', Validators.required],
    });
  }

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;

    const filters = this.filtersForm.getRawValue();
    this.dashboardSvc.getDashboard(filters as any).subscribe({
      next: (res) => {
        this.locations = res.locations;
        this.hasMissingYesterday = res.hasMissingYesterday;
        this.kpis = res.kpis;
      },
      error: () => (this.loading = false),
      complete: () => (this.loading = false),
    });
  }

  onApplyFilters(): void {
    this.load();
  }

  formatValue(card: KpiCard): string {
    if (card.format === 'currency') {
      return new Intl.NumberFormat('es-PE', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
      }).format(card.value);
    }

    if (card.format === 'percent') {
      return `${card.value.toFixed(1)}%`;
    }

    return String(card.value);
  }
}
