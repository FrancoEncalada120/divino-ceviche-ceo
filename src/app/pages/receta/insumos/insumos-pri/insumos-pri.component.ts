import { Component } from '@angular/core';
import { InsumosListaComponent } from '../insumos-lista/insumos-lista.component';
import { NgIf } from '@angular/common';
import { InsumoService } from '../../../../core/services/insumo.service';
import { Insumo } from '../../../../core/models/insumo.model';
import { InsumosUpdInsComponent } from '../insumos-upd-ins/insumos-upd-ins.component';

@Component({
  selector: 'app-insumos-pri',
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
    //, private toast: ToastrService
  ) {}

  ngOnInit(): void {
    console.log('[Locations] ngOnInit');
    this.load();
  }

  load(): void {
    console.log('[Locations] load() start');
    this.loading = true;

    this.insumoService.getAll().subscribe({
      next: (data) => {
        console.log('[Locations] GET ok, items:', data?.length, data);
        this.insumo = data ?? [];
        this.loading = false;
      },
      error: (err) => {
        console.error('[Locations] GET error:', err);
        this.loading = false;
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
      this.insumoService.update(this.selectedInsunmos).subscribe({
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
