import { Component } from '@angular/core';
import { InsumosListaComponent } from '../insumos-lista/insumos-lista.component';
import { NgClass, NgIf } from '@angular/common';
import { InsumoService } from '../../../../core/services/insumo.service';
import { Insumo, Proveedor } from '../../../../core/models/insumo.model';
import { InsumosUpdInsComponent } from '../insumos-upd-ins/insumos-upd-ins.component';

import { LocationService } from '../../../../core/services/location.service';
import { Location } from '../../../../core/models/location.model';
import { UserService } from '../../../../core/services/user.service';
import { Card } from 'primeng/card';
import { MultiSelect, MultiSelectModule } from 'primeng/multiselect';
import { FormsModule } from '@angular/forms';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
@Component({
  selector: 'app-insumos-pri',
  standalone: true,
  imports: [
    NgIf,
    InsumosListaComponent,
    InsumosUpdInsComponent,
    FormsModule,
    Card,
    MultiSelect,
    MultiSelectModule,
    InputGroupModule,
    InputGroupAddonModule,
  ],
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
    private userService: UserService,

    //, private toast: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadLocations();
  }

  load(): void {
    this.loading = true;

    const user = this.userService.getUser();
    const auditUserId = user?.location_id;

    console.log('================ LOAD INSUMOS2 ================');
    console.log('selectedLocation:', this.selectedLocation);
    console.log('Cantidad:', this.selectedLocation?.length);

    this.selectedLocation?.forEach((loc, index) => {
      console.log(
        `[${index}] id=${loc.location_id}, nombre=${loc.location_name}`,
      );
    });

    const locationIds = this.selectedLocation
      .map((loc) => loc.location_id)
      .join(',');

    const params = {
      location_id: locationIds,
    };

    console.log('[LOAD] Params enviados al servicio:', params);

    this.insumoService.getInsumoAll(params).subscribe({
      next: (data) => {
        console.log('[LOAD] Respuesta completa del backend:', data);
        console.log('[LOAD] data.insumos:', data?.insumos);
        console.log(
          '[LOAD] ¿data.insumos es array?:',
          Array.isArray(data?.insumos),
        );

        this.insumo = Array.isArray(data?.insumos) ? data.insumos : [];

        console.log('[LOAD] Insumos asignados a this.insumo:', this.insumo);
        console.log('[LOAD] Total insumos:', this.insumo.length);
      },
      error: (err) => {
        console.error('[LOAD] Error del servicio:', err);
        console.error('[LOAD] Status:', err?.status);
        console.error('[LOAD] Error body:', err?.error);

        this.loading = false;
      },
      complete: () => {
        console.log('[LOAD] Petición completada');
        this.loading = false;
        console.log('[LOAD] Loading:', this.loading);
      },
    });
  }

  loadLocations(): void {
    const user = this.userService.getUser();

    this.locationService.getLocationAll().subscribe({
      next: (data) => {
        this.locations = data ?? [];

        if (user?.user_rol === 1) {
          // Administrador: todas las sedes seleccionadas
          this.selectedLocation = [...this.locations];
        } else {
          // Usuario normal: solo su sede
          this.selectedLocation = this.locations.filter(
            (x) => x.location_id === user?.location_id,
          );
        }

        console.log('selectedLocation:', this.selectedLocation);

        // Ya existe selectedLocation
        this.load();
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  loadData() {
    this.load();
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

      // 1. Descomentar esta sección
      // 2. Cambiar el "1" quemado por el ID dinámico: this.selectedInsunmos.insumo_id
      this.insumoService
        .update(this.selectedInsunmos.insumo_id, payload)
        .subscribe({
          next: () => {
            this.closeModal(); // Cierra el modal al terminar
            this.load(); // Refresca la tabla
          },
          error: (err) => {
            console.error('[Insumos] UPDATE error:', err);
          },
        });
    }
  }
}
