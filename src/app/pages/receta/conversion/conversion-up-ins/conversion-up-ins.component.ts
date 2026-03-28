import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';

import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RecConversion } from '../../../../core/models/conversion.model';

type ModalMode = 'create' | 'edit';
@Component({
  selector: 'app-conversion-up-ins',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputNumberModule,
    DropdownModule,
    ButtonModule,
  ],
  templateUrl: './conversion-up-ins.component.html',
  styleUrl: './conversion-up-ins.component.scss',
})
export class ConversionUpInsComponent implements OnChanges {
  @Input() mode: ModalMode = 'create';
  @Input() conversion: RecConversion | null = null;

  @Input() insumosOptions: { label: string; value: number; grupo?: string }[] = [];
  @Input() unidadesOptions: { label: string; value: number }[] = [];

  @Output() close = new EventEmitter<void>();
  @Output() submit = new EventEmitter<any>();

  form: FormGroup;

  submitted = false;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      insumo_id: [null, Validators.required],
      unidad_origen_id: [null, Validators.required],
      cantidad_origen: [null, [Validators.required, Validators.min(0.0001)]],
      unidad_destino_id: [null, Validators.required],
      cantidad_destino: [null, [Validators.required, Validators.min(0.0001)]],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['conversion'] || changes['mode']) {
      this.loadForm();
    }
  }

  private loadForm(): void {
    if (this.mode === 'edit' && this.conversion) {
      this.form.patchValue({
        insumo_id: this.conversion.insumo_id ?? null,
        unidad_origen_id: this.conversion.unidad_origen_id ?? null,
        cantidad_origen: Number(this.conversion.cantidad_origen ?? 0),
        unidad_destino_id: this.conversion.unidad_destino_id ?? null,
        cantidad_destino: Number(this.conversion.cantidad_destino ?? 0),
      });
    } else {
      this.form.reset({
        insumo_id: null,
        unidad_origen_id: null,
        cantidad_origen: null,
        unidad_destino_id: null,
        cantidad_destino: null,
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
      cantidad_origen: Number(this.form.value.cantidad_origen),
      cantidad_destino: Number(this.form.value.cantidad_destino),
    };

    this.submit.emit(payload);
  }

  get f() {
    return this.form.controls;
  }
}
