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

  Todoslocales: boolean = false;

  locationsOptions: { label: string; value: number }[] = [];
  inventoryList: any[] = [];
  insumos: Insumo[] = [];
  insumoInventory: Insumo | null = null;
  proveedoresOptions: { label: string; value: number }[] = [];

  estacionesOptions: { label: string; value: number }[] = [
    { label: 'Barra', value: 1 },
    { label: 'Cocina', value: 2 },
    { label: 'Almacén', value: 3 },
  ];
  allUnidadesOptions: any[] = [];
  unidadesOptions: any[] = [];

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
      nombre: [null, Validators.required],
      descripcion: [null, Validators.required],
      grupo: [null, Validators.required],
      proveedor_id: [null],
      estacion_id: [null, Validators.required],
      unidad_id: [null],
      unidad_trabajo: [null],
      cantidad: [null],
      stock_ideal: [null, Validators.required],
      frecuencia_inventario: [null],
      dia_inventario: [null],
      ultima_toma_inventario: [null],
      es_inventariable: [true],
      location_id: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    console.log('[Locations] ngOnInit');
    this.load();
    if (this.location) {
      this.locationsOptions = this.location.map((loc) => ({
        label: loc.location_name,
        value: loc.location_id,
      }));
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
      error: (err) => {
        console.error('[LOAD] error:', err);
      },
    });
  }

  listenGrupoChanges(): void {
    this.form.get('grupo')?.valueChanges.subscribe((grupo) => {
      console.log('[GRUPO] seleccionado:', grupo);

      if (!grupo) {
        this.unidadesOptions = [...this.allUnidadesOptions];
      } else {
        this.unidadesOptions = this.allUnidadesOptions.filter(
          (u) => u.grupo === grupo,
        );
      }

      // limpia unidad seleccionada al cambiar grupo
      this.form.get('unidad_id')?.setValue(null);

      console.log('[GRUPO] unidades filtradas:', this.unidadesOptions);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['insumo'] || changes['mode']) {
      this.loadForm();
    }
  }

  private loadForm(): void {
    if (this.mode === 'edit' && this.insumo) {
      console.log('[EDIT insumo]', this.insumo);

      this.form.patchValue({
        nombre: this.insumo.nombre ?? null,
        descripcion: this.insumo.descripcion ?? null,
        grupo: this.insumo.grupo ?? null,
        proveedor_id: this.insumo.proveedor.proveedor_id ?? null,
        unidad_id: this.insumo.unidad.unidad_id ?? null,
        unidad_trabajo: this.insumo.unidad_trabajo?.unidad_id ?? null,
        cantidad: Number(this.insumo.cantidad ?? 0),
        stock_ideal: Number(this.insumo.stock_ideal ?? 0),
        stock: Number(this.insumo.stock ?? 0),
        estado: this.insumo.estado ?? 'A',
        precio_final: Number(this.insumo.precio_final ?? 0),
        estacion_id: this.insumo.estacion_id?.estacion_id ?? null,
        frecuencia_inventario: this.insumo.frecuencia_inventario ?? null,
        dia_inventario: this.insumo.dia_inventario ?? null,
        ultima_toma_inventario: this.insumo.ultima_toma_inventario
          ? new Date(this.insumo.ultima_toma_inventario)
          : null,
        es_inventariable: this.insumo.es_inventariable ?? true,
        // location_id:
        //  this.insumo.location_id ?? this.insumo.location?.location_id ?? null,
      });
    } else {
      this.form.reset({
        nombre: null,
        descripcion: null,
        grupo: null,
        proveedor_id: null,
        unidad_id: null,
        cantidad: 0,
        stock_ideal: 0,
        stock: 0,
        estado: 'A',
        estacion_id: null,
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
        accept: () => {
          // Ejecutamos la lógica enviando true
          this.processCreate(raw, auditUserId, true);
        },
        reject: () => {
          // Ejecutamos la lógica enviando false
          this.processCreate(raw, auditUserId, false);
        },
      });
      // NO poner código aquí, ya que se ejecutaría antes de la confirmación
      return;
    }

    // Lógica para modo 'update' (esto sí se ejecuta directo porque no tiene confirmación)
    const payload: UpdateInsumoDto = {
      // ... (tu mapeo de campos de actualización)
      updated_by: auditUserId,
    };
    this.submit.emit(payload);
  }

  // Función auxiliar para no repetir código en Create
  private processCreate(
    raw: any,
    auditUserId: any,
    todosLocales: boolean,
  ): void {
    const payload: CreateInsumoDto = {
      nombre: raw.nombre?.trim() ?? '',
      descripcion: raw.descripcion?.trim() ?? '',
      grupo: raw.grupo ?? null,
      proveedor_id: raw.proveedor_id ? Number(raw.proveedor_id) : null,
      estacion_id: raw.estacion_id ? Number(raw.estacion_id) : null,
      unidad_id: raw.unidad_id ? Number(raw.unidad_id) : null,
      unidad_trabajo: raw.unidad_trabajo ? Number(raw.unidad_trabajo) : null,
      cantidad: raw.cantidad != null ? Number(raw.cantidad) : null,
      stock_ideal: raw.stock_ideal != null ? Number(raw.stock_ideal) : null,
      frecuencia_inventario: raw.frecuencia_inventario ?? null,
      dia_inventario: raw.dia_inventario ?? null,
      ultima_toma_inventario: raw.ultima_toma_inventario ?? null,
      es_inventariable: raw.es_inventariable ?? true,
      location_id: raw.location_id ? Number(raw.location_id) : null,
      created_by: auditUserId,
      todoslocales: todosLocales, // Usamos el parámetro pasado por la confirmación
    };

    this.submit.emit(payload);
  }

  get f() {
    return this.form.controls;
  }
}
