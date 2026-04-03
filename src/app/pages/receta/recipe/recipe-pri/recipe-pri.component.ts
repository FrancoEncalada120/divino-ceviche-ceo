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
import { RecetaFullCreate } from '../../../../core/models/receta-full-create.model';
import { CreateInsumoDto } from '../../../../core/models/insumo.model';

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
    this.insumosService
      .getInsumoAll({
        bGrupo: 1,
      })
      .subscribe({
        next: (data) => {
          const arr = data.insumos ?? [];
          const arrGrupo = data.grupos ?? [];

          this.insumosOptions = arr.map((x: any) => ({
            label: x.nombre, // ajusta si tu campo se llama distinto
            value: Number(x.insumo_id),
            grupo: x.grupo,
          }));

          this.insumosOptions.unshift(
            ...arrGrupo.flatMap((g: any) =>
              g.detalles.map((d: any) => ({
                label: 'Grupo: ' + g.grupo_nombre,
                value: d.insumo.insumo_id,
                grupo: g.grupo_id,
              })),
            ),
          );

          this.insumosOptions = this.insumosOptions.sort((a, b) =>
            a.label.localeCompare(b.label),
          );
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

  handleSubmit(payload: RecetaFullCreate): void {
    console.log('[PADRE] payload recibido =>', payload);

    const isEdit =
      this.modalMode === 'edit' && !!this.selectedReceta?.receta_id;

    const request$ = isEdit
      ? this.recetaService.updateFull(this.selectedReceta!.receta_id, payload)
      : this.recetaService.createFull(payload);

    request$.subscribe({
      next: (res) => {
        console.log('[RECETA] respuesta completa =>', res);
        console.log('[RECETA] receta =>', res?.receta);
        console.log('[RECETA] receta.receta_id =>', res?.receta?.receta_id);

        const recetaId = isEdit
          ? this.selectedReceta!.receta_id
          : res?.receta?.receta_id;

        console.log('[RECETA] recetaId final =>', recetaId);
        console.log('[RECETA] es_insumo =>', payload.receta.es_insumo);

        if (payload.receta.es_insumo && recetaId) {
          const insumoPayload: CreateInsumoDto = {
            nombre: payload.receta.nombre,
            descripcion: payload.receta.descripcion ?? payload.receta.nombre,
            proveedor_id: 24,
            estacion_id: 1,
            unidad_id: payload.receta.unidad_receta,
            unidad_trabajo: payload.receta.unidad_receta,
            cantidad: payload.receta.cantidad_receta,
            stock_ideal: 0,
            created_by: 1,
            id_receta: recetaId,
          };

          console.log('[INSUMO] payload enviado =>', insumoPayload);

          this.insumosService.create(insumoPayload).subscribe({
            next: (insumoRes) => {
              console.log('[INSUMO] creado automáticamente =>', insumoRes);
              this.closeModal();
              this.load();
            },
            error: (err) => {
              console.error('[INSUMO] error =>', err);
              console.error('[INSUMO] error.error =>', err?.error);
              console.error('[INSUMO] error.message =>', err?.error?.message);
              this.closeModal();
              this.load();
            },
          });

          return;
        }

        console.warn('[INSUMO] No se creó porque recetaId vino vacío');
        this.closeModal();
        this.load();
      },
      error: (err) => {
        console.error('[RECETAS] error =>', err);
      },
    });
  }
}
