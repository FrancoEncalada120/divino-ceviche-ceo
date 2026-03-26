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
import { Insumo } from '../../../../core/models/insumo.model';

type ModalMode = 'create' | 'edit';

@Component({
  selector: 'app-insumos-upd-ins',
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

  @Input() proveedoresOptions: { label: string; value: number }[] = [];
  @Input() unidadesOptions: { label: string; value: number }[] = [];

  @Output() close = new EventEmitter<void>();
  @Output() submit = new EventEmitter<any>();

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

  constructor(private fb: FormBuilder) {
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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['insumo'] || changes['mode']) {
      this.loadForm();
    }
  }

  private loadForm(): void {
    if (this.mode === 'edit' && this.insumo) {
      this.form.patchValue({
        nombre: this.insumo.nombre ?? null,
        descripcion: this.insumo.descripcion ?? null,
        grupo: this.insumo.grupo ?? null,
        proveedor_id: this.insumo.proveedor ?? 1,
        unidad_id: this.insumo.unidad ?? 2,
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

    this.submit.emit(payload);
  }

  get f() {
    return this.form.controls;
  }
}
