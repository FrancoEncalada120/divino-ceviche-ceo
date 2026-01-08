import { Component, OnInit } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Location } from '../../core/models/location.model';
import { DashboardService } from '../../core/services/dashboard.service';
import { DashboardResponse } from '../../core/models/dashboard.models';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NgClass, ReactiveFormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {

  loading = false;
  locations: Location[] = [];
  dasboard: DashboardResponse | null = null;

  hasMissingYesterday = false;

  filtersForm!: ReturnType<FormBuilder['group']>;

  constructor(private fb: FormBuilder, private dashboardSvc: DashboardService) {
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

    this.dashboardSvc.getDashboard("2026-01-05", "2026-01-05", "1").subscribe({
      next: (res) => {
        this.dasboard = res;
        console.log('Dashboard data:', res);
      },
      error: () => (this.loading = false),
      complete: () => (this.loading = false),
    });
  }


}
