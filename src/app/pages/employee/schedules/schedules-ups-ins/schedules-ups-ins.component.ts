import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';

import { Location } from '../../../../core/models/location.model';
import { GesHorario } from '../../../../core/models/ges-horario.model';
import { User } from '../../../../core/models/user.models';

@Component({
  selector: 'app-schedules-ups-ins',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    DatePickerModule,
    SelectModule,
    InputTextModule,
    TextareaModule,
    MessageModule,
  ],
  templateUrl: './schedules-ups-ins.component.html',
  styleUrl: './schedules-ups-ins.component.scss',
})
export class SchedulesUpsInsComponent implements OnInit {
  @Input() mode: 'create' | 'edit' = 'create';
  @Input() schedule: GesHorario | null = null;

  @Input() employees: User[] = [];
  @Input() locations: Location[] = [];

  @Input() selectedStartDate: Date | null = null;
  @Input() selectedEndDate: Date | null = null;
  @Input() saving = false;

  @Output() close = new EventEmitter<void>();
  @Output() submit = new EventEmitter<GesHorario>();
  @Output() delete = new EventEmitter<GesHorario>();

  workedHours = 0;
  workedHoursLabel = '0 hours';

  statuses = [
    { label: 'Scheduled', value: 'scheduled' },
    { label: 'Completed', value: 'completed' },
    { label: 'Cancelled', value: 'cancelled' },
  ];

  formData: GesHorario = this.getEmptyForm();

  ngOnInit(): void {
    if (this.mode === 'edit' && this.schedule) {
      this.formData = {
        ...this.schedule,
        start_datetime: new Date(this.schedule.start_datetime),
        end_datetime: new Date(this.schedule.end_datetime),
      };
    } else {
      this.formData = {
        ...this.getEmptyForm(),
        location_id: this.locations[0]?.location_id ?? 0,
        start_datetime: this.selectedStartDate ?? new Date(),
        end_datetime: this.selectedEndDate ?? new Date(),
      };
    }

    this.updateWorkedHours();
  }

  onClose(): void {
    this.close.emit();
  }

  onDelete(): void {
    if (this.schedule) {
      this.delete.emit(this.schedule);
    }
  }

  onSubmit(): void {
    if (!this.formData.user_id || !this.formData.location_id) {
      return;
    }

    const start = new Date(this.formData.start_datetime);
    const end = new Date(this.formData.end_datetime);

    if (end <= start) {
      return;
    }

    this.submit.emit({
      ...this.formData,
      start_datetime: start,
      end_datetime: end,
    });
  }

  updateWorkedHours(): void {
    const start = new Date(this.formData.start_datetime);
    const end = new Date(this.formData.end_datetime);

    if (
      Number.isNaN(start.getTime()) ||
      Number.isNaN(end.getTime()) ||
      end <= start
    ) {
      this.workedHours = 0;
      this.workedHoursLabel = '0 hours';
      return;
    }

    const diffMilliseconds = end.getTime() - start.getTime();
    this.workedHours = diffMilliseconds / 1000 / 60 / 60;
    this.workedHoursLabel = `${this.workedHours.toFixed(2)} hours`;
  }

  private getEmptyForm(): GesHorario {
    return {
      id: 0,
      user_id: 0,
      location_id: 0,
      start_datetime: new Date(),
      end_datetime: new Date(),
      status: 'scheduled',
      notes: null,
    };
  }
}
