import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { GesEmpleadoCargo } from '../../../../core/models/ges-empleado-cargo.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-employee-position-list',
  standalone: true,
  imports: [TableModule, TagModule, CommonModule],
  templateUrl: './employee-position-list.component.html',
})
export class EmployeePositionListComponent {
  @Input() items: GesEmpleadoCargo[] = [];

  @Output() edit = new EventEmitter<GesEmpleadoCargo>();
  @Output() changeRate = new EventEmitter<GesEmpleadoCargo>();
  @Output() remove = new EventEmitter<GesEmpleadoCargo>();

  getCurrentRate(item: GesEmpleadoCargo) {
    return item.tarifas?.[0] ?? null;
  }

  getEmployeeName(item: GesEmpleadoCargo): string {
    const firstName = item.usuario?.user_name ?? '';
    const lastName = item.usuario?.user_apellido ?? '';
    return `${firstName} ${lastName}`.trim() || '—';
  }
}
