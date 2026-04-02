import { Component } from '@angular/core';
import { InsumoService } from '../../../../core/services/insumo.service';
import { UnidadService } from '../../../../core/services/unidad.service';
import { NgIf } from '@angular/common';
import { GroupsListComponent } from '../group-list/group-list.component';
import { GroupUpInsComponent } from '../group-up-ins/group-up-ins.component';
import { RecGroupService } from '../../../../core/services/group.service';
import { Grupo, grupoCreateRequest } from '../../../../core/models/grupos.model';
import { MessageService } from 'primeng/api';

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

  selectedConversion: Grupo | null = null;

  conversiones: Grupo[] = [];

  insumosOptions: { label: string; value: number; grupo: string }[] = [];
  unidadesOptions: { label: string; value: number }[] = [];

  constructor(
    private grupoService: RecGroupService,
    private insumosService: InsumoService,
    private unidadService: UnidadService,
    private messageService: MessageService
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

    this.grupoService.getGrupoAll().subscribe({
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

  openEdit(conv: Grupo): void {
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
  handleSubmit(payload: Grupo): void {
    console.log('[Conversion] payload', payload);

    const data: grupoCreateRequest = {
      Grupo: payload
    };

    if (this.modalMode === 'create') {
      this.grupoService.create(data).subscribe({
        next: () => {
          this.closeModal();
          this.load();
        },
        error: (err) => console.error(err),
      });
    } else {
      this.grupoService
        .update(this.selectedConversion!.grupo_id, data)
        .subscribe({
          next: () => {
            this.closeModal();
            this.load();
          },
          error: (err) => console.error(err),
        });
    }
  }

  Delete(compra: Grupo) {

    this.selectedConversion = compra;
    this.showModal = false;

    if (!compra?.grupo_id) return;

    const confirmDelete = confirm(
      `¿Seguro que deseas eliminar la compra ${compra.grupo_id}?`
    );

    if (!confirmDelete) return;

    this.grupoService.delete(compra.grupo_id).subscribe({
      next: () => {

        // 🔥 eliminar del array local (UX rápida)
        this.conversiones = this.conversiones.filter(
          c => c.grupo_id !== compra.grupo_id
        );

        this.messageService.add({
          severity: 'success',
          summary: 'Deleted',
          detail: 'Grupo eliminada correctamente',
        });
        // recargar para actualizar la lista

      },
      error: (err) => {
        console.error('[Grupo] delete error:', err);

        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.message || 'Error eliminando compra',
        });
      }
    });
  }

}
