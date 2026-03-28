import { Component } from '@angular/core';
import { InsumosListaComponent } from '../insumos-lista/insumos-lista.component';
import { NgIf } from '@angular/common';
import { InsumoService } from '../../../../core/services/insumo.service';
import { Insumo, Proveedor } from '../../../../core/models/insumo.model';
import { InsumosUpdInsComponent } from '../insumos-upd-ins/insumos-upd-ins.component';
import { ProveedorService } from '../../../../core/services/ProveedorService';
import { forkJoin } from 'rxjs';
import { Unidad } from '../../../../core/models/unidad.model';
import { UnidadService } from '../../../../core/services/unidad.service';

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

  constructor(
    private insumoService: InsumoService,
    private proveedorService: ProveedorService,
    private unidadService: UnidadService,
    //, private toast: ToastrService
  ) {}

  ngOnInit(): void {
    console.log('[Locations] ngOnInit');
    this.load();
  }

  load(): void {
    this.loading = true;
    console.log('[LOAD] iniciando...');

    this.insumoService.getInsumoAll().subscribe({
      next: (data) => {
        console.log('[LOAD] data:', data);
        console.log('[LOAD] insumos:', data?.insumos);
        console.log('[LOAD] es array?', Array.isArray(data?.insumos));
        console.log(
          '[LOAD] length:',
          Array.isArray(data?.insumos) ? data.insumos.length : 'no es array',
        );

        this.insumo = Array.isArray(data?.insumos) ? data.insumos : [];

        console.log('[LOAD] listado final:', this.insumo);
      },
      error: (err) => {
        console.error('[LOAD] error:', err);
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
        console.log('[LOAD] complete');
      },
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
    console.log('[PARENT] modalMode:', this.modalMode);
    console.log('[PARENT] payload recibido:', payload);
    console.log('[PARENT] selectedInsunmos:', this.selectedInsunmos);

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

      console.log('[PARENT] insumoToUpdate:', insumoToUpdate);

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
