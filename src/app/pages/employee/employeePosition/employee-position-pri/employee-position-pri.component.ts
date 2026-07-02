import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { EmployeePositionListComponent } from '../employee-position-list/employee-position-list.component';
import { EmployeePositionUpdInsComponent } from '../employee-position-upd-ins/employee-position-upd-ins.component';
import { GesCargo } from '../../../../core/models/ges-cargo.model';
import {
  GesEmpleadoCargo,
  CreateGesEmpleadoCargoDto,
  UpdateGesEmpleadoCargoDto,
} from '../../../../core/models/ges-empleado-cargo.model';
import { User } from '../../../../core/models/user.models';
import { GesCargoService } from '../../../../core/services/ges-cargo.service';
import { GesEmpleadoCargoService } from '../../../../core/services/ges-empleado-cargo.service';
import { LocationService } from '../../../../core/services/location.service';
import { UserService } from '../../../../core/services/user.service';
import { Location } from '../../../../core/models/location.model';

@Component({
  selector: 'app-employee-position-pri',
  imports: [
    NgIf,
    FormsModule,
    CardModule,
    DropdownModule,
    InputGroupModule,
    InputGroupAddonModule,
    EmployeePositionListComponent,
    EmployeePositionUpdInsComponent,
  ],
  templateUrl: './employee-position-pri.component.html',
  styleUrl: './employee-position-pri.component.scss',
})
export class EmployeePositionPriComponent {
  items: GesEmpleadoCargo[] = [];
  users: User[] = [];
  locations: Location[] = [];
  cargos: GesCargo[] = [];

  loading = false;

  selectedLocationId: number | null = null;
  selectedStatus: string | null = 'A';

  showModal = false;
  modalMode: 'create' | 'edit' | 'rate' = 'create';
  selectedItem: GesEmpleadoCargo | null = null;

  statuses = [
    { label: 'All statuses', value: null },
    { label: 'Active', value: 'A' },
    { label: 'Inactive', value: 'I' },
  ];

  constructor(
    private service: GesEmpleadoCargoService,
    private userService: UserService,
    private locationService: LocationService,
    private gesCargoService: GesCargoService,
  ) {}

  ngOnInit(): void {
    this.loadCatalogs();
    this.load();
  }

  load(): void {
    this.loading = true;

    this.service
      .getAll({
        location_id: this.selectedLocationId,
        estado: this.selectedStatus,
      })
      .subscribe({
        next: (data) => {
          this.items = data ?? [];
          this.loading = false;
        },
        error: (err) => {
          console.error('[Employee Positions] GET error:', err);
          this.loading = false;
        },
      });
  }

  loadCatalogs(): void {
    this.locationService.getLocationAll().subscribe({
      next: (data) => (this.locations = data ?? []),
      error: (err) => console.error('[Locations] GET error:', err),
    });

    this.userService.getAll([]).subscribe({
      next: (data) => (this.users = data ?? []),
      error: (err) => console.error('[Users] GET error:', err),
    });

    this.gesCargoService.getAll({ estado: 'A' }).subscribe({
      next: (data) => (this.cargos = data ?? []),
      error: (err) => console.error('[Positions] GET error:', err),
    });
  }

  openCreate(): void {
    this.modalMode = 'create';
    this.selectedItem = null;
    this.showModal = true;
  }

  openEdit(item: GesEmpleadoCargo): void {
    this.modalMode = 'edit';
    this.selectedItem = item;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  handleSubmit(
    payload: CreateGesEmpleadoCargoDto | UpdateGesEmpleadoCargoDto,
  ): void {
    const isCreate = this.modalMode === 'create';

    const request$ = isCreate
      ? this.service.create(payload as CreateGesEmpleadoCargoDto)
      : this.service.update(
          (payload as UpdateGesEmpleadoCargoDto).empleado_cargo_id,
          payload as UpdateGesEmpleadoCargoDto,
        );

    request$.subscribe({
      next: () => {
        this.closeModal();
        this.load();
      },
      error: (err) => {
        console.error('[Employee Positions] Save error:', err);
      },
    });
  }

  delete(item: GesEmpleadoCargo): void {
    const ok = window.confirm(
      'Are you sure you want to delete this employee position?',
    );

    if (!ok) return;

    this.service.delete(item.empleado_cargo_id).subscribe({
      next: () => this.load(),
      error: (err) => console.error('[Employee Positions] Delete error:', err),
    });
  }

  changeRate(item: GesEmpleadoCargo): void {
    this.modalMode = 'rate';
    this.selectedItem = item;
    this.showModal = true;
  }
}
