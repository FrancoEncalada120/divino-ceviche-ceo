import { Component } from '@angular/core';
import { RecipeListComponent } from '../recipe-list/recipe-list.component';
import { RecipeUpInsComponent } from '../recipe-up-ins/recipe-up-ins.component';
import { RecetaService } from '../../../../core/services/receta.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Receta } from '../../../../core/models/receta.model';
import { Toast } from 'primeng/toast';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { NgIf } from '@angular/common';
import { InsumoService } from '../../../../core/services/insumo.service';
import { UnidadService } from '../../../../core/services/unidad.service';

type ModalMode = 'create' | 'edit';
@Component({
  selector: 'app-recipe-pri',
  imports: [NgIf, RecipeListComponent, RecipeUpInsComponent],
  templateUrl: './recipe-pri.component.html',
  styleUrl: './recipe-pri.component.scss',
})
export class RecipePriComponent {
  loading = false;

  showAddRecetaModal = false;
  modalMode: 'create' | 'edit' = 'create';

  selectedReceta: Receta | null = null;

  recetas: Receta[] = [];
  insumosOptions: { label: string; value: number; grupo: string }[] = [];
  unidadesOptions: { label: string; value: number }[] = [];

  constructor(
    private recetaService: RecetaService,
    private insumosService: InsumoService,
    private unidadService: UnidadService,
  ) {}

  ngOnInit(): void {
    console.log('[Recetas] ngOnInit');
    this.load();
    this.loadInsumos();
    this.loadUnidades();
  }

  load(): void {
    console.log('[Recetas] load() start');
    this.loading = true;

    this.recetaService.getAll().subscribe({
      next: (data) => {
        console.log('[Recetas] GET ok, items:', data?.length, data);
        this.recetas = data ?? [];
        this.loading = false;
      },
      error: (err) => {
        console.error('[Recetas] GET error:', err);
        this.loading = false;
      },
      complete: () => console.log('[Recetas] GET complete'),
    });
  }

  loadInsumos(): void {
    this.insumosService.getAll().subscribe({
      next: (data) => {
        console.log('[Insumos] GET ok, items:', data?.length, data);

        const arr = data ?? [];
        this.insumosOptions = arr.map((x: any) => ({
          label: x.nombre, // ajusta si tu campo se llama distinto
          value: Number(x.insumo_id),
          grupo: x.grupo,
        }));
      },
      error: (err) => console.error('[Insumos] GET error:', err),
      complete: () => console.log('[Insumos] GET complete'),
    });
  }

  loadUnidades(): void {
    this.unidadService.getAll().subscribe({
      next: (data) => {
        console.log('[Unidades] GET ok, items:', data?.length, data);

        const arr = data ?? [];
        this.unidadesOptions = arr.map((x: any) => ({
          label: `${x.nombre} (${x.abreviatura})`, // ejemplo: "Liter (L)"
          value: Number(x.unidad_id),
        }));
      },
      error: (err) => console.error('[Unidades] GET error:', err),
      complete: () => console.log('[Unidades] GET complete'),
    });
  }

  openCreate(): void {
    this.modalMode = 'create';
    this.selectedReceta = null;
    this.showAddRecetaModal = true;
  }

  openEdit(receta: Receta): void {
    this.modalMode = 'edit';
    this.selectedReceta = receta;
    this.showAddRecetaModal = true;
  }

  closeModal(): void {
    this.showAddRecetaModal = false;
    this.selectedReceta = null;
  }

  // Lo conectaremos cuando tengas el modal receta-up-ins
  handleSubmit(payload: any): void {
    // Create: recetaService.createFull(payload)
    // Edit: recetaService.update(...)
    this.closeModal();
    this.load();
  }
}
