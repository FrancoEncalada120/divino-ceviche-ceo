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
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { Insumo, Proveedor } from '../../../../core/models/insumo.model';
import { forkJoin } from 'rxjs';
import { UnidadService } from '../../../../core/services/unidad.service';
import { ProveedorService } from '../../../../core/services/ProveedorService';

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
  ],
  templateUrl: './insumos-upd-ins.component.html',
  styleUrl: './insumos-upd-ins.component.scss',
})
export class InsumosUpdInsComponent implements OnChanges {
  @Input() mode: ModalMode = 'create';
  @Input() insumo: Insumo | null = null;

  @Output() close = new EventEmitter<void>();
  @Output() submit = new EventEmitter<any>();

  proveedoresOptions: { label: string; value: number }[] = [];
  unidadesOptions: { label: string; value: number }[] = [];

  load(): void {
    forkJoin({
      proveedores: this.proveedorService.getAll(),
      unidades: this.unidadService.getAll(),
    }).subscribe({
      next: ({ proveedores, unidades }) => {
        this.proveedoresOptions = (proveedores ?? []).map((p) => ({
          label: p.nombre,
          value: p.proveedor_id,
        }));

        this.unidadesOptions = (unidades ?? []).map((u) => ({
          label: u.nombre,
          value: u.unidad_id,
        }));

        // volver a cargar el form cuando ya existen las opciones
        this.loadForm();
      },
      error: (err) => {
        console.error('[LOAD] error:', err);
      },
    });
  }
  form!: FormGroup;
  submitted = false;

  gruposOptions = [
    { label: 'Weight', value: 'WEIGHT' },
    { label: 'Volume', value: 'VOLUME' },
    { label: 'Unit', value: 'UNIT' },
    { label: 'Other', value: 'OTHER' },
  ];

  estadoOptions = [
    { label: 'Active', value: 'A' },
    { label: 'Inactive', value: 'I' },
  ];

  constructor(
    private fb: FormBuilder,
    private proveedorService: ProveedorService,
    private unidadService: UnidadService,
  ) {
    this.form = this.fb.group({
      nombre: [null, Validators.required],
      descripcion: [null],
      grupo: [null, Validators.required],
      proveedor_id: [null],
      unidad_id: [null],
      cantidad: [0],
      stock_ideal: [0],
      stock: [0],
      estado: ['A', Validators.required],
    });
  }

  ngOnInit(): void {
    console.log('[Locations] ngOnInit');
    this.load();
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
        cantidad: Number(this.insumo.cantidad ?? 0),
        stock_ideal: Number(this.insumo.stock_ideal ?? 0),
        stock: Number(this.insumo.stock ?? 0),
        estado: this.insumo.estado ?? 'A',
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

    const payload = {
      ...this.form.getRawValue(),
      cantidad: Number(this.form.value.cantidad ?? 0),
      stock_ideal: Number(this.form.value.stock_ideal ?? 0),
      stock: Number(this.form.value.stock ?? 0),
    };

    console.log('[MODAL] submit payload:', payload);
    console.log('[MODAL] insumo actual:', this.insumo);

    this.submit.emit(payload);
  }

  get f() {
    return this.form.controls;
  }
}
