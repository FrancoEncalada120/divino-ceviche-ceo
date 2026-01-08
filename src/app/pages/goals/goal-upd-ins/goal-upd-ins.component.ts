import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { Goal } from '../../../core/models/goal.models';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LocationService } from '../../../core/services/location.service';
import { Location } from '../../../core/models/location.model';


@Component({
  selector: 'app-goal-upd-ins',
  imports: [CommonModule, FormsModule],
  templateUrl: './goal-upd-ins.component.html',
  styleUrl: './goal-upd-ins.component.scss'
})
export class GoalUpdInsComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Output() submit = new EventEmitter<Goal>();

  @Input() mode: 'create' | 'edit' = 'create';
  @Input() goal: Goal | null = null;

  locations: Location[] = [];

  constructor(private locationService: LocationService) { }

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

  formData: Goal = {
    goal_id: 0,
    goal_food_cost: 0,
    goal_labor_cost: 0,
    goal_month: 1,
    goal_year: 2025,
    goal_net_margin: 0,
    goal_target_AOV: 0,
    goal_target_sales: 0,
    location_id: 0,
    locations: {
      location_id: 0,
      location_name: '',
      location_AccountNumber: '',
      location_status: ''
    }
  };

  ngOnInit() {

    this.load();

    if (this.mode === 'edit' && this.goal) {
      // Copia defensiva (muy importante)
      this.formData = { ...this.goal };
    }
  }

  onClose() {
    this.close.emit();
  }

  onSubmit() {
    this.submit.emit(this.formData);
  }

  // ===========================================

  months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' }
  ];

  years = [
    { value: 2025, label: '2025' },
    { value: 2026, label: '2026' }
  ];

}
