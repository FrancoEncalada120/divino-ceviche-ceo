import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';

import { GesCargoListComponent } from '../ges-cargo-list/ges-cargo-list.component';
import { GesCargoUpdInsComponent } from '../ges-cargo-upd-ins/ges-cargo-upd-ins.component';
import { GesCargo } from '../../../../core/models/ges-cargo.model';
import { GesCargoService } from '../../../../core/services/ges-cargo.service';
import { LocationService } from '../../../../core/services/location.service';
import { Location } from '../../../../core/models/location.model';

@Component({
  selector: 'app-ges-cargo-pri',
  imports: [
    NgIf,
    FormsModule,

    CardModule,
    ButtonModule,
    ProgressSpinnerModule,
    TableModule,
    InputTextModule,
    MultiSelectModule,
    InputGroupModule,
    InputGroupAddonModule,

    GesCargoListComponent,
    GesCargoUpdInsComponent,
  ],
  templateUrl: './ges-cargo-pri.component.html',
  styleUrl: './ges-cargo-pri.component.scss',
})
export class GesCargoPriComponent {
  cargos: GesCargo[] = [];
  loading = false;

  locations: Location[] = [];
  selectedLocation!: Location[];

  showCargoModal = false;
  modalMode: 'create' | 'edit' = 'create';
  selectedCargo: GesCargo | null = null;

  constructor(
    private service: GesCargoService,
    private locationService: LocationService,
  ) {}

  ngOnInit(): void {
    this.load();
    this.loadLocations();
  }

  load(): void {
    this.loading = true;

    this.service.getAll().subscribe({
      next: (data) => {
        this.cargos = data ?? [];
        this.loading = false;
      },
      error: (err) => {
        console.error('[GesCargos] GET error:', err);
        this.loading = false;
      },
    });
  }
  loadLocations(): void {
    this.locationService.getLocationAll().subscribe({
      next: (data) => {
        this.locations = data ?? [];
        this.selectedLocation = [...this.locations];
      },
      error: (err) => {
        console.error('[Locations] GET error:', err);
      },
    });
  }

  loadData() {
    this.load();
  }

  openCreate() {
    this.modalMode = 'create';
    this.selectedCargo = null;
    this.showCargoModal = true;
  }

  openEdit(cargo: GesCargo) {
    this.modalMode = 'edit';
    this.selectedCargo = cargo;
    this.showCargoModal = true;
  }

  closeModal() {
    this.showCargoModal = false;
  }

  handleSubmit(cargo: GesCargo) {
    const isCreate = this.modalMode === 'create';

    const userData = localStorage.getItem('user');
    const user = userData ? JSON.parse(userData) : null;

    if (isCreate) {
      const payload = {
        cargo_nombre: cargo.cargo_nombre,
        cargo_descripcion: cargo.cargo_descripcion,
        location_id: cargo.location_id,
        tarifa_hora: Number(cargo.tarifa_hora ?? 0),
        tarifa_hora_extra: Number(cargo.tarifa_hora_extra ?? 0),
        created_by: user?.user_id ?? null,
      };

      this.service.create(payload).subscribe({
        next: (saved) => {
          this.cargos.push(saved);
          this.closeModal();
        },
        error: (err) => {
          console.error('[GesCargos] create error:', err);
        },
      });

      return;
    }

    const payload = {
      cargo_nombre: cargo.cargo_nombre,
      cargo_descripcion: cargo.cargo_descripcion,
      cargo_estado: cargo.cargo_estado,
      location_id: cargo.location_id,
      tarifa_hora: Number(cargo.tarifa_hora ?? 0),
      tarifa_hora_extra: Number(cargo.tarifa_hora_extra ?? 0),
      updated_by: user?.user_id ?? null,
    };

    this.service.update(cargo.cargo_id, payload).subscribe({
      next: (saved) => {
        const index = this.cargos.findIndex(
          (x) => x.cargo_id === saved.cargo_id,
        );

        if (index !== -1) {
          this.cargos[index] = saved;
        }

        this.closeModal();
      },
      error: (err) => {
        console.error('[GesCargos] update error:', err);
      },
    });
  }

  handleDelete(cargo: GesCargo) {
    if (!confirm(`¿Eliminar el cargo ${cargo.cargo_nombre}?`)) {
      return;
    }

    this.service.delete(cargo.cargo_id).subscribe({
      next: () => {
        this.cargos = this.cargos.filter((x) => x.cargo_id !== cargo.cargo_id);
      },
      error: (err) => {
        console.error('[GesCargos] delete error:', err);
      },
    });
  }
}
