import { Component, EventEmitter, Output, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { MessageModule } from 'primeng/message';
import { GesCargo } from '../../../../core/models/ges-cargo.model';
import { LocationService } from '../../../../core/services/location.service';
import { User } from '../../../../core/models/user.models';
import { Location } from '../../../../core/models/location.model';

@Component({
  selector: 'app-ges-cargo-upd-ins',
  imports: [
    CommonModule,
    FormsModule,

    DialogModule,
    InputTextModule,
    DropdownModule,
    InputNumberModule,
    MessageModule,
  ],
  templateUrl: './ges-cargo-upd-ins.component.html',
  styleUrl: './ges-cargo-upd-ins.component.scss',
})
export class GesCargoUpdInsComponent {
  @Output() close = new EventEmitter<void>();
  @Output() submit = new EventEmitter<GesCargo>();

  @Input() mode: 'create' | 'edit' = 'create';
  @Input() cargo: GesCargo | null = null;

  locations: Location[] = [];

  statuses = [
    { label: 'Active', value: 'A' },
    { label: 'Inactive', value: 'D' },
  ];

  formData: GesCargo = {
    cargo_id: 0,
    cargo_nombre: '',
    cargo_descripcion: '',
    cargo_estado: 'A',
    location_id: 0,
    tarifa_hora: 0,
    tarifa_hora_extra: 0,
  };

  constructor(private locationService: LocationService) {}

  ngOnInit() {
    this.loadLocations();

    if (this.mode === 'edit' && this.cargo) {
      this.formData = {
        ...this.cargo,
        tarifa_hora: Number(this.cargo.tarifa_hora ?? 0),
        tarifa_hora_extra: Number(this.cargo.tarifa_hora_extra ?? 0),
      };
    } else {
      const userData = localStorage.getItem('user');
      const user: User | null = userData
        ? (JSON.parse(userData) as User)
        : null;

      this.formData.location_id = user?.location_id ?? 0;
      this.formData.cargo_estado = 'A';
      this.formData.tarifa_hora = 0;
      this.formData.tarifa_hora_extra = 0;
    }
  }

  onClose() {
    this.close.emit();
  }

  onSubmit() {
    if (!this.formData.cargo_nombre?.trim()) {
      alert('Ingrese el nombre del cargo');
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
}
