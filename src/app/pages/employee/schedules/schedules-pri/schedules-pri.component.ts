import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, DateSelectArg, EventClickArg, EventDropArg, EventInput } from '@fullcalendar/core';

import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin, { EventResizeDoneArg } from '@fullcalendar/interaction';

import { DialogModule } from 'primeng/dialog';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { DatePipe, NgIf } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { LocationService } from '../../../../core/services/location.service';
import { Location } from '../../../../core/models/location.model';
import { MultiSelectModule } from 'primeng/multiselect';
import { CardModule } from 'primeng/card';

interface Employee {
  id: number;
  name: string;
  color: string;
}

interface ScheduleForm {
  employeeId: number | null;
  start: Date | null;
  end: Date | null;
  breakMinutes: number;
}

@Component({
  selector: 'app-schedules-pri',
  standalone: true,
  imports: [
    FormsModule,
    FullCalendarModule,
    DialogModule,
    DatePickerModule,
    SelectModule,
    InputNumberModule,
    ButtonModule,
    DatePipe,
    InputTextModule,
    MultiSelectModule,
    NgIf,
    CardModule
  ],
  templateUrl: './schedules-pri.component.html',
  styleUrl: './schedules-pri.component.scss'
})
export class SchedulesPriComponent implements OnInit {

  selectedStartDate: Date | null = null;
  selectedEndDate: Date | null = null;

  scheduleDialogVisible = false;
  editingEventId: string | null = null;

  workedHours = 0;
  workedHoursLabel = '0 horas';

  employees: Employee[] = [
    { id: 1, name: 'Juan Perez', color: '#2563eb' },
    { id: 2, name: 'Maria Garcia', color: '#16a34a' },
    { id: 3, name: 'Carlos Lopez', color: '#dc2626' }
  ];

  schedules: EventInput[] = [];

