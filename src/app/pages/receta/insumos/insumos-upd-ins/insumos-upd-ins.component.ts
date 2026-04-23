import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  FormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import {
  CreateInsumoDto,
  DIA_INVENTARIO_OPTIONS,
  ESTADO_OPTIONS,
  FRECUENCIA_INVENTARIO_OPTIONS,
  GRUPOS_OPTIONS,
  Insumo,
  INVENTARIABLE_OPTIONS,
  UpdateInsumoDto,
} from '../../../../core/models/insumo.model';
import { forkJoin } from 'rxjs';
import { UnidadService } from '../../../../core/services/unidad.service';
import { ProveedorService } from '../../../../core/services/ProveedorService';
import { TabViewModule } from 'primeng/tabview';
import { InventoryPriComponent } from '../../inventory/inventory-pri/inventory-pri.component';
import { InsumosRecetaComponent } from '../insumos-receta/insumos-receta.component';
import { InventoryService } from '../../../../core/services/inventory.service';
import { CalendarModule } from 'primeng/calendar';
import { InputSwitchModule } from 'primeng/inputswitch';
import { Location } from '../../../../core/models/location.model';
import { ConfirmationService } from 'primeng/api';
import { UserService } from '../../../../core/services/user.service';

type ModalMode = 'create' | 'edit';

@Component({
  selector: 'app-insumos-upd-ins',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputNumberModule,
    DropdownModule,
    ButtonModule,
    TabViewModule,
    InventoryPriComponent,
    InsumosRecetaComponent,
    CalendarModule,
    InputSwitchModule,
    FormsModule,
  ],
  templateUrl: './insumos-upd-ins.component.html',
  styleUrl: './insumos-upd-ins.component.scss',
})
export class InsumosUpdInsComponent implements OnChanges {
  @Input() mode: ModalMode = 'create';
  @Input() insumo: Insumo | null = null;
  @Input() location: Location[] = [];

  @Output() close = new EventEmitter<void>();
  @Output() submit = new EventEmitter<CreateInsumoDto | UpdateInsumoDto>();

  form!: FormGroup;
  submitted = false;

  locationsOptions: { label: string; value: number }[] = [];
  inventoryList: any[] = [];
  insumoInventory: Insumo | null = null;
  proveedoresOptions: { label: string; value: number }[] = [];
  allUnidadesOptions: any[] = [];
  unidadesOptions: any[] = [];

  estacionesOptions: { label: string; value: number }[] = [
    { label: 'Barra', value: 1 },
    { label: 'Cocina', value: 2 },
    { label: 'Almacén', value: 3 },
  ];

  gruposOptions = GRUPOS_OPTIONS;
  estadoOptions = ESTADO_OPTIONS;
  frecuenciaInventarioOptions = FRECUENCIA_INVENTARIO_OPTIONS;
  diaInventarioOptions = DIA_INVENTARIO_OPTIONS;
  inventariableOptions = INVENTARIABLE_OPTIONS;

  constructor(
    private fb: FormBuilder,
    private proveedorService: ProveedorService,
    private unidadService: UnidadService,
    private inventoryService: InventoryService,
    private confirmationService: ConfirmationService,
    private userService: UserService,
  ) {
    this.form = this.fb.group({
      // ─── rec_insumos (base) ───────────────────────────────
      nombre: [null, Validators.required],
      descripcion: [null, Validators.required],
      grupo: [null, Validators.required],
      unidad_id: [null],
      unidad_trabajo: [null],
      es_inventariable: [true],
      estado: ['A'],
      proveedor_id: [null],
      estacion_id: [null, Validators.required],
      id_receta: [null],
      cantidad_insumo: [null],

      // ─── rec_insumos_detalle (stock e inventario) ─────────
      location_id: [null, Validators.required],
      precio_final: [null],
      stock_ideal: [null],
      frecuencia_inventario: [null],
      dia_inventario: [null],
      ultima_toma_inventario: [null],
    });
  }

  ngOnInit(): void {
    this.load();
    if (this.location) {
      this.locationsOptions = this.location.map((loc) => ({
        label: loc.location_name,
        value: loc.location_id,
      }));

      if (
        this.locationsOptions.length > 0 &&
        !this.form.get('location_id')?.value
      ) {
        this.form.patchValue({ location_id: this.locationsOptions[0].value });
      }
    }
  }

  load(): void {
    forkJoin({
      proveedores: this.proveedorService.getAll(),
      unidades: this.unidadService.getAll(),
      inventarios: this.inventoryService.getAll(
        this.insumo?.insumo_id
          ? { insumo_id: this.insumo.insumo_id }
          : undefined,
      ),
    }).subscribe({
      next: ({ proveedores, unidades, inventarios }) => {
        this.proveedoresOptions = (proveedores ?? []).map((p) => ({
          label: p.nombre,
          value: p.proveedor_id,
        }));

        this.allUnidadesOptions = (unidades ?? []).map((u) => ({
          label: u.nombre,
          value: u.unidad_id,
          grupo: u.grupo,
        }));

        this.inventoryList = [...(inventarios ?? [])];
        this.unidadesOptions = [...this.allUnidadesOptions];

        this.loadForm();
        this.listenGrupoChanges();
      },
      error: (err) => console.error('[LOAD] error:', err),
    });
  }

