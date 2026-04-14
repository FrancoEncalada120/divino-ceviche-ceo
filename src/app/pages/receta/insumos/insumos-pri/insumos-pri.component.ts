import { Component } from '@angular/core';
import { InsumosListaComponent } from '../insumos-lista/insumos-lista.component';
import { NgIf } from '@angular/common';
import { InsumoService } from '../../../../core/services/insumo.service';
import { Insumo, Proveedor } from '../../../../core/models/insumo.model';
import { InsumosUpdInsComponent } from '../insumos-upd-ins/insumos-upd-ins.component';

import { LocationService } from '../../../../core/services/location.service';
import { Location } from '../../../../core/models/location.model';
import { UserService } from '../../../../core/services/user.service';
@Component({
  selector: 'app-insumos-pri',
  standalone: true,
  imports: [NgIf, InsumosListaComponent, InsumosUpdInsComponent],
  templateUrl: './insumos-pri.component.html',
  styleUrl: './insumos-pri.component.scss',
})
export class InsumosPriComponent {
  loading = false;
  showAddInsumoModal = false;
  modalMode: 'create' | 'edit' = 'create';
  selectedInsunmos: Insumo | null = null;
  insumo: Insumo[] = [];

  locations: Location[] = [];
  selectedLocation!: Location[];

  constructor(
    private insumoService: InsumoService,
    private locationService: LocationService,

    //, private toast: ToastrService
  ) {}

  ngOnInit(): void {
    console.log('[Locations] ngOnInit');
    this.load();
    this.loadLocations();
  }

  load(): void {
    this.loading = true;

    this.insumoService.getInsumoAll().subscribe({
      next: (data) => {
        this.insumo = Array.isArray(data?.insumos) ? data.insumos : [];
      },
      error: (err) => {
        console.error('[LOAD] error:', err);
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  loadLocations(): void {
    this.locationService.getAll().subscribe({
      next: (data) => {
        this.locations = data ?? [];
        this.selectedLocation = [...this.locations];
      },
      error: (err) => {
        console.error('[Locations] GET error:', err);
      },
      complete: () => console.log('[Locations] GET complete'),
    });
  }

  openCreate() {
    this.modalMode = 'create';
    this.selectedInsunmos = null;
    this.showAddInsumoModal = true;
  }

  openEdit(insumo: Insumo) {
    this.modalMode = 'edit';
    this.selectedInsunmos = insumo;

    this.showAddInsumoModal = true;
  }
  closeModal(): void {
    this.showAddInsumoModal = false;
    this.selectedInsunmos = null;
  }

  handleSubmit(payload: any): void {
    if (this.modalMode === 'create') {
      this.insumoService.create(payload).subscribe({
        next: () => {
          this.closeModal();
          this.load();
        },
        error: (err) => {
          console.error('[Insumos] CREATE error:', err);
        },
      });
    } else if (this.selectedInsunmos?.insumo_id) {
      const insumoToUpdate: Insumo = {
        ...this.selectedInsunmos,
        ...payload,
        insumo_id: this.selectedInsunmos.insumo_id,
      };

      this.insumoService.update(insumoToUpdate).subscribe({
        next: () => {
          this.closeModal();
          this.load();
        },
        error: (err) => {
          console.error('[Insumos] UPDATE error:', err);
        },
      });
    }
  }
}