  scheduleForm: ScheduleForm = this.getEmptyForm();

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: 'timeGridWeek',
    locale: 'es',
    firstDay: 1,
    selectable: true,
    editable: true,
    nowIndicator: true,
    allDaySlot: false,
    slotMinTime: '09:00:00',
    slotMaxTime: '27:00:00',
    slotDuration: '00:30:00',
    snapDuration: '00:30:00',
    slotLabelInterval: '01:00:00',
    slotEventOverlap: false,
    expandRows: true,
    height: 'auto',
    events: this.schedules,
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'timeGridWeek,timeGridDay'
    },
    buttonText: {
      today: 'Hoy',
      month: 'Mes',
      week: 'Semana',
      day: 'Dia'
    },
    slotLabelFormat: {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    },
    // selectAllow: selection => {
    //   return this.isSameBusinessDay(selection.start, selection.end);
    // },
    eventTimeFormat: {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    },
    select: this.onSelectTime.bind(this),
    eventClick: this.onEventClick.bind(this),
    eventDrop: this.onEventMoved.bind(this),
    eventResize: this.onEventMoved.bind(this)
  };

  selectedLocation!: Location[];
  locations: Location[] = [];

  constructor(private locationService: LocationService) { }

  ngOnInit(): void {
    this.loadLocations();
  }


  loadLocations(): void {
    this.locationService.getLocationAll().subscribe({
      next: (data) => {
        this.locations = data ?? [];

        // 👇 TODOS seleccionados por defecto
        this.selectedLocation = [...this.locations];

      },
      error: (err) => {
        console.error('[Locations] GET error:', err);
      },
      complete: () => { },
    });
  }


  private isSameBusinessDay(start: Date, end: Date): boolean {
    const businessStart = new Date(start);
    businessStart.setHours(8, 0, 0, 0);

    const businessEnd = new Date(businessStart);
    businessEnd.setDate(businessEnd.getDate() + 1);
    businessEnd.setHours(3, 0, 0, 0);

    return start >= businessStart && end <= businessEnd;
  }

  onSelectTime(selection: DateSelectArg): void {

    this.editingEventId = null;
    this.selectedStartDate = selection.start;
    this.selectedEndDate = selection.end;

    this.scheduleForm = {
      employeeId: null,
      start: selection.start,
      end: selection.end,
      breakMinutes: 0
    };

    this.scheduleDialogVisible = true;
    this.updateWorkedHours();

  }

  onEventClick(eventClick: EventClickArg): void {
    const event = eventClick.event;

    this.editingEventId = event.id;
    this.selectedStartDate = event.start;
    this.selectedEndDate = event.end;

    this.scheduleForm = {
      employeeId: Number(event.extendedProps['employeeId']),
      start: event.start,
      end: event.end,
      breakMinutes: Number(event.extendedProps['breakMinutes'] ?? 0)
    };

    this.scheduleDialogVisible = true;
    this.updateWorkedHours();
  }

  saveSchedule(): void {


    let start = this.combineDateWithTime(this.selectedStartDate, this.scheduleForm.start);
    let end = this.combineDateWithTime(this.selectedEndDate, this.scheduleForm.end);

    if (!this.scheduleForm.employeeId || !start || !end) {
      return;
    }

    end = this.normalizeEndTime(start, end);

    if (end <= start) {
      return;
    }

    const employee = this.employees.find(item => item.id === this.scheduleForm.employeeId);

    const scheduleEvent: EventInput = {
      id: this.editingEventId ?? crypto.randomUUID(),
      title: employee?.name ?? 'Empleado',
      start,
      end,
      backgroundColor: employee?.color ?? '#2563eb',
      borderColor: employee?.color ?? '#2563eb',
      textColor: '#ffffff',
      extendedProps: {
        employeeId: this.scheduleForm.employeeId,
        breakMinutes: this.scheduleForm.breakMinutes
      }
    };

    if (this.editingEventId) {
      this.schedules = this.schedules.map(item =>
        item.id === this.editingEventId ? scheduleEvent : item
      );
    } else {
      this.schedules = [...this.schedules, scheduleEvent];
    }

    this.refreshCalendarEvents();
    this.closeDialog();

    console.log('Horarios actuales:', this.getPayload());
  }


  private combineDateWithTime(dateValue: Date | null, timeValue: Date | null): Date | null {
    if (!dateValue || !timeValue) {
      return null;
    }

    const result = new Date(dateValue);
    result.setHours(timeValue.getHours(), timeValue.getMinutes(), 0, 0);

    return result;
  }

  private normalizeEndTime(start: Date, end: Date): Date {
    const normalizedEnd = new Date(end);

    if (normalizedEnd <= start) {
      normalizedEnd.setDate(normalizedEnd.getDate() + 1);
    }

    return normalizedEnd;
  }

  deleteSchedule(): void {
    if (!this.editingEventId) {
      return;
    }

    this.schedules = this.schedules.filter(item => item.id !== this.editingEventId);
    this.refreshCalendarEvents();
    this.closeDialog();
  }

  onEventMoved(info: EventDropArg | EventResizeDoneArg): void {
    const movedEvent = info.event;

    this.schedules = this.schedules.map(item => {
      if (item.id !== movedEvent.id) {
        return item;
      }

      return {
        ...item,
        start: movedEvent.start ?? item.start,
        end: movedEvent.end ?? item.end
      };
    });

    this.refreshCalendarEvents();

    console.log('Horario actualizado:', this.getPayload());
  }

  closeDialog(): void {
    this.scheduleDialogVisible = false;
    this.editingEventId = null;
    this.selectedStartDate = null;
    this.selectedEndDate = null;
    this.scheduleForm = this.getEmptyForm();
    this.workedHours = 0;
    this.workedHoursLabel = '0 horas';

  }

  updateWorkedHours(): void {

    const start = this.combineDateWithTime(this.selectedStartDate, this.scheduleForm.start);
    const end = this.combineDateWithTime(this.selectedEndDate, this.scheduleForm.end);

    if (!start || !end || end <= start) {
      this.workedHours = 0;
      this.workedHoursLabel = '0 horas';
      return;
    }

    const diffMilliseconds = end.getTime() - start.getTime();
    this.workedHours = diffMilliseconds / 1000 / 60 / 60;

    this.workedHoursLabel = `${this.workedHours.toFixed(2)} horas`;
  }

  getPayload(): unknown[] {
    return this.schedules.map(item => ({
      id: item.id,
      employeeId: item.extendedProps?.['employeeId'],
      start: item.start,
      end: item.end,
      breakMinutes: item.extendedProps?.['breakMinutes'] ?? 0
    }));
  }

  private refreshCalendarEvents(): void {
    this.calendarOptions = {
      ...this.calendarOptions,
      events: [...this.schedules]
    };
  }

  private getEmptyForm(): ScheduleForm {
    return {
      employeeId: null,
      start: null,
      end: null,
      breakMinutes: 0
    };
  }
}