  listenGrupoChanges(): void {
    this.form.get('grupo')?.valueChanges.subscribe((grupo) => {
      this.unidadesOptions = grupo
        ? this.allUnidadesOptions.filter((u) => u.grupo === grupo)
        : [...this.allUnidadesOptions];
      this.form.get('unidad_id')?.setValue(null);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['insumo'] || changes['mode']) {
      this.loadForm();
    }
  }

  private loadForm(): void {
    if (this.mode === 'edit' && this.insumo) {
      const detalle = this.insumo.insumos_detalles?.[0];

      this.form.patchValue({
        // ─── rec_insumos (base) ─────────────────────────────
        nombre: this.insumo.nombre ?? null,
        descripcion: this.insumo.descripcion ?? null,
        grupo: this.insumo.grupo ?? null,
        unidad_id: this.insumo.unidad?.unidad_id ?? null,
        unidad_trabajo: this.insumo.unidadTrabajo?.unidad_id ?? null,
        es_inventariable: this.insumo.es_inventariable ?? true,
        estado: this.insumo.estado ?? 'A',
        proveedor_id: this.insumo.proveedor_id ?? null,
        estacion_id: this.insumo.estacion_id ?? null,
        id_receta: this.insumo.id_receta ?? null,
        cantidad_insumo: this.insumo.cantidad_insumo ?? null,

        // ─── rec_insumos_detalle ────────────────────────────
        location_id: detalle?.location_id ?? null,
        precio_final: detalle?.precio_final ?? null,
        stock_ideal: detalle?.stock_ideal ?? null,
        frecuencia_inventario: detalle?.frecuencia_inventario ?? null,
        dia_inventario: detalle?.dia_inventario ?? null,
        ultima_toma_inventario: detalle?.ultima_toma_inventario
          ? new Date(detalle.ultima_toma_inventario)
          : null,
      });
    } else {
      this.form.reset({
        nombre: null,
        descripcion: null,
        grupo: null,
        unidad_id: null,
        unidad_trabajo: null,
        es_inventariable: true,
        estado: 'A',
        proveedor_id: null,
        estacion_id: null,
        id_receta: null,
        cantidad_insumo: null,
        location_id: this.locationsOptions[0]?.value ?? null,
        precio_final: null,
        stock_ideal: null,
        frecuencia_inventario: null,
        dia_inventario: null,
        ultima_toma_inventario: null,
      });
    }

    this.submitted = false;
  }

  onClose(): void {
    this.close.emit();
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const auditUserId = this.userService.getUser()?.user_id;
    const raw = this.form.getRawValue();

    if (this.mode === 'create') {
      this.confirmationService.confirm({
        message: '¿Quieres grabar este insumo para todas las sedes?',
        header: 'Confirmación de Alcance',
        icon: 'pi pi-question-circle',
        acceptLabel: 'Sí, todos los locales',
        rejectLabel: 'No, solo este local',
        accept: () => this.processCreate(raw, auditUserId, true),
        reject: () => this.processCreate(raw, auditUserId, false),
      });
      return;
    }

    // ─── Update ───────────────────────────────────────────────
    const payload: UpdateInsumoDto = {
      // rec_insumos (base)
      nombre: raw.nombre?.trim() ?? undefined,
      descripcion: raw.descripcion?.trim() ?? undefined,
      grupo: raw.grupo ?? undefined,
      unidad_id: raw.unidad_id ?? undefined,
      unidad_trabajo: raw.unidad_trabajo ?? undefined,
      es_inventariable: raw.es_inventariable ?? undefined,
      estado: raw.estado ?? undefined,
      proveedor_id: raw.proveedor_id ?? undefined,
      estacion_id: raw.estacion_id ?? undefined,
      id_receta: raw.id_receta ?? undefined,
      cantidad_insumo: raw.cantidad_insumo ?? undefined,

      // rec_insumos_detalle
      location_id: Number(raw.location_id),
      precio_final: raw.precio_final ?? undefined,
      stock_ideal: raw.stock_ideal ?? undefined,
      frecuencia_inventario: raw.frecuencia_inventario ?? undefined,
      dia_inventario: raw.dia_inventario ?? undefined,
      ultima_toma_inventario: raw.ultima_toma_inventario ?? undefined,

      updated_by: auditUserId,
    };

    this.submit.emit(payload);
  }

  private processCreate(
    raw: any,
    auditUserId: any,
    todosLocales: boolean,
  ): void {
    const payload: CreateInsumoDto = {
      // rec_insumos (base)
      nombre: raw.nombre?.trim() ?? '',
      descripcion: raw.descripcion?.trim() ?? '',
      grupo: raw.grupo ?? null,
      unidad_id: raw.unidad_id ? Number(raw.unidad_id) : null,
      unidad_trabajo: raw.unidad_trabajo ? Number(raw.unidad_trabajo) : null,
      es_inventariable: raw.es_inventariable ?? true,
      proveedor_id: raw.proveedor_id ? Number(raw.proveedor_id) : null,
      estacion_id: raw.estacion_id ? Number(raw.estacion_id) : null,
      id_receta: raw.id_receta ? Number(raw.id_receta) : null,
      cantidad_insumo:
        raw.cantidad_insumo != null ? Number(raw.cantidad_insumo) : null,
      created_by: auditUserId,

      // rec_insumos_detalle
      location_id: raw.location_id ? Number(raw.location_id) : null,
      stock: 0,
      precio_final: raw.precio_final != null ? Number(raw.precio_final) : null,
      stock_ideal: raw.stock_ideal != null ? Number(raw.stock_ideal) : null,
      frecuencia_inventario: raw.frecuencia_inventario ?? null,
      dia_inventario: raw.dia_inventario ?? null,
      ultima_toma_inventario: raw.ultima_toma_inventario ?? null,

      todoslocales: todosLocales,
    };

    this.submit.emit(payload);
  }

  get f() {
    return this.form.controls;
  }
}
