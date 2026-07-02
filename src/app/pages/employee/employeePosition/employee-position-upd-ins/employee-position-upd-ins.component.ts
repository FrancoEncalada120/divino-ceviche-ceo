import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { GesCargo } from '../../../../core/models/ges-cargo.model';
import {
  GesEmpleadoCargo,
  CreateGesEmpleadoCargoDto,
  UpdateGesEmpleadoCargoDto,
} from '../../../../core/models/ges-empleado-cargo.model';
import { User } from '../../../../core/models/user.models';
import { Location } from '../../../../core/models/location.model';

@Component({
  selector: 'app-employee-position-upd-ins',
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    DropdownModule,
    InputTextModule,
    MessageModule,
    CheckboxModule,
  ],
  templateUrl: './employee-position-upd-ins.component.html',
  styleUrl: './employee-position-upd-ins.component.scss',
})
export class EmployeePositionUpdInsComponent {
  @Input() mode: 'create' | 'edit' | 'rate' = 'create';
  @Input() item: GesEmpleadoCargo | null = null;

  @Input() users: User[] = [];
  @Input() locations: Location[] = [];
  @Input() cargos: GesCargo[] = [];

  @Output() close = new EventEmitter<void>();
  @Output() submit = new EventEmitter<
    CreateGesEmpleadoCargoDto | UpdateGesEmpleadoCargoDto
  >();

  statuses = [
    { label: 'Active', value: 'A' },
    { label: 'Inactive', value: 'I' },
  ];

  formData: any = {
    empleado_cargo_id: 0,
    user_id: null,
    cargo_id: null,
    location_id: null,
    estado: 'A',
    fecha_inicio: '',
    fecha_fin: null,

    tarifa_hora: 0,
    tarifa_hora_extra: 0,
    aplica_impuesto: false,
    porcentaje_impuesto: 0,
    motivo: 'Initial rate',
  };

  ngOnInit(): void {
    if ((this.mode === 'edit' || this.mode === 'rate') && this.item) {
      this.formData = {
        empleado_cargo_id: this.item.empleado_cargo_id,
        user_id: this.item.user_id,
        cargo_id: this.item.cargo_id,
        location_id: this.item.location_id,
        estado: this.item.estado,
        fecha_inicio: this.item.fecha_inicio,
        fecha_fin: this.item.fecha_fin,
        tarifa_hora: 0,
        tarifa_hora_extra: 0,
        aplica_impuesto: false,
        porcentaje_impuesto: 0,
        motivo: 'Update rate',
      };
      return;
    }

    const userData = localStorage.getItem('user');
    const currentUser: User | null = userData ? JSON.parse(userData) : null;

    this.formData.location_id = currentUser?.location_id ?? null;
  }

  onClose(): void {
    this.close.emit();
  }

  onSubmit(): void {
    this.submit.emit(this.formData);
  }
}
