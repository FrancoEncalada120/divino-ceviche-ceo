import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';

import { FullCalendarModule } from '@fullcalendar/angular';
import {
  CalendarOptions,
  DateSelectArg,
  EventClickArg,
  EventDropArg,
  EventInput,
} from '@fullcalendar/core';

import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, {
  EventResizeDoneArg,
} from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';

import { User } from '../../../../core/models/user.models';
import { GesHorario } from '../../../../core/models/ges-horario.model';

@Component({
  selector: 'app-schedules-list',
  standalone: true,
  imports: [FullCalendarModule],
  templateUrl: './schedules-list.component.html',
  styleUrl: './schedules-list.component.scss',
})
export class SchedulesListComponent implements OnChanges {
  @Input() schedules: GesHorario[] = [];
  @Input() employees: User[] = [];

  @Output() create = new EventEmitter<{ start: Date; end: Date }>();
  @Output() edit = new EventEmitter<GesHorario>();
  @Output() moved = new EventEmitter<GesHorario>();

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: 'timeGridWeek',
    locale: 'en',
    firstDay: 1,
    selectable: true,
    editable: true,
    nowIndicator: true,
    allDaySlot: false,
    slotMinTime: '08:00:00',
    slotMaxTime: '27:00:00',
    slotDuration: '00:30:00',
    snapDuration: '00:30:00',
    slotLabelInterval: '01:00:00',
    slotEventOverlap: false,
    expandRows: true,
    height: 'auto',
    events: [],
    eventContent: this.renderScheduleEvent.bind(this),
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'timeGridWeek,timeGridDay',
    },
    buttonText: {
      today: 'Today',
      month: 'Month',
      week: 'Week',
      day: 'Day',
    },
    slotLabelFormat: {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    },
    eventTimeFormat: {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    },
    select: this.onSelectTime.bind(this),
    eventClick: this.onEventClick.bind(this),
    eventDrop: this.onEventMoved.bind(this),
    eventResize: this.onEventMoved.bind(this),
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['schedules'] || changes['employees']) {
      this.refreshCalendarEvents();
    }
  }

  onSelectTime(selection: DateSelectArg): void {
    this.create.emit({
      start: selection.start,
      end: selection.end,
    });
  }

  onEventClick(eventClick: EventClickArg): void {
    const schedule = this.schedules.find(
      (item) => String(item.id) === eventClick.event.id,
    );

    if (schedule) {
      this.edit.emit(schedule);
    }
  }

  onEventMoved(info: EventDropArg | EventResizeDoneArg): void {
    const event = info.event;

    const schedule = this.schedules.find(
      (item) => String(item.id) === event.id,
    );

    if (!schedule || !event.start || !event.end) {
      info.revert();
      return;
    }

    this.moved.emit({
      ...schedule,
      start_datetime: event.start,
      end_datetime: event.end,
    });
  }

  private refreshCalendarEvents(): void {
    const events: EventInput[] = this.schedules.map((item) => {
      const color = item.user?.color || '#607D8B';

      return {
        id: String(item.id),
        title: this.getEmployeeName(item),
        start: item.start_datetime,
        end: item.end_datetime,
        backgroundColor: color,
        borderColor: color,
        textColor: '#ffffff',
        classNames: ['schedule-calendar-event'],
        extendedProps: {
          user_id: item.user_id,
          location_id: item.location_id,
          status: item.status,
          notes: item.notes,
          total_hours: item.total_hours,
          location_icon: item.location?.icono,
          location_name: item.location?.abbreviation,
        },
      };
    });

    this.calendarOptions = {
      ...this.calendarOptions,
      events,
    };
  }

  private getEmployeeName(schedule: GesHorario): string {
    if (schedule.user) {
      return `${schedule.user.user_name ?? ''} ${
        schedule.user.user_apellido ?? ''
      }`.trim();
    }

    const employee = this.employees.find(
      (item) => item.user_id === schedule.user_id,
    );

    if (employee) {
      return `${employee.user_name ?? ''} ${employee.user_apellido ?? ''}`.trim();
    }

    return 'Employee';
  }

  private renderScheduleEvent(arg: any): { html: string } {
    const event = arg.event;

    const employeeName = event.title;
    const locationIcon = event.extendedProps['location_icon'];
    const locationName = event.extendedProps['location_name'];
    const status = event.extendedProps['status'];
    const notes = event.extendedProps['notes'];

    return {
      html: `
      <div class="schedule-event">
        <div class="schedule-event__header">
          <span class="schedule-event__time">
            ${arg.timeText}
          </span>

          ${
            status
              ? `<span class="schedule-event__status">
                  ${status}
                </span>`
              : ''
          }
        </div>

        <div class="schedule-event__employee">
          ${employeeName}
        </div>

        ${
          locationIcon || locationName
            ? `<div class="schedule-event__location">
                ${locationIcon ? `<i class="${locationIcon}"></i>` : ''}
                <span>${locationName ?? ''}</span>
              </div>`
            : ''
        }

        ${
          notes
            ? `<div class="schedule-event__notes">
                ${notes}
              </div>`
            : ''
        }
      </div>
    `,
    };
  }
}
