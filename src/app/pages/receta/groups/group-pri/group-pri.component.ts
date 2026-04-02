import { Component } from '@angular/core';
import { RecConversion } from '../../../../core/models/conversion.model';
import { InsumoService } from '../../../../core/services/insumo.service';
import { UnidadService } from '../../../../core/services/unidad.service';
import { NgIf } from '@angular/common';
import { GroupsListComponent } from '../group-list/group-list.component';
import { GroupUpInsComponent } from '../group-up-ins/group-up-ins.component';
import { RecGroupService } from '../../../../core/services/group.service';

type ModalMode = 'create' | 'edit';

@Component({
  selector: 'app-group-pri',
  imports: [NgIf, GroupsListComponent, GroupUpInsComponent],
  templateUrl: './group-pri.component.html',
  styleUrl: './group-pri.component.scss',
})
export class GroupPriComponent {
  loading = false;

  showModal = false;
  modalMode: ModalMode = 'create';

  selectedConversion: RecConversion | null = null;

  conversiones: RecConversion[] = [];

  insumosOptions: { label: string; value: number; grupo: string }[] = [];
  unidadesOptions: { label: string; value: number }[] = [];

  constructor(
    private conversionService: RecGroupService,
    private insumosService: InsumoService,
    private unidadService: UnidadService,
  ) { }

  ngOnInit(): void {
    console.log('[Conversion] ngOnInit');
    this.load();
    this.loadInsumos();
    this.loadUnidades();
  }

  /* ===============================
     LOAD DATA
  ================================ */
  load(): void {
    this.loading = true;

    this.conversionService.getAll().subscribe({
      next: (data) => {
        console.log('[Conversion] GET ok:', data);
        this.conversiones = data ?? [];
        this.loading = false;
      },
      error: (err) => {
        console.error('[Conversion] GET error:', err);
        this.loading = false;
      },
    });
  }

  loadInsumos(): void {
    this.insumosService.getInsumoAll().subscribe({
      next: (data) => {
        const arr = data.insumos ?? [];


        this.insumosOptions = arr.map((x: any) => ({
          label: x.nombre,
          value: Number(x.insumo_id),
          grupo: x.grupo,
        }));



        // Agregar las opciones Recetas

      },
      error: (err) => console.error('[Insumos] error:', err),
    });
  }

  loadUnidades(): void {
    this.unidadService.getAll().subscribe({
      next: (data) => {
        const arr = data ?? [];

        this.unidadesOptions = arr.map((x: any) => ({
          label: `${x.nombre} (${x.abreviatura})`,
          value: Number(x.unidad_id),
        }));
      },
      error: (err) => console.error('[Unidades] error:', err),
    });
  }

  /* ===============================
     MODAL
  ================================ */
  openCreate(): void {
    this.modalMode = 'create';
    this.selectedConversion = null;
    this.showModal = true;
  }

  openEdit(conv: RecConversion): void {
    this.modalMode = 'edit';
    this.selectedConversion = conv;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedConversion = null;
  }

  /* ===============================
     SUBMIT
  ================================ */
  handleSubmit(payload: any): void {
    console.log('[Conversion] payload', payload);

    if (this.modalMode === 'create') {
      this.conversionService.create(payload).subscribe({
        next: () => {
          this.closeModal();
          this.load();
        },
        error: (err) => console.error(err),
      });
    } else {
      this.conversionService
        .update(this.selectedConversion!.id, payload)
        .subscribe({
          next: () => {
            this.closeModal();
            this.load();
          },
          error: (err) => console.error(err),
        });
    }
  }
}
