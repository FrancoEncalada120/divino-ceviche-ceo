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
import { PurchaseConfirmationComponent } from '../../purchase/purchase-confirmation/purchase-confirmation.component';
import { LocationService } from '../../../../core/services/location.service';
import { Location } from '../../../../core/models/location.model';
import { UserService } from '../../../../core/services/user.service';

type ModalMode = 'create' | 'edit';
@Component({
  selector: 'app-recipe-pri',
  imports: [
    NgIf,
    RecipeListComponent,
    RecipeUpInsComponent,
    PurchaseConfirmationComponent,
  ],
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
  showConfirmanModal = false;
  txtDetail: string = '';
  txtSummary: string = '';
  recetas_impactadas: Receta[] = [];
  locations: Location[] = [];
  selectedLocation!: Location[];

  constructor(
    private recetaService: RecetaService,
    private insumosService: InsumoService,
    private locationService: LocationService,
    private unidadService: UnidadService,
    private userService: UserService,
  ) {}

  ngOnInit(): void {
    console.log('[Recetas] ngOnInit');
    this.load();
    this.loadInsumos();
    this.loadUnidades();
    this.loadLocations();
  }

  load(): void {
    console.log('[Recetas] load() start');
    this.loading = true;

    const locationId = this.userService.getUser()?.location_id;

    this.recetaService.getAll(locationId).subscribe({
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

  loadLocations(): void {
    this.locationService.getLocationAll().subscribe({
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

  loadInsumos(): void {
    const auditUserId = this.userService.getUser()?.location_id;

    this.insumosService
      .getInsumoAll({
        bGrupo: 1,
        location_id: auditUserId, // 👈
      })
      .subscribe({
        next: (data) => {
          const arr = data.insumos ?? [];
          const arrGrupo = data.grupos ?? [];

          this.insumosOptions = arr.map((x: any) => ({
            label: x.nombreCompleto,
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
    const isEdit =
      this.modalMode === 'edit' && !!this.selectedReceta?.receta_id;

    const request$ = isEdit
      ? this.recetaService.updateFull(this.selectedReceta!.receta_id, payload)
      : this.recetaService.createFull(payload);

    request$.subscribe({
      next: (res) => {
        const recetaId = isEdit
          ? this.selectedReceta!.receta_id
          : res?.receta?.[0]?.receta_id;

        // ─── solo en create y si es_insumo ────────────────────
        if (!isEdit && payload.receta.es_insumo && recetaId) {
          const insumoPayload: CreateInsumoDto = {
            // ─── rec_insumos ──────────────────────────────────
            nombre: payload.receta.nombre,
            descripcion: payload.receta.descripcion ?? payload.receta.nombre,
            grupo: null,
            unidad_id: null,
            unidad_trabajo: null,
            es_inventariable: true,
            proveedor_id: null,
            estacion_id: null,
            id_receta: recetaId,
            cantidad_insumo: null,
            created_by: payload.receta.created_by ?? null,
            // ─── rec_insumos_detalle ──────────────────────────
            location_id: payload.receta.location_id ?? null,
            stock: 0,
            precio_final: payload.receta.costo_neto ?? null,
            stock_ideal: null,
            frecuencia_inventario: null,
            dia_inventario: null,
            ultima_toma_inventario: null,
            todoslocales: payload.receta.todoslocales ?? false,
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
              this.closeModal();
              this.load();
            },
          });

          return;
        }

        this.closeModal();
        this.load();
      },
      error: (err) => {
        console.error('[RECETAS] error =>', err);
        console.error('[RECETAS] error.error =>', err?.error);
        console.error('[RECETAS] error.errors =>', err?.error?.errors);
      },
    });
  }

  closeModalConfirm() {
    this.showConfirmanModal = false;
  }
}
