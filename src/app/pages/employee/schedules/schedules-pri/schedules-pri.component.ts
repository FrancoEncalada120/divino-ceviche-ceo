import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { CardModule } from 'primeng/card';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';

import { LocationService } from '../../../../core/services/location.service';
import { UserService } from '../../../../core/services/user.service';

import { Location } from '../../../../core/models/location.model';
import { User } from '../../../../core/models/user.models';
import { GesHorario } from '../../../../core/models/ges-horario.model';

import { SchedulesListComponent } from '../schedules-list/schedules-list.component';
import { SchedulesUpsInsComponent } from '../schedules-ups-ins/schedules-ups-ins.component';
import { GesHorarioService } from '../../../../core/services/ges_horario.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-schedules-pri',
  standalone: true,
  imports: [
    NgIf,
    FormsModule,
    CardModule,
    MultiSelectModule,
    SelectModule,
    SchedulesListComponent,
    SchedulesUpsInsComponent,
  ],
  templateUrl: './schedules-pri.component.html',
  styleUrl: './schedules-pri.component.scss',
})
export class SchedulesPriComponent implements OnInit {
  loading = false;
  saving = false;

  locations: Location[] = [];
  selectedLocation: Location[] = [];

  employees: User[] = [];
  selectedEmployeeId: number | null = null;

  schedules: GesHorario[] = [];

  scheduleDialogVisible = false;
  modalMode: 'create' | 'edit' = 'create';
  selectedSchedule: GesHorario | null = null;
  selectedStartDate: Date | null = null;
  selectedEndDate: Date | null = null;

  constructor(
    private locationService: LocationService,
    private userService: UserService,
    private gesHorarioService: GesHorarioService,
    private messageService: MessageService,
  ) {}

  ngOnInit(): void {
    this.loadLocations();
    this.loadEmployees();
    this.loadSchedules();
  }

  loadLocations(): void {
    this.locationService.getLocationAll().subscribe({
      next: (data) => {
        this.locations = data ?? [];
        this.selectedLocation = [...this.locations];
        this.loadSchedules();
      },
      error: (err) => {
        console.error('[Locations] GET error:', err);
      },
    });
  }

  loadEmployees(): void {
    this.userService.getAll([]).subscribe({
      next: (data) => {
        this.employees = data ?? [];
      },
      error: (err) => {
        console.error('[Employees] GET error:', err);
      },
    });
  }

  loadSchedules(): void {
    this.loading = true;

    const locationId =
      this.selectedLocation?.length === 1
        ? this.selectedLocation[0].location_id
        : null;

    this.gesHorarioService
      .getAll({
        location_id: locationId,
        user_id: this.selectedEmployeeId,
      })
      .subscribe({
        next: (data) => {
          this.schedules = data ?? [];
          this.loading = false;
        },
        error: (err) => {
          console.error('[Schedules] GET error:', err);
          this.loading = false;
        },
      });
  }

  onFilterChange(): void {
    this.loadSchedules();
  }

  openCreate(event: { start: Date; end: Date }): void {
    this.modalMode = 'create';
    this.selectedSchedule = null;
    this.selectedStartDate = event.start;
    this.selectedEndDate = event.end;
    this.scheduleDialogVisible = true;
  }

  openEdit(schedule: GesHorario): void {
    this.modalMode = 'edit';
    this.selectedSchedule = schedule;
    this.selectedStartDate = new Date(schedule.start_datetime);
    this.selectedEndDate = new Date(schedule.end_datetime);
    this.scheduleDialogVisible = true;
  }

  closeDialog(): void {
    this.scheduleDialogVisible = false;
    this.modalMode = 'create';
    this.selectedSchedule = null;
    this.selectedStartDate = null;
    this.selectedEndDate = null;
    this.saving = false;
  }

