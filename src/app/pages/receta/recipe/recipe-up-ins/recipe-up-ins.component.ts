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
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';

import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { UnidadService } from '../../../../core/services/unidad.service';
import { RecetaService } from '../../../../core/services/receta.service';
import { RecetaFullCreate } from '../../../../core/models/receta-full-create.model';
import { InsumoService } from '../../../../core/services/insumo.service';
import { TabViewModule } from 'primeng/tabview';
import { MessageService } from 'primeng/api';
import { UploadService } from '../../../../core/services/upload.service';
import { FileUploadModule } from 'primeng/fileupload';
type ModalMode = 'create' | 'edit';
type UnidadOption = { label: string; value: number };
type InsumoOption = { label: string; value: number; grupo?: string };

@Component({
  selector: 'app-recipe-up-ins',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FloatLabelModule,
    InputTextModule,

    InputNumberModule,
    DropdownModule,
    ButtonModule,
    DividerModule,
    TabViewModule,
    FileUploadModule,
  ],
  templateUrl: './recipe-up-ins.component.html',
  styleUrl: './recipe-up-ins.component.scss',
})
export class RecipeUpInsComponent implements OnChanges {
  @Input() mode: ModalMode = 'create';
  @Input() receta: any | null = null;
  @Input() insumosOptions: InsumoOption[] = [];
  @Input() unidadesOptions: UnidadOption[] = [];

  @Output() close = new EventEmitter<void>();
  @Output() submit = new EventEmitter<RecetaFullCreate>();

  vCosto_total: number = 0;
  vPorcenta_venta: number = 0;
  vCosto_preparacion: number = 0;
  vCosto_neto: number = 0;
  vporciones: number = 0;
  vCosto_servicio: number = 0;

  unidadesOptionsByRow: UnidadOption[][] = [];
  saving = false;

