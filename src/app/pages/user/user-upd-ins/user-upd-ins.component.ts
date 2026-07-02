import { Component, EventEmitter, Output, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User } from '../../../core/models/user.models';
import { LocationService } from '../../../core/services/location.service';
import { Location } from '../../../core/models/location.model';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { MessageModule } from 'primeng/message';
import { TabViewModule } from 'primeng/tabview';
import { GesCargo } from '../../../core/models/ges-cargo.model';
import { GesCargoService } from '../../../core/services/ges-cargo.service';

@Component({
  selector: 'app-user-upd-ins',
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    InputTextModule,
    DropdownModule,
    MessageModule,
    TabViewModule,
  ],
  templateUrl: './user-upd-ins.component.html',
  styleUrl: './user-upd-ins.component.scss',
})
export class UserUpdInsComponent {
  @Output() close = new EventEmitter<void>();
  @Output() submit = new EventEmitter<User>();

  @Input() mode: 'create' | 'edit' = 'create';
  @Input() user: User | null = null;

  locations: Location[] = [];
  cargos: GesCargo[] = [];

  roles = [
    { label: 'SYSTEM', value: 1 },
    { label: 'ADMIN', value: 2 },
    { label: 'USER', value: 3 },
  ];

  statuses = [
    { label: 'Active', value: 'A' },
    { label: 'Inactive', value: 'D' },
  ];

  constructor(
    private locationService: LocationService,
    private gesCargoService: GesCargoService,
  ) {}

  formData: User = {
    user_apellido: '',
    user_email: '',
    user_estado: 'A',
    user_id: 0,
    user_name: '',
    user_password: '',
    user_rol: 3,
    location_id: 0,

    cargo_id: null,
    user_telefono: '',
    user_documento: '',
    user_direccion: '',
    user_fecha_ingreso: null,
    ext_code: '',
  };

  ngOnInit() {
    console.log(
      'UserUpdInsComponent initialized with mode:',
      this.mode,
      'and user:',
      this.user,
    );

    this.loadLocations();

    if (this.mode === 'edit' && this.user) {
      this.formData = { ...this.user };

      if (this.formData.location_id) {
        this.loadCargosByLocation(this.formData.location_id, true);
      }

      console.log('this.formData', this.formData);
    } else {
      const userData = localStorage.getItem('user');
      const user: User | null = userData
        ? (JSON.parse(userData) as User)
        : null;

      this.formData.location_id = user?.location_id ?? 0;
      this.formData.cargo_id = null;

      if (this.formData.location_id) {
        this.loadCargosByLocation(this.formData.location_id, false);
      }
    }
  }

  onClose() {
    this.close.emit();
  }

  onSubmit(form: any) {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    this.submit.emit(this.formData);
  }

  loadLocations(): void {
    this.locationService.getLocationAll().subscribe({
      next: (data) => {
        this.locations = data ?? [];
      },
      error: (err) => {
        console.error('[Locations] GET error:', err);
      },
    });
  }

  onLocationChange(locationId: number | null): void {
    this.formData.location_id = locationId ? Number(locationId) : 0;
    this.formData.cargo_id = null;
    this.cargos = [];

    if (!locationId || Number(locationId) === 0) {
      return;
    }

    this.loadCargosByLocation(Number(locationId), false);
  }

  loadCargosByLocation(
    locationId: number,
    keepCurrentCargo: boolean = false,
  ): void {
    this.gesCargoService
      .getAll({
        location_id: Number(locationId),
        estado: 'A',
      })
      .subscribe({
        next: (data) => {
          this.cargos = data ?? [];

          if (!keepCurrentCargo) {
            this.formData.cargo_id = null;
            return;
          }

          const exists = this.cargos.some(
            (cargo) =>
              Number(cargo.cargo_id) === Number(this.formData.cargo_id),
          );

          if (!exists) {
            this.formData.cargo_id = null;
          }
        },
        error: (err) => {
          console.error('[Cargos] GET error:', err);
          this.cargos = [];
          this.formData.cargo_id = null;
        },
      });
  }
}