  saveSchedule(schedule: GesHorario): void {
    if (!schedule) {
      this.messageService.add({
        severity: 'error',
        summary: 'Invalid schedule',
        detail: 'No schedule data was received.',
        life: 5000,
      });
      return;
    }

    if (!schedule.user_id || !schedule.location_id) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Missing information',
        detail: 'Please select an employee and a location before saving.',
        life: 5000,
      });
      return;
    }

    const startDate = new Date(schedule.start_datetime);
    const endDate = new Date(schedule.end_datetime);

    if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Invalid dates',
        detail: 'Please check the start and end date before saving.',
        life: 5000,
      });
      return;
    }

    if (endDate <= startDate) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Invalid time range',
        detail: 'The end time must be greater than the start time.',
        life: 5000,
      });
      return;
    }

    const payload = {
      user_id: Number(schedule.user_id),
      location_id: Number(schedule.location_id),
      start_datetime: this.formatDateTime(startDate),
      end_datetime: this.formatDateTime(endDate),
      status: schedule.status ?? 'scheduled',
      notes: schedule.notes ?? null,
      ...(this.modalMode === 'create'
        ? { created_by: this.getCurrentUserId() }
        : { updated_by: this.getCurrentUserId() }),
    };

    this.saving = true;

    const request$ =
      this.modalMode === 'create'
        ? this.gesHorarioService.create(payload)
        : this.gesHorarioService.update(Number(schedule.id), payload);

    request$.subscribe({
      next: (saved) => {
        if (this.modalMode === 'create') {
          this.schedules = [...this.schedules, saved];
        } else {
          this.schedules = this.schedules.map((item) =>
            item.id === saved.id ? saved : item,
          );
        }

        this.saving = false;
        this.closeDialog();

        this.messageService.add({
          severity: 'success',
          summary:
            this.modalMode === 'create'
              ? 'Schedule created'
              : 'Schedule updated',
          detail:
            this.modalMode === 'create'
              ? 'The schedule was created successfully.'
              : 'The schedule was updated successfully.',
          life: 4000,
        });
      },

      error: (err) => {
        this.saving = false;

        const errorCode = err?.code || err?.error?.code;

        const errorMessage =
          err?.message ||
          err?.error?.message ||
          'The schedule could not be saved. Please try again.';

        if (errorCode === 'SCHEDULE_OVERLAP') {
          this.messageService.add({
            severity: 'warn',
            summary: 'Schedule conflict',
            detail: errorMessage,
            life: 7000,
          });
          return;
        }

        console.error('[Schedules] save error:', err);

        this.messageService.add({
          severity: 'error',
          summary: 'Save failed',
          detail: errorMessage,
          life: 6000,
        });
      },
    });
  }

  deleteSchedule(schedule: GesHorario): void {
    if (!schedule?.id) {
      return;
    }

    this.saving = true;

    this.gesHorarioService.delete(schedule.id).subscribe({
      next: () => {
        this.schedules = this.schedules.filter(
          (item) => item.id !== schedule.id,
        );
        this.closeDialog();
      },
      error: (err) => {
        console.error('[Schedules] DELETE error:', err);
        this.saving = false;
      },
    });
  }

  moveSchedule(schedule: GesHorario): void {
    if (!schedule?.id) {
      return;
    }

    const payload = {
      user_id: schedule.user_id,
      location_id: schedule.location_id,
      start_datetime: this.formatDateTime(new Date(schedule.start_datetime)),
      end_datetime: this.formatDateTime(new Date(schedule.end_datetime)),
      status: schedule.status,
      notes: schedule.notes ?? null,
      updated_by: this.getCurrentUserId(),
    };

    this.gesHorarioService.update(schedule.id, payload).subscribe({
      next: (saved) => {
        this.schedules = this.schedules.map((item) =>
          item.id === saved.id ? saved : item,
        );
      },
      error: (err) => {
        console.error('[Schedules] MOVE error:', err);
        this.loadSchedules();
      },
    });
  }

  private getCurrentUserId(): number | null {
    const userData = localStorage.getItem('user');

    if (!userData) {
      return null;
    }

    try {
      const user = JSON.parse(userData) as User;
      return user?.user_id ?? null;
    } catch {
      return null;
    }
  }

  private formatDateTime(value: Date): string {
    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, '0');
    const day = String(value.getDate()).padStart(2, '0');
    const hours = String(value.getHours()).padStart(2, '0');
    const minutes = String(value.getMinutes()).padStart(2, '0');
    const seconds = String(value.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }
}