  previewUrl: string | ArrayBuffer | null = null;
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private unidadService: UnidadService,
    private insumoService: InsumoService,
    private messageService: MessageService,
    private uploadService: UploadService,
  ) {
    this.form = this.fb.group({
      nombre: new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(2)],
      }),
      descripcion: new FormControl<string>(''),
      estado: new FormControl<'A' | 'I'>('A', { nonNullable: true }),
      created_by: new FormControl<string>('1', { nonNullable: true }),
      detalles: this.fb.array([]),
      porciones: new FormControl<number | null>(1, {
        validators: [Validators.required, Validators.min(1)],
      }),
      costo_preparacion: new FormControl<number | null>(1, {
        validators: [Validators.required, Validators.min(1)],
      }),
      imagen_url: new FormControl<string | null>(null),
    });
    // arranca con 1 detalle por defecto
    this.addDetalle();
  }

  onFileSelect(event: any): void {
    const file = event.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl = reader.result as string;
    };
    reader.readAsDataURL(file);

    this.uploadService.uploadRecipeImage(file).subscribe({
      next: (resp) => {
        if (!resp?.success || !resp?.url) {
          this.messageService.add({
            severity: 'error',
            summary: 'Upload error',
            detail: 'Image could not be uploaded',
          });
          return;
        }

        // Esta es la ruta real que guardarás en DB
        this.form.patchValue({
          imagen_url: resp.url,
        });

        console.log('Ruta guardada:', resp.url);
      },
      error: (err) => {
        console.error('Error upload:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Server error',
          detail: 'Could not upload image',
        });
      },
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['receta']) {
      this.loadForEdit();
    }
  }

  get detallesFA(): FormArray {
    return this.form.get('detalles') as FormArray;
  }

  private buildDetalleRow(d?: any): FormGroup {
    return this.fb.group({
      insumo_id: new FormControl<number | null>(d?.insumo_id ?? null, {
        validators: [Validators.required],
      }),
      unidad_id: new FormControl<number | null>(d?.unidad_id ?? null, {
        validators: [Validators.required],
      }),
      cantidad: new FormControl<number | null>(d?.cantidad ?? null, {
        validators: [Validators.required, Validators.min(0.0001)],
      }),
      precio_actual: new FormControl<number | null>(d?.precio_actual ?? null, {
        validators: [Validators.required, Validators.min(0)],
      }),
      created_by: new FormControl<string>(
        d?.created_by ?? this.form.get('created_by')?.value ?? '1',
        { nonNullable: true },
      ),
    });
  }

  onInsumoChange(i: number, insumoId: number | null): void {
    console.log(insumoId, i);
    // limpia unidad seleccionada
    const row = this.detallesFA.at(i) as FormGroup;
    row.get('unidad_id')?.setValue(null);

    if (!insumoId) {
      this.unidadesOptionsByRow[i] = [];
      return;
    }

    // buscar grupo del insumo en el combo
    const selected = this.insumosOptions.find(
      (x: any) => Number(x.value) === Number(insumoId),
    );
    const grupo = selected?.grupo;

    if (!grupo) {
      // si no hay grupo, no filtramos
      this.unidadesOptionsByRow[i] = this.unidadesOptions;
      return;
    }

    this.unidadService.getAll().subscribe({
      next: (unidades) => {
        this.unidadesOptionsByRow[i] = (unidades ?? []).map((u: any) => {
          return {
            label: `${u.nombre} (${u.abreviatura})`,
            value: Number(u.unidad_id),
          };
        });
      },
      error: (err) => {
        console.error('[Unidades] getByGrupo error:', err);
        this.unidadesOptionsByRow[i] = this.unidadesOptions;
      },
    });
  }

  addDetalle(): void {
    this.detallesFA.push(this.buildDetalleRow());
    this.detallesFA.markAsDirty();
  }

  removeDetalle(index: number): void {
    if (this.detallesFA.length <= 1) return;
    this.detallesFA.removeAt(index);
    this.detallesFA.markAsDirty();
  }

  loadForEdit(): void {
    if (!this.receta) return;

    // limpiar detalles
    while (this.detallesFA.length) this.detallesFA.removeAt(0);

    this.form.patchValue({
      nombre: this.receta.nombre ?? '',
      descripcion: this.receta.descripcion ?? '',
      estado: (this.receta.estado ?? 'A') as 'A' | 'I',
      created_by: this.receta.created_by ?? '1',
      imagen_url: this.receta.imagen_url ?? null,
    });

    const detalles = Array.isArray(this.receta.detalles)
      ? this.receta.detalles
      : [];
    if (detalles.length) {
      detalles.forEach((d: any) =>
        this.detallesFA.push(this.buildDetalleRow(d)),
      );
    } else {
      this.addDetalle();
    }

    this.form.markAsPristine();
  }

  getRowSubtotal(i: number): number {
    const g = this.detallesFA.at(i) as FormGroup;

    const cantidadRaw = g.get('cantidad')?.value;
    const precioRaw = g.get('precio_actual')?.value;
    const porcionesRaw = this.form.get('porciones')?.value;
    const costo_preparacionraw = this.form.get('costo_preparacion')?.value;

    const cantidad = Number(cantidadRaw ?? 0);
    const precio = Number(precioRaw ?? 0);
    this.vporciones = Number(porcionesRaw ?? 1);

    const subtotal = cantidad * precio;
    this.vCosto_total = subtotal;
    this.vPorcenta_venta = subtotal * 0.02;
    this.vCosto_preparacion = costo_preparacionraw;

    this.vCosto_neto =
      subtotal + this.vPorcenta_venta + this.vCosto_preparacion;

    this.vCosto_servicio = this.vCosto_neto / this.vporciones;
    return subtotal;
  }

  get totalCosto(): number {
    return this.detallesFA.controls.reduce(
      (acc, _, i) => acc + this.getRowSubtotal(i),
      0,
    );
  }

  onClose(): void {
    this.close.emit();
  }

  onSubmit(): void {
    this.form.markAllAsTouched();

    if (this.detallesFA.length === 0) {
      this.addDetalle();
      return;
    }

    if (this.form.invalid) return;

    const v = this.form.getRawValue();

    const payload: RecetaFullCreate = {
      receta: {
        nombre: (v.nombre ?? '').trim(),
        descripcion: v.descripcion?.trim() || null,
        porcenta_venta: Number(this.vPorcenta_venta ?? 0),
        costo_preparacion: Number(this.vCosto_preparacion ?? 0),
        costo_neto: Number(this.vCosto_neto ?? 0),
        costo_total: Number(this.vCosto_total ?? 0),
        porciones: Number(this.form.get('porciones')?.value ?? 1),
        imagen_url: v.imagen_url ?? null,
      },
      detalles: (v.detalles ?? []).map((d: any) => ({
        insumo_id: Number(d.insumo_id),
        unidad_id: Number(d.unidad_id),
        cantidad: Number(d.cantidad),
        precio_actual: Number(d.precio_actual),
      })),
    };

    if (!payload.detalles.length) return;

    console.log('[RecipeUpInsComponent] submit payload =>', payload);
    this.submit.emit(payload);
  }

  onCantidadChange(i: number): void {
    const g = this.detallesFA.at(i) as FormGroup;

    const cantidad = Number(g.get('cantidad')?.value ?? 0);
    const insumo_id = Number(g.get('insumo_id')?.value ?? 0);
    const unidad_receta = Number(g.get('unidad_id')?.value ?? 0);

    if (!insumo_id) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Ingredient missing',
        detail: 'Please select an ingredient first',
      });
      return;
    }

    if (!unidad_receta) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Unit missing',
        detail: 'Please select a unit',
      });
      return;
    }

    if (!cantidad || cantidad <= 0) return;

    this.insumoService
      .calcularPrecio({
        insumo_id,
        unidad_receta,
        cantidad_receta: cantidad,
        precio: 0,
        unidad_id: 0,
        cantidad: 0,
      })
      .subscribe({
        next: (precio) => {
          if (precio === null || precio === undefined || precio <= 0) {
            this.messageService.add({
              severity: 'error',
              summary: 'Price not found',
              detail: 'No price configured for this ingredient and unit',
            });

            g.get('precio_actual')?.setValue(null);
            return;
          }

          g.get('precio_actual')?.setValue(precio);
        },

        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Server error',
            detail: 'Could not calculate ingredient price',
          });
        },
      });
  }

  calcularPrecioFila(i: number): void {
    const g = this.detallesFA.at(i) as FormGroup;

    const insumo_id = Number(g.get('insumo_id')?.value ?? 0);
    const unidad_receta = Number(g.get('unidad_id')?.value ?? 0);
    const cantidad_receta = Number(g.get('cantidad')?.value ?? 0);

    if (!insumo_id || !unidad_receta || !cantidad_receta) return;

    this.insumoService
      .calcularPrecio({
        insumo_id: insumo_id,
        unidad_receta: unidad_receta,
        cantidad_receta: cantidad_receta,
        precio: 0, // precio compra
        unidad_id: unidad_receta,
        cantidad: 1,
      })
      .subscribe((precioCalculado) => {
        g.get('precio_actual')?.setValue(precioCalculado);
      });
  }

  onUnidadChange(i: number) {
    const g = this.detallesFA.at(i) as FormGroup;

    console.log('Unidad cambiada en fila', i);

    g.patchValue({
      cantidad: null,
      precio_actual: null,
    });

    g.get('cantidad')?.markAsUntouched();
    g.get('precio_actual')?.markAsUntouched();
  }
}
